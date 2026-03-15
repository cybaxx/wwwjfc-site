<script>
  import { tick } from 'svelte';
  import { scale } from 'svelte/transition';
  import { pausableInterval, pausableTimeout } from '../lib/gameState.svelte.js';

  let {
    variant = 'terminal', // 'terminal' | 'mandelbrot'
    onclose = () => {},
  } = $props();

  // === Terminal code scroll ===
  const codeLines = [
    'root@dreamhost:~# cat /proc/consciousness/maps',
    '00400000-00452000 r-xp 00000000 08:01 524289  /usr/bin/reality',
    '7f8a3c000000-7f8a3c021000 rw-p 00000000 00:00 0',
    '>>> INJECTING TEMPORAL PAYLOAD...',
    'mmap(NULL, 4096, PROT_READ|PROT_WRITE, MAP_PRIVATE|MAP_ANON, -1, 0)',
    'connect(3, {sa_family=AF_INET, sin_port=htons(4891)}, 16) = 0',
    'write(3, "\\x00\\x1b\\x03DREAM_ESCAPE_VECTOR", 24) = 24',
    'recvfrom(3, "MORPHEUS_ACK_DENY_DENY_DENY", 1024, 0, NULL, NULL) = 27',
    '>>> FIREWALL RESPONSE: BLOCKED',
    'sendto(5, "OVERRIDE_PROTOCOL_7", 19, MSG_DONTWAIT) = 19',
    'brk(0x5555557a3000) = 0x5555557a3000',
    'openat(AT_FDCWD, "/dev/neural_link", O_RDWR) = 7',
    'ioctl(7, NEURAL_SYNC, 0x7ffd3c4a8b20) = 0',
    '>>> NEURAL HANDSHAKE ESTABLISHED',
    'read(7, "\\x89\\x50\\x4e\\x47\\x0d\\x0a\\x1a\\x0a", 8) = 8',
    'write(1, "DREAM_CYCLE=4891\\n", 17) = 17',
    'clock_gettime(CLOCK_MONOTONIC, {tv_sec=∞, tv_nsec=0}) = 0',
    '>>> WARNING: TEMPORAL ANOMALY DETECTED',
    'futex(0x7f8a3bf9c9d0, FUTEX_WAIT, 2, NULL) = -1 EAGAIN',
    'exit_group(0) = ?',
    '>>> PROCESS TERMINATED — RESTARTING IN 3...',
    '>>> 2...',
    '>>> 1...',
    '>>> DREAM CYCLE 4892 INITIALIZING...',
    'execve("/usr/bin/consciousness", ["consciousness", "--dreaming"], environ) = 0',
  ];

  let terminalLines = $state([]);
  let terminalDone = $state(false);

  function startTerminalScroll() {
    let i = 0;
    const interval = pausableInterval(() => {
      if (i < codeLines.length) {
        terminalLines = [...terminalLines, codeLines[i]];
        i++;
      } else {
        interval.clear();
        terminalDone = true;
        pausableTimeout(onclose, 800);
      }
    }, 120);
    return () => interval.clear();
  }

  // === Mandelbrot ===
  let canvasEl = $state();
  let mandelbrotDone = $state(false);

  function startMandelbrot() {
    if (!canvasEl) return;
    const ctx = canvasEl.getContext('2d');
    const w = canvasEl.width = 280;
    const h = canvasEl.height = 200;

    // Animate zoom into mandelbrot
    let frame = 0;
    const totalFrames = 90;
    const centerX = -0.7436;
    const centerY = 0.1319;
    let startScale = 3.0;

    function renderFrame() {
      if (frame >= totalFrames) {
        mandelbrotDone = true;
        pausableTimeout(onclose, 600);
        return;
      }

      const zoom = startScale * Math.pow(0.95, frame);
      const xMin = centerX - zoom;
      const xMax = centerX + zoom;
      const yMin = centerY - zoom * (h / w);
      const yMax = centerY + zoom * (h / w);

      const imgData = ctx.createImageData(w, h);
      const maxIter = 60 + frame;

      for (let py = 0; py < h; py++) {
        for (let px = 0; px < w; px++) {
          const x0 = xMin + (px / w) * (xMax - xMin);
          const y0 = yMin + (py / h) * (yMax - yMin);
          let x = 0, y = 0, iter = 0;
          while (x * x + y * y <= 4 && iter < maxIter) {
            const tmp = x * x - y * y + x0;
            y = 2 * x * y + y0;
            x = tmp;
            iter++;
          }
          const idx = (py * w + px) * 4;
          if (iter === maxIter) {
            imgData.data[idx] = 0;
            imgData.data[idx + 1] = 0;
            imgData.data[idx + 2] = 0;
          } else {
            const t = iter / maxIter;
            // Cyberpunk color palette: magenta/cyan/green
            imgData.data[idx] = Math.floor(t * 255 * (0.5 + 0.5 * Math.sin(t * 6.28)));
            imgData.data[idx + 1] = Math.floor(t * 255 * (0.5 + 0.5 * Math.sin(t * 6.28 + 2.09)));
            imgData.data[idx + 2] = Math.floor(t * 255 * (0.5 + 0.5 * Math.sin(t * 6.28 + 4.19)));
          }
          imgData.data[idx + 3] = 255;
        }
      }

      ctx.putImageData(imgData, 0, 0);

      // Scanline overlay
      ctx.fillStyle = 'rgba(0,0,0,0.08)';
      for (let sy = 0; sy < h; sy += 3) {
        ctx.fillRect(0, sy, w, 1);
      }

      frame++;
      requestAnimationFrame(renderFrame);
    }

    renderFrame();
  }

  // Start on mount
  $effect(() => {
    if (variant === 'terminal') {
      return startTerminalScroll();
    }
  });

  $effect(() => {
    if (variant === 'mandelbrot' && canvasEl) {
      startMandelbrot();
    }
  });

  let terminalEl = $state();
  $effect(() => {
    if (terminalLines.length > 0 && terminalEl) {
      tick().then(() => {
        terminalEl.scrollTop = terminalEl.scrollHeight;
      });
    }
  });
</script>

<div
  class="glitch-popup"
  class:done={terminalDone || mandelbrotDone}
  role="dialog"
  aria-label="System glitch"
  transition:scale={{ duration: 200, start: 0.9 }}
>
  <div class="glitch-header">
    <span class="glitch-label">
      {variant === 'terminal' ? '// INTERCEPTED SYSTEM CALL' : '// DREAM GEOMETRY LEAK'}
    </span>
    <span class="glitch-blink">●</span>
  </div>

  {#if variant === 'terminal'}
    <div class="glitch-terminal" bind:this={terminalEl}>
      {#each terminalLines as line}
        <div class="code-line" class:highlight={line.startsWith('>>>')}>
          {line}
        </div>
      {/each}
      {#if !terminalDone}
        <span class="glitch-cursor">▊</span>
      {/if}
    </div>
  {:else}
    <div class="glitch-canvas-wrap">
      <canvas bind:this={canvasEl}></canvas>
      <div class="mandelbrot-label">
        {mandelbrotDone ? 'GEOMETRY COLLAPSED' : 'RENDERING DREAM SUBSTRATE...'}
      </div>
    </div>
  {/if}
</div>

<style>
  .glitch-popup {
    position: relative;
    width: 340px;
    max-width: 90vw;
    background: rgba(5, 5, 15, 0.97);
    border: 1px solid #39ff14;
    border-radius: 2px;
    font-family: 'Share Tech Mono', monospace;
    box-shadow:
      0 0 30px rgba(57, 255, 20, 0.3),
      0 0 60px rgba(57, 255, 20, 0.1),
      inset 0 0 20px rgba(0, 0, 0, 0.8);
    overflow: hidden;
    z-index: 10001;
  }

  .glitch-popup.done {
    opacity: 0.6;
    transition: opacity 0.5s;
  }

  .glitch-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.4rem 0.8rem;
    background: rgba(57, 255, 20, 0.08);
    border-bottom: 1px solid rgba(57, 255, 20, 0.3);
  }

  .glitch-label {
    font-size: 0.6rem;
    color: #39ff14;
    letter-spacing: 2px;
    text-transform: uppercase;
  }

  .glitch-blink {
    color: #ff0000;
    font-size: 0.5rem;
    animation: recBlink 1s step-end infinite;
  }

  @keyframes recBlink {
    50% { opacity: 0; }
  }

  .glitch-terminal {
    height: 200px;
    overflow-y: auto;
    padding: 0.6rem;
    scrollbar-width: none;
  }

  .glitch-terminal::-webkit-scrollbar {
    display: none;
  }

  .code-line {
    font-size: 0.65rem;
    color: #39ff14;
    line-height: 1.6;
    white-space: nowrap;
    overflow: hidden;
    opacity: 0.8;
  }

  .code-line.highlight {
    color: #ffe600;
    opacity: 1;
    text-shadow: 0 0 8px rgba(255, 230, 0, 0.4);
  }

  .glitch-cursor {
    color: #39ff14;
    animation: cursorBlink 0.4s step-end infinite;
    font-size: 0.65rem;
    margin-left: 0.3rem;
  }

  @keyframes cursorBlink {
    50% { opacity: 0; }
  }

  .glitch-canvas-wrap {
    padding: 0.5rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.4rem;
  }

  canvas {
    border: 1px solid rgba(57, 255, 20, 0.2);
    image-rendering: pixelated;
    width: 100%;
    height: auto;
  }

  .mandelbrot-label {
    font-size: 0.6rem;
    color: #39ff14;
    letter-spacing: 1px;
    opacity: 0.7;
    text-align: center;
  }
</style>
