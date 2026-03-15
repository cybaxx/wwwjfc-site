<script>
  import { untrack } from 'svelte';
  import { fade, fly } from 'svelte/transition';
  import DraggableWindow from './DraggableWindow.svelte';
  import { gameState } from '../lib/gameState.svelte.js';
  import { getNode } from '../lib/storyNodes.js';

  let { dialogOpen = $bindable(false) } = $props();

  // Local visibility that syncs with gameState
  let panelVisible = $state(false);

  // gameState → local
  $effect(() => {
    panelVisible = gameState.storyVisible;
  });

  // local → gameState (only when user closes window via X)
  $effect(() => {
    const v = panelVisible;
    untrack(() => {
      if (!v && gameState.storyVisible) {
        gameState.hideStory();
      }
    });
  });

  // Sync panelVisible → dialogOpen for parent backdrop tracking
  $effect(() => {
    dialogOpen = panelVisible && !!currentNodeData;
  });

  let displayedText = $state('');
  let typewriterDone = $state(false);
  let typewriterInterval = null;

  const currentNodeData = $derived.by(() => {
    const node = getNode(gameState.currentNode);
    if (!node) return null;
    // Dynamic choices for fsociety workbench
    if (node.id === 'fsociety_workbench') {
      const dynamicChoices = [];
      const unfixed = gameState.TIME_MACHINE_PARTS.filter(p => gameState.hasItem(p.id) && !gameState.isPartFixed(p.id));
      unfixed.forEach(p => {
        dynamicChoices.push({ id: `fix_${p.id}`, text: `> repair ${p.name}`, next: `fix_${p.id}` });
      });
      if (unfixed.length === 0 && gameState.TIME_MACHINE_PARTS.every(p => gameState.isPartFixed(p.id))) {
        dynamicChoices.push({ id: 'assemble', text: '> all parts clean — assemble the Time Machine', next: 'assembly_check' });
      }
      dynamicChoices.push({ id: 'leave', text: '> leave', next: 'hub_nexus' });
      return { ...node, choices: dynamicChoices };
    }
    return node;
  });

  // Typewriter effect when node changes
  $effect(() => {
    const node = currentNodeData;
    if (!node || !gameState.gameStarted) return;

    typewriterDone = false;
    displayedText = '';
    let text = node.text;

    // Replace inventory check placeholder
    if (text.includes('{{INVENTORY_CHECK}}')) {
      const checks = gameState.TIME_MACHINE_PARTS.map(p => {
        const has = gameState.hasItem(p.id);
        const fixed = gameState.isPartFixed(p.id);
        const status = fixed ? 'FIXED' : has ? 'DAMAGED — needs repair at fsociety arcade' : 'MISSING';
        return `${fixed ? '[✓]' : has ? '[⚠]' : '[ ]'} ${p.name} — ${status}`;
      }).join('\n');
      text = text.replace('{{INVENTORY_CHECK}}', checks);
    }

    // Replace workbench status placeholder
    if (text.includes('{{WORKBENCH_STATUS}}')) {
      const collected = gameState.TIME_MACHINE_PARTS.filter(p => gameState.hasItem(p.id));
      const unfixed = collected.filter(p => !gameState.isPartFixed(p.id));
      const fixed = collected.filter(p => gameState.isPartFixed(p.id));
      let statusLines = [];
      unfixed.forEach(p => statusLines.push(`[⚠ CORRUPTED] ${p.name} — ready for repair`));
      fixed.forEach(p => statusLines.push(`[✓ CLEAN] ${p.name}`));
      const uncollected = gameState.TIME_MACHINE_PARTS.filter(p => !gameState.hasItem(p.id));
      uncollected.forEach(p => statusLines.push(`[  MISSING] ${p.name} — not yet collected`));
      if (unfixed.length === 0 && uncollected.length === 0) {
        statusLines.push('\nAll parts repaired. The machine is ready.');
      }
      text = text.replace('{{WORKBENCH_STATUS}}', statusLines.join('\n'));
    }

    let i = 0;
    if (typewriterInterval) clearInterval(typewriterInterval);
    typewriterInterval = setInterval(() => {
      if (i < text.length) {
        displayedText = text.slice(0, i + 1);
        i++;
      } else {
        clearInterval(typewriterInterval);
        typewriterInterval = null;
        typewriterDone = true;
      }
    }, 18);

    return () => {
      if (typewriterInterval) clearInterval(typewriterInterval);
    };
  });

  function skipTypewriter() {
    if (typewriterInterval) {
      clearInterval(typewriterInterval);
      typewriterInterval = null;
    }
    if (currentNodeData) {
      let text = currentNodeData.text;
      if (text.includes('{{INVENTORY_CHECK}}')) {
        const checks = gameState.TIME_MACHINE_PARTS.map(p => {
          const has = gameState.hasItem(p.id);
          return `${has ? '[✓]' : '[ ]'} ${p.name} — ${has ? 'ACQUIRED' : 'MISSING'}`;
        }).join('\n');
        text = text.replace('{{INVENTORY_CHECK}}', checks);
      }
      displayedText = text;
    }
    typewriterDone = true;
  }

  function makeChoice(choice) {
    if (!typewriterDone) {
      skipTypewriter();
      return;
    }

    if (choice.requiresAll && !gameState.canEscape) {
      gameState.addNarrativeLine('You don\'t have all the parts yet.', 'system');
      return;
    }

    gameState.recordChoice(gameState.currentNode, choice.id);

    if (choice.setFlag) {
      gameState.setFlag(choice.setFlag);
    }

    if (currentNodeData?.grantsItem) {
      gameState.addItem(currentNodeData.grantsItem);
      gameState.addNarrativeLine(`Acquired: ${gameState.TIME_MACHINE_PARTS.find(p => p.id === currentNodeData.grantsItem)?.name}`, 'item');
    }

    if (Math.random() < 0.6) {
      gameState.requestAd();
    }

    if (choice.next === null) {
      gameState.hideStory();
      return;
    }
    // Start challenge when entering a fix node
    if (choice.next.startsWith('fix_')) {
      const partId = choice.next.replace('fix_', '');
      gameState.startChallenge(partId);
    }
    gameState.navigate(choice.next);
  }
</script>

{#if panelVisible && currentNodeData}
  <DraggableWindow
    title="CYBA://DREAM — {currentNodeData.location ? currentNodeData.location.replace(/-/g, ' ').toUpperCase() : 'NEXUS'}"
    bind:visible={panelVisible}
    width="660px"
    maxHeight="75vh"
    zBase={700}
    borderColor="#00f0ff"
    titleIcon="◈"
    initialX={60}
    initialY={60}
  >
    <div class="story-inner">
      <!-- Location badge -->
      {#if currentNodeData.location}
        <div class="story-location">
          <span class="location-icon">◈</span>
          <span>{currentNodeData.location.replace(/-/g, ' ').toUpperCase()}</span>
        </div>
      {/if}

      <!-- Story text -->
      <div class="story-text" onclick={skipTypewriter} role="presentation">
        {#each displayedText.split('\n') as line}
          <p class:empty={line === ''}>{line || '\u00A0'}</p>
        {/each}
        {#if !typewriterDone}
          <span class="story-cursor">▊</span>
        {/if}
      </div>

      <!-- Choices -->
      {#if typewriterDone && currentNodeData.choices}
        <div class="story-choices" transition:fade={{ duration: 200 }}>
          {#each currentNodeData.choices as choice}
            <button
              class="story-choice"
              onclick={() => makeChoice(choice)}
              class:disabled={choice.requiresAll && !gameState.canEscape}
            >
              {choice.text}
            </button>
          {/each}
        </div>
      {/if}

      <!-- Click to skip hint -->
      {#if !typewriterDone}
        <div class="skip-hint">click to skip</div>
      {/if}
    </div>
  </DraggableWindow>
{/if}

<style>
  .story-inner {
    padding: 1.5rem 2rem;
    position: relative;
  }

  .story-inner::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0; bottom: 0;
    background: repeating-linear-gradient(
      0deg, transparent, transparent 2px,
      rgba(0, 240, 255, 0.008) 2px, rgba(0, 240, 255, 0.008) 4px
    );
    pointer-events: none;
  }

  .story-location {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.3rem 0.8rem;
    background: rgba(0, 240, 255, 0.08);
    border: 1px solid rgba(0, 240, 255, 0.2);
    color: #00f0ff;
    font-size: 0.7rem;
    letter-spacing: 2px;
    margin-bottom: 1.5rem;
  }

  .location-icon {
    color: #39ff14;
  }

  .story-text {
    color: #d0d0d0;
    font-size: 0.9rem;
    line-height: 1.8;
    cursor: pointer;
    position: relative;
    z-index: 1;
  }

  .story-text p {
    margin: 0 0 0.3rem;
  }

  .story-text p.empty {
    height: 0.8rem;
  }

  .story-cursor {
    color: #00f0ff;
    animation: cursorBlink 0.6s step-end infinite;
  }

  @keyframes cursorBlink {
    50% { opacity: 0; }
  }

  .story-choices {
    margin-top: 1.5rem;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    position: relative;
    z-index: 1;
  }

  .story-choice {
    text-align: left;
    padding: 0.7rem 1rem;
    background: rgba(0, 240, 255, 0.05);
    border: 1px solid rgba(0, 240, 255, 0.2);
    color: #00f0ff;
    font-family: 'Share Tech Mono', monospace;
    font-size: 0.85rem;
    cursor: pointer;
    transition: all 0.2s;
    letter-spacing: 0.5px;
  }

  .story-choice:hover {
    background: rgba(0, 240, 255, 0.12);
    border-color: #00f0ff;
    box-shadow: 0 0 15px rgba(0, 240, 255, 0.2);
    text-shadow: 0 0 8px rgba(0, 240, 255, 0.5);
    transform: translateX(4px);
  }

  .story-choice.disabled {
    opacity: 0.4;
    cursor: not-allowed;
    border-color: rgba(255, 0, 0, 0.3);
    color: #ff0000;
  }

  .skip-hint {
    text-align: center;
    color: #555;
    font-size: 0.65rem;
    margin-top: 1rem;
    letter-spacing: 1px;
    position: relative;
    z-index: 1;
  }
</style>
