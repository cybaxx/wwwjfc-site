<script>
  import { slide } from 'svelte/transition';
  import { gameState } from '../lib/gameState.svelte.js';

  let expanded = $state(false);
</script>

{#if gameState.gameStarted}
  <div class="inventory-hud" class:expanded>
    <button class="hud-toggle" onclick={() => expanded = !expanded}>
      <span class="hud-icon">⚙</span>
      <span class="hud-label">TIME MACHINE</span>
      <span class="hud-pct">{gameState.completionPercent}%</span>
    </button>

    {#if expanded}
      <div class="hud-details" transition:slide={{ duration: 200 }}>
        {#each gameState.TIME_MACHINE_PARTS as part}
          <div class="hud-part" class:collected={gameState.hasItem(part.id)}>
            <span class="part-status">{gameState.hasItem(part.id) ? '◉' : '○'}</span>
            <span class="part-name">{part.name}</span>
          </div>
        {/each}
        <div class="hud-bar">
          <div class="hud-bar-fill" style="width: {gameState.completionPercent}%"></div>
        </div>
      </div>
    {/if}
  </div>
{/if}

<style>
  .inventory-hud {
    position: fixed;
    bottom: 1rem;
    right: 1rem;
    z-index: 900;
    font-family: 'Share Tech Mono', monospace;
    background: rgba(10, 10, 20, 0.9);
    border: 1px solid rgba(0, 240, 255, 0.3);
    backdrop-filter: blur(8px);
    min-width: 180px;
  }

  .hud-toggle {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    width: 100%;
    padding: 0.5rem 0.8rem;
    background: none;
    border: none;
    color: #00f0ff;
    font-family: 'Share Tech Mono', monospace;
    font-size: 0.7rem;
    cursor: pointer;
    letter-spacing: 1px;
    transition: background 0.2s;
  }

  .hud-toggle:hover {
    background: rgba(0, 240, 255, 0.08);
  }

  .hud-icon {
    font-size: 1rem;
  }

  .hud-label {
    flex: 1;
    text-align: left;
  }

  .hud-pct {
    color: #39ff14;
    font-weight: bold;
  }

  .hud-details {
    padding: 0.5rem 0.8rem;
    border-top: 1px solid rgba(0, 240, 255, 0.15);
  }

  .hud-part {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.2rem 0;
    font-size: 0.7rem;
    color: #555;
    transition: color 0.3s;
  }

  .hud-part.collected {
    color: #39ff14;
  }

  .part-status {
    font-size: 0.8rem;
  }

  .hud-bar {
    margin-top: 0.5rem;
    height: 3px;
    background: rgba(0, 240, 255, 0.1);
    border-radius: 2px;
    overflow: hidden;
  }

  .hud-bar-fill {
    height: 100%;
    background: linear-gradient(90deg, #00f0ff, #39ff14);
    transition: width 0.5s ease;
    box-shadow: 0 0 8px rgba(0, 240, 255, 0.5);
  }
</style>
