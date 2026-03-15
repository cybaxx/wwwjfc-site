<script>
  let { bootComplete = false } = $props();

  let canvas = $state(null);
  let playing = $state(false);
  let iframeEl = $state(null);
  let animationFrame = null;
  let bars = [];
  const BAR_COUNT = 24;
  const VIDEO_ID = 'dZ2NQ-xQINI';

  for (let i = 0; i < BAR_COUNT; i++) {
    bars.push({ current: 0, target: Math.random() });
  }

  function togglePlay() {
    if (!playing) {
      // Create/show the iframe on user click — satisfies autoplay policy
      playing = true;
    } else {
      playing = false;
    }
  }

  function animate() {
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const w = canvas.width;
    const h = canvas.height;
    ctx.clearRect(0, 0, w, h);

    const barWidth = w / BAR_COUNT;
    const gap = 1;

    for (let i = 0; i < BAR_COUNT; i++) {
      const bar = bars[i];
      if (playing) {
        bar.current += (bar.target - bar.current) * 0.08;
        if (Math.random() < 0.05) {
          bar.target = Math.random() * 0.6 + 0.1;
        }
      } else {
        bar.current += (0 - bar.current) * 0.05;
      }

      const barH = bar.current * h * 0.8;
      const x = i * barWidth + gap;
      const y = h - barH;

      const ratio = i / BAR_COUNT;
      const r = Math.floor(30 + ratio * 180);
      const g = Math.floor(220 - ratio * 140);
      const b = Math.floor(220 + ratio * 35);
      ctx.fillStyle = `rgba(${r}, ${g}, ${b}, 0.6)`;
      ctx.fillRect(x, y, barWidth - gap * 2, barH);
    }

    animationFrame = requestAnimationFrame(animate);
  }

  $effect(() => {
    if (bootComplete && canvas) {
      canvas.width = 60;
      canvas.height = window.innerHeight;
      animate();

      const onResize = () => {
        if (canvas) canvas.height = window.innerHeight;
      };
      window.addEventListener('resize', onResize);

      return () => {
        if (animationFrame) cancelAnimationFrame(animationFrame);
        window.removeEventListener('resize', onResize);
      };
    }
  });
</script>

{#if bootComplete}
  <div class="audio-visualizer">
    {#if playing}
      <iframe
        bind:this={iframeEl}
        class="yt-iframe"
        src="https://www.youtube.com/embed/{VIDEO_ID}?autoplay=1&loop=1&playlist={VIDEO_ID}&controls=0&disablekb=1&fs=0&modestbranding=1&vol=30"
        allow="autoplay; encrypted-media"
        frameborder="0"
        title="Background audio"
      ></iframe>
    {/if}
    <canvas bind:this={canvas}></canvas>
    <button class="play-btn" onclick={togglePlay} title={playing ? 'Pause' : 'Play'}>
      {playing ? '⏸' : '▶'}
    </button>
  </div>
{/if}

<style>
  .audio-visualizer {
    position: fixed;
    left: 0;
    top: 0;
    width: 60px;
    height: 100vh;
    z-index: 0;
    pointer-events: none;
    overflow: hidden;
  }

  .yt-iframe {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 60px;
    height: 50px;
    border: none;
    opacity: 0.01;
    pointer-events: none;
  }

  canvas {
    position: absolute;
    top: 0;
    left: 0;
    display: block;
    width: 60px;
    height: 100vh;
  }

  .play-btn {
    position: absolute;
    bottom: 12px;
    left: 8px;
    pointer-events: auto;
    background: rgba(0, 0, 0, 0.6);
    border: 1px solid rgba(0, 255, 200, 0.3);
    color: #0fc;
    font-size: 16px;
    width: 36px;
    height: 36px;
    border-radius: 4px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: border-color 0.2s;
    z-index: 2;
  }

  .play-btn:hover {
    border-color: rgba(0, 255, 200, 0.7);
  }
</style>
