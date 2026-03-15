<script>
  import { fade } from 'svelte/transition';

  let {
    title = 'WINDOW',
    visible = $bindable(true),
    initialX = -1,
    initialY = -1,
    width = '650px',
    minWidth = '320px',
    maxHeight = '80vh',
    zBase = 500,
    borderColor = '#00f0ff',
    titleIcon = '◈',
    children,
  } = $props();

  let windowEl = $state();
  let x = $state(initialX);
  let y = $state(initialY);
  let dragging = $state(false);
  let dragOffsetX = 0;
  let dragOffsetY = 0;
  let zIndex = $state(zBase);
  let centered = $state(initialX < 0 || initialY < 0);

  // Global focus tracking — clicking a window brings it to front
  // Start at 700 to stay above backdrop (z-index: 699)
  let focusCounter = globalThis.__windowFocusCounter || 700;

  function bringToFront() {
    focusCounter = Math.max(focusCounter, 700) + 1;
    globalThis.__windowFocusCounter = focusCounter;
    zIndex = focusCounter;
  }

  function startDrag(e) {
    if (e.target.closest('button') || e.target.closest('input') || e.target.closest('textarea')) return;
    dragging = true;
    bringToFront();
    const rect = windowEl.getBoundingClientRect();
    dragOffsetX = e.clientX - rect.left;
    dragOffsetY = e.clientY - rect.top;
    centered = false;
    x = rect.left;
    y = rect.top;
    e.preventDefault();
  }

  function onMouseMove(e) {
    if (!dragging) return;
    x = Math.max(0, Math.min(window.innerWidth - 100, e.clientX - dragOffsetX));
    y = Math.max(0, Math.min(window.innerHeight - 40, e.clientY - dragOffsetY));
  }

  function onMouseUp() {
    dragging = false;
  }

  function handleWindowClick() {
    bringToFront();
  }
</script>

<svelte:window onmousemove={onMouseMove} onmouseup={onMouseUp} />

{#if visible}
  <div
    class="draggable-window"
    class:centered
    bind:this={windowEl}
    style="
      {centered ? '' : `left: ${x}px; top: ${y}px;`}
      width: {width};
      min-width: {minWidth};
      max-height: {maxHeight};
      z-index: {zIndex};
      --border-color: {borderColor};
    "
    onclick={handleWindowClick}
    onkeydown={(e) => e.key === 'Escape' && (visible = false)}
    role="dialog"
    tabindex="-1"
    aria-label={title}
    transition:fade={{ duration: 150 }}
  >
    <!-- Title bar / drag handle -->
    <div
      class="window-titlebar"
      onmousedown={startDrag}
      role="presentation"
    >
      <span class="window-title">
        <span class="window-dot red"></span>
        <span class="window-dot yellow"></span>
        <span class="window-dot green"></span>
        <span class="title-icon">{titleIcon}</span>
        {title}
      </span>
      <button class="window-close" onclick={() => visible = false}>&times;</button>
    </div>

    <!-- Content -->
    <div class="window-content">
      {@render children()}
    </div>
  </div>
{/if}

<style>
  .draggable-window {
    position: fixed;
    background: rgba(10, 12, 20, 0.96);
    border: 1px solid var(--border-color, #00f0ff);
    border-radius: 6px;
    box-shadow:
      0 0 30px color-mix(in srgb, var(--border-color) 30%, transparent),
      0 0 60px color-mix(in srgb, var(--border-color) 10%, transparent),
      0 4px 30px rgba(0, 0, 0, 0.5);
    display: flex;
    flex-direction: column;
    overflow: hidden;
    font-family: 'Share Tech Mono', monospace;
  }

  .draggable-window.centered {
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
  }

  .window-titlebar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.5rem 0.8rem;
    background: color-mix(in srgb, var(--border-color) 8%, transparent);
    border-bottom: 1px solid color-mix(in srgb, var(--border-color) 20%, transparent);
    cursor: grab;
    user-select: none;
    flex-shrink: 0;
  }

  .window-titlebar:active {
    cursor: grabbing;
  }

  .window-title {
    display: flex;
    align-items: center;
    gap: 0.4rem;
    font-size: 0.75rem;
    color: var(--border-color);
    letter-spacing: 1px;
  }

  .title-icon {
    margin-left: 0.3rem;
  }

  .window-dot {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    display: inline-block;
  }
  .window-dot.red { background: #ff5f56; }
  .window-dot.yellow { background: #ffbd2e; }
  .window-dot.green { background: #27c93f; }

  .window-close {
    background: none;
    border: none;
    color: var(--border-color);
    font-size: 1.2rem;
    cursor: pointer;
    padding: 0 0.3rem;
    transition: color 0.2s;
  }
  .window-close:hover { color: #ff00aa; }

  .window-content {
    flex: 1;
    overflow-y: auto;
    min-height: 0;
  }
</style>
