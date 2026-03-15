<script>
  import { fly, fade, scale } from 'svelte/transition';
  import { pausableTimeout, pausableInterval } from '../lib/gameState.svelte.js';

  let {
    ad,
    tier = 1,
    onclose = () => {},
  } = $props();

  let showReal = $state(false);
  let countdown = $state(0);
  let dodgeX = $state(0);
  let dodgeY = $state(0);
  let fakeCloseClicked = $state(false);
  let showLore = $state(false);
  let flashing = $state(false);

  // Evade state — ad runs away from close button clicks
  let evadeCount = $state(0);

  // Tier 1: show real close after 3s
  // Tier 2: fake close first, real close is small
  // Tier 3: dodge, countdown, spawn
  $effect(() => {
    if (tier === 1) {
      const t = pausableTimeout(() => { showReal = true; }, 3000);
      return () => t.clear();
    } else {
      showReal = true;
    }
  });

  $effect(() => {
    countdown = ad?.countdown || 0;
  });

  $effect(() => {
    if (countdown > 0) {
      const t = pausableInterval(() => {
        countdown--;
        if (countdown <= 0) t.clear();
      }, 1000);
      return () => t.clear();
    }
  });

  // Autoclose with flash effect
  $effect(() => {
    if (ad?._autoclose) {
      const dur = ad._autocloseDuration || 3000;
      const flashStart = pausableTimeout(() => {
        flashing = true;
      }, dur - 800);
      const closeTimer = pausableTimeout(() => {
        onclose();
      }, dur);
      return () => {
        flashStart.clear();
        closeTimer.clear();
      };
    }
  });

  function handleFakeClose() {
    fakeCloseClicked = true;
    showLore = true;
  }

  function handleRealClose() {
    // If ad evades, move it instead of closing
    if (ad?._evades && evadeCount < (ad._maxEvades || 2)) {
      evadeCount++;
      // Jump to a random position
      dodgeX = (Math.random() - 0.5) * 300;
      dodgeY = (Math.random() - 0.5) * 200;
      return;
    }
    onclose();
  }

  function handleDodge(e) {
    if (!ad?.dodges) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = e.clientX - cx;
    const dy = e.clientY - cy;
    dodgeX += (dx > 0 ? -1 : 1) * (Math.random() * 80 + 40);
    dodgeY += (dy > 0 ? -1 : 1) * (Math.random() * 60 + 30);
    dodgeX = Math.max(-200, Math.min(200, dodgeX));
    dodgeY = Math.max(-200, Math.min(200, dodgeY));
  }

  // Credit badge display
  let creditLabel = $derived(
    ad?._creditsGain ? `+${ad._creditsGain} ¥CR` :
    ad?._creditsLoss ? `-${ad._creditsLoss} ¥CR` : null
  );
  let creditClass = $derived(ad?._creditsGain ? 'gain' : 'loss');
</script>

<div
  class="ad-popup tier-{tier}"
  class:aggressive={tier === 3}
  class:flashing
  style="transform: translate({dodgeX}px, {dodgeY}px)"
  onmousemove={tier === 3 ? handleDodge : undefined}
  role="dialog"
  aria-label="Advertisement"
  transition:scale={{ duration: 300, start: 0.8 }}
>
  <!-- Scanline overlay -->
  <div class="ad-scanlines"></div>

  <!-- Header -->
  <div class="ad-header">
    <span class="ad-sponsor">SPONSORED DREAM CONTENT</span>
    {#if creditLabel}
      <span class="credit-badge {creditClass}">{creditLabel}</span>
    {/if}
    {#if ad?._manualOnly || (tier >= 2 && !fakeCloseClicked)}
      {#if tier >= 2 && !fakeCloseClicked}
        <button class="ad-close fake" onclick={handleFakeClose} aria-label="Close ad">✕</button>
      {/if}
    {/if}
    {#if showReal && (tier === 1 || fakeCloseClicked || ad?._manualOnly)}
      <button
        class="ad-close real"
        class:tiny={tier >= 2 && !ad?._manualOnly}
        onclick={handleRealClose}
        aria-label="Close ad"
      >{tier >= 2 && !ad?._manualOnly ? '·' : '✕'}</button>
    {/if}
  </div>

  <!-- Body -->
  <div class="ad-body">
    <h3 class="ad-title">{ad.title}</h3>
    <p class="ad-tagline">{ad.tagline}</p>
    <p class="ad-text">{ad.body}</p>
    <div class="ad-price">{ad.price}</div>
    <button class="ad-cta" onclick={handleRealClose}>{ad.cta}</button>

    {#if countdown > 0}
      <div class="ad-countdown">This ad closes in {countdown}s</div>
    {/if}

    {#if ad?._evades && evadeCount > 0 && evadeCount <= (ad._maxEvades || 2)}
      <div class="evade-taunt">
        {evadeCount < (ad._maxEvades || 2) ? "Ha! You think it's that easy?" : "Fine. You can close me now."}
      </div>
    {/if}
  </div>

  <!-- Hidden lore -->
  {#if showLore || tier === 1}
    <div class="ad-lore" transition:fade={{ duration: 500 }}>
      <span class="lore-label">// intercepted fragment:</span>
      <span class="lore-text">{ad.lore}</span>
    </div>
  {/if}
</div>

<style>
  .ad-popup {
    position: relative;
    width: 380px;
    max-width: 90vw;
    background: rgba(10, 10, 20, 0.95);
    border: 1px solid #ff00aa;
    border-radius: 2px;
    font-family: 'Share Tech Mono', monospace;
    box-shadow:
      0 0 30px rgba(255, 0, 170, 0.3),
      0 0 60px rgba(255, 0, 170, 0.1),
      inset 0 0 30px rgba(0, 0, 0, 0.5);
    overflow: hidden;
    transition: transform 0.15s ease-out;
    z-index: 10001;
  }

  .ad-popup.aggressive {
    border-color: #ff0000;
    animation: adGlitch 0.3s infinite;
    box-shadow:
      0 0 40px rgba(255, 0, 0, 0.4),
      0 0 80px rgba(255, 0, 0, 0.15);
  }

  .ad-popup.flashing {
    animation: adFlash 0.15s ease-in-out infinite;
  }

  @keyframes adGlitch {
    0%, 100% { transform: translate(var(--dx, 0), var(--dy, 0)); }
    25% { transform: translate(calc(var(--dx, 0) + 1px), calc(var(--dy, 0) - 1px)); }
    75% { transform: translate(calc(var(--dx, 0) - 1px), calc(var(--dy, 0) + 1px)); }
  }

  @keyframes adFlash {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.1; }
  }

  .ad-scanlines {
    position: absolute;
    top: 0; left: 0; right: 0; bottom: 0;
    background: repeating-linear-gradient(
      0deg,
      transparent, transparent 2px,
      rgba(255, 0, 170, 0.03) 2px,
      rgba(255, 0, 170, 0.03) 4px
    );
    pointer-events: none;
    z-index: 1;
  }

  .ad-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.5rem 0.8rem;
    background: rgba(255, 0, 170, 0.1);
    border-bottom: 1px solid rgba(255, 0, 170, 0.3);
    position: relative;
    z-index: 2;
    gap: 0.4rem;
  }

  .ad-sponsor {
    font-size: 0.6rem;
    color: #ff00aa;
    letter-spacing: 2px;
    text-transform: uppercase;
  }

  .credit-badge {
    font-size: 0.6rem;
    padding: 0.15rem 0.4rem;
    border-radius: 2px;
    letter-spacing: 1px;
    font-weight: bold;
  }

  .credit-badge.gain {
    color: #39ff14;
    background: rgba(57, 255, 20, 0.1);
    border: 1px solid rgba(57, 255, 20, 0.3);
  }

  .credit-badge.loss {
    color: #ff4444;
    background: rgba(255, 0, 0, 0.1);
    border: 1px solid rgba(255, 0, 0, 0.3);
  }

  .ad-close {
    background: none;
    border: 1px solid rgba(255, 255, 255, 0.3);
    color: #fff;
    width: 22px;
    height: 22px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    font-size: 0.8rem;
    transition: all 0.2s;
  }

  .ad-close:hover {
    background: #ff00aa;
    border-color: #ff00aa;
  }

  .ad-close.fake {
    border-color: #ff00aa;
  }

  .ad-close.tiny {
    width: 8px;
    height: 8px;
    font-size: 0.3rem;
    opacity: 0.3;
    position: absolute;
    right: 2px;
    top: 2px;
    border: none;
  }

  .ad-close.tiny:hover {
    opacity: 1;
  }

  .ad-body {
    padding: 1.2rem;
    position: relative;
    z-index: 2;
  }

  .ad-title {
    font-family: 'Orbitron', sans-serif;
    color: #ff00aa;
    font-size: 1.1rem;
    margin: 0 0 0.3rem;
    text-shadow: 0 0 10px rgba(255, 0, 170, 0.5);
  }

  .ad-tagline {
    color: #ffe600;
    font-size: 0.75rem;
    letter-spacing: 2px;
    margin: 0 0 0.8rem;
    text-transform: uppercase;
  }

  .ad-text {
    color: #aaa;
    font-size: 0.8rem;
    line-height: 1.5;
    margin: 0 0 1rem;
    white-space: pre-wrap;
  }

  .ad-price {
    color: #39ff14;
    font-size: 1.2rem;
    font-weight: bold;
    margin-bottom: 0.8rem;
    text-shadow: 0 0 8px rgba(57, 255, 20, 0.5);
  }

  .ad-cta {
    display: block;
    width: 100%;
    padding: 0.7rem;
    background: linear-gradient(135deg, #ff00aa, #ff6600);
    border: none;
    color: #fff;
    font-family: 'Orbitron', sans-serif;
    font-size: 0.8rem;
    letter-spacing: 2px;
    text-transform: uppercase;
    cursor: pointer;
    transition: all 0.3s;
    text-shadow: 0 0 5px rgba(255, 255, 255, 0.5);
  }

  .ad-cta:hover {
    background: linear-gradient(135deg, #ff33bb, #ff8833);
    box-shadow: 0 0 20px rgba(255, 0, 170, 0.4);
  }

  .ad-countdown {
    text-align: center;
    color: #ff6600;
    font-size: 0.7rem;
    margin-top: 0.5rem;
    animation: countdownPulse 1s ease-in-out infinite;
  }

  @keyframes countdownPulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.5; }
  }

  .evade-taunt {
    text-align: center;
    color: #ff00aa;
    font-size: 0.7rem;
    margin-top: 0.5rem;
    font-style: italic;
    animation: tauntPulse 0.5s ease-in-out;
  }

  @keyframes tauntPulse {
    0% { transform: scale(1.1); }
    100% { transform: scale(1); }
  }

  .ad-lore {
    padding: 0.6rem 1.2rem;
    background: rgba(57, 255, 20, 0.05);
    border-top: 1px solid rgba(57, 255, 20, 0.2);
    position: relative;
    z-index: 2;
  }

  .lore-label {
    display: block;
    color: #39ff14;
    font-size: 0.6rem;
    opacity: 0.6;
    margin-bottom: 0.2rem;
  }

  .lore-text {
    color: #39ff14;
    font-size: 0.7rem;
    opacity: 0.8;
    font-style: italic;
  }

  .tier-2 {
    border-color: #ff6600;
    box-shadow:
      0 0 30px rgba(255, 102, 0, 0.3),
      0 0 60px rgba(255, 102, 0, 0.1);
  }

  .tier-3 {
    border-color: #ff0000;
  }
</style>
