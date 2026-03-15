<script>
  import { untrack } from 'svelte';
  import { fade } from 'svelte/transition';
  import AdPopup from './AdPopup.svelte';
  import { gameState } from '../lib/gameState.svelte.js';
  import { getRandomAd, getRandomNarrative, captchaPrompts, getRandomQuiz } from '../lib/adContent.js';

  let activeAds = $state([]);
  let narrativePopup = $state(null);
  let adCounter = 0;

  // Captcha state
  let captchaActive = $state(false);
  let captchaPrompt = $state('');
  let captchaInput = $state('');
  let captchaError = $state(false);
  let captchaInputEl = $state();

  // Quiz state
  let quizActive = $state(false);
  let quizQuestion = $state(null);
  let quizSelected = $state(-1);
  let quizResult = $state(null); // 'correct' | 'wrong'

  // Random position 10%-80% to keep popup fully visible
  function randomPos() {
    return 10 + Math.random() * 70;
  }

  // Determine special behavior based on global ad count
  function assignBehavior(ad, tier) {
    const num = gameState.incrementAdCount();
    const totalShown = gameState.totalAdsShown;

    // Every 15th ad is a quiz (check first so it takes priority)
    if (totalShown % 15 === 0 && totalShown > 0) {
      ad._quiz = true;
    }
    // Every 5th ad is a captcha (but not if it's already a quiz)
    else if (totalShown % 5 === 0 && totalShown > 0) {
      ad._captcha = true;
    }

    // Every 10th ad evades clicks
    if (totalShown % 10 === 0 && totalShown > 0) {
      ad._evades = true;
      ad._evadeCount = 0;
      ad._maxEvades = 1 + Math.floor(Math.random() * 2); // 1-2 evades
    }

    // ~30% of ads auto-close with random flash
    if (!ad._captcha && Math.random() < 0.3) {
      ad._autoclose = true;
      ad._autocloseDuration = 2000 + Math.random() * 4000; // 2-6s
    }

    // ~20% require manual close (no auto-close, no timer)
    if (!ad._autoclose && !ad._captcha && Math.random() < 0.2) {
      ad._manualOnly = true;
    }

    // Credit effects: ~25% give credits, ~25% take credits
    const roll = Math.random();
    if (roll < 0.25) {
      ad._creditsGain = Math.floor(5 + Math.random() * 20);
    } else if (roll < 0.5) {
      ad._creditsLoss = Math.floor(3 + Math.random() * 15);
    }

    return ad;
  }

  // React to ad requests from game state
  $effect(() => {
    if (gameState.pendingAd) {
      untrack(() => gameState.clearAdRequest());
      const tier = gameState.adTier;
      const ad = getRandomAd(tier);
      const id = ++adCounter;
      const enriched = assignBehavior(
        { ...ad, _id: id, _tier: tier, _x: randomPos(), _y: randomPos() },
        tier
      );

      // If it's a quiz or captcha ad, trigger overlay instead
      if (enriched._quiz) {
        showQuiz();
      } else if (enriched._captcha) {
        showCaptcha(enriched);
      } else {
        activeAds = [...activeAds, enriched];
      }

      if (tier === 3 && ad.spawnsMore) {
        setTimeout(() => {
          const extra = getRandomAd(tier);
          const extraId = ++adCounter;
          const enrichedExtra = assignBehavior(
            { ...extra, _id: extraId, _tier: tier, _x: randomPos(), _y: randomPos() },
            tier
          );
          if (enrichedExtra._quiz) {
            showQuiz();
          } else if (enrichedExtra._captcha) {
            showCaptcha(enrichedExtra);
          } else {
            activeAds = [...activeAds, enrichedExtra];
          }
        }, 1500);
      }
    }
  });

  function showCaptcha(ad) {
    const prompt = captchaPrompts[Math.floor(Math.random() * captchaPrompts.length)];
    captchaPrompt = prompt;
    captchaActive = true;
    captchaInput = '';
    captchaError = false;
    // Store the ad to show after captcha
    captchaActive = true;
    // Focus input after render
    setTimeout(() => captchaInputEl?.focus(), 100);
  }

  function handleCaptchaSubmit() {
    if (captchaInput.trim().toLowerCase() === captchaPrompt.toLowerCase()) {
      captchaActive = false;
      captchaInput = '';
      // Reward for completing captcha
      gameState.addCredits(10);
    } else {
      captchaError = true;
      captchaInput = '';
      setTimeout(() => { captchaError = false; }, 1000);
    }
  }

  function showQuiz() {
    quizQuestion = getRandomQuiz();
    quizActive = true;
    quizSelected = -1;
    quizResult = null;
  }

  function handleQuizAnswer(index) {
    if (quizResult) return; // already answered
    quizSelected = index;
    if (index === quizQuestion.answer) {
      quizResult = 'correct';
      gameState.addCredits(25);
    } else {
      quizResult = 'wrong';
      gameState.addCredits(-15);
    }
    setTimeout(() => {
      quizActive = false;
      quizQuestion = null;
      quizResult = null;
      quizSelected = -1;
    }, 2000);
  }

  function closeAd(ad) {
    // Apply credit effects on close
    if (ad._creditsGain) {
      gameState.addCredits(ad._creditsGain);
    }
    if (ad._creditsLoss) {
      gameState.addCredits(-ad._creditsLoss);
    }
    activeAds = activeAds.filter(a => a._id !== ad._id);
  }

  // 50% chance narrative popup every 60s, 25% chance next one comes faster
  $effect(() => {
    if (!gameState.gameStarted) return;
    let timeout;
    function scheduleNext(delay) {
      timeout = setTimeout(() => {
        if (Math.random() < 0.5) {
          narrativePopup = getRandomNarrative();
          setTimeout(() => { narrativePopup = null; }, 12000);
          const nextDelay = Math.random() < 0.25 ? 30000 : 60000;
          scheduleNext(nextDelay);
        } else {
          scheduleNext(60000);
        }
      }, delay);
    }
    scheduleNext(60000);
    return () => clearTimeout(timeout);
  });

  function dismissNarrative() {
    narrativePopup = null;
  }
</script>

<!-- Captcha Overlay -->
{#if captchaActive}
  <div class="captcha-overlay" transition:fade={{ duration: 200 }}>
    <div class="captcha-box">
      <div class="captcha-header">
        <span class="captcha-icon">⚠️</span>
        DREAM VERIFICATION REQUIRED
      </div>
      <div class="captcha-body">
        <p class="captcha-instruction">To prove you are a sentient dreamer, please type the following exactly:</p>
        <div class="captcha-phrase">{captchaPrompt}</div>
        <input
          bind:this={captchaInputEl}
          bind:value={captchaInput}
          onkeydown={(e) => e.key === 'Enter' && handleCaptchaSubmit()}
          class="captcha-input"
          class:error={captchaError}
          placeholder="type it exactly..."
          spellcheck="false"
          autocomplete="off"
        />
        <button class="captcha-submit" onclick={handleCaptchaSubmit}>VERIFY CONSCIOUSNESS</button>
        {#if captchaError}
          <div class="captcha-error" transition:fade={{ duration: 200 }}>VERIFICATION FAILED — TRY AGAIN</div>
        {/if}
      </div>
      <div class="captcha-fine-print">
        This verification is mandatory under Dream Compliance Act §7.3.1.
        Your typing patterns are being monitored for advertising purposes.
      </div>
    </div>
  </div>
{/if}

<!-- Quiz Overlay -->
{#if quizActive && quizQuestion}
  <div class="captcha-overlay" transition:fade={{ duration: 200 }}>
    <div class="quiz-box">
      <div class="quiz-header">
        <span class="captcha-icon">🔐</span>
        DREAM SECURITY AUDIT — KNOWLEDGE CHECK
      </div>
      <div class="quiz-body">
        <p class="quiz-question">{quizQuestion.q}</p>
        <div class="quiz-choices">
          {#each quizQuestion.choices as choice, i}
            <button
              class="quiz-choice"
              class:selected={quizSelected === i}
              class:correct={quizResult && i === quizQuestion.answer}
              class:wrong={quizResult === 'wrong' && quizSelected === i}
              onclick={() => handleQuizAnswer(i)}
              disabled={quizResult !== null}
            >
              <span class="quiz-letter">{String.fromCharCode(65 + i)}</span>
              {choice}
            </button>
          {/each}
        </div>
        {#if quizResult === 'correct'}
          <div class="quiz-result correct" transition:fade={{ duration: 200 }}>CORRECT — +25 ¥CR AWARDED</div>
        {/if}
        {#if quizResult === 'wrong'}
          <div class="quiz-result wrong" transition:fade={{ duration: 200 }}>INCORRECT — 15 ¥CR DEDUCTED — Answer: {String.fromCharCode(65 + quizQuestion.answer)}</div>
        {/if}
      </div>
      <div class="captcha-fine-print">
        This security audit is required under Cyber Dream Compliance Directive 13.7.
        Correct answers improve your neural clearance rating.
      </div>
    </div>
  </div>
{/if}

<!-- Ad Overlays -->
{#if activeAds.length > 0}
  <div class="ad-overlay" transition:fade={{ duration: 200 }}>
    {#each activeAds as ad (ad._id)}
      <div class="ad-position" style="left: {ad._x}%; top: {ad._y}%">
        <AdPopup
          {ad}
          tier={ad._tier}
          onclose={() => closeAd(ad)}
        />
      </div>
    {/each}
  </div>
{/if}

<!-- Narrative Dialog Popup -->
{#if narrativePopup}
  <div class="narrative-overlay" transition:fade={{ duration: 300 }}>
    <div class="narrative-popup" class:threatening={narrativePopup.mood === 'threatening'} class:urgent={narrativePopup.mood === 'urgent'} class:corporate={narrativePopup.mood === 'corporate'}>
      <div class="narrative-header">
        <span class="narrative-speaker">[{narrativePopup.speaker}]</span>
        <button class="narrative-close" onclick={dismissNarrative}>✕</button>
      </div>
      <div class="narrative-body">
        <p class="narrative-text">{narrativePopup.text}</p>
      </div>
      <div class="narrative-footer">
        <button class="narrative-dismiss" onclick={dismissNarrative}>ACKNOWLEDGE</button>
      </div>
    </div>
  </div>
{/if}

<style>
  /* === Captcha === */
  .captcha-overlay {
    position: fixed;
    top: 0; left: 0; right: 0; bottom: 0;
    z-index: 10003;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(0, 0, 0, 0.85);
    backdrop-filter: blur(5px);
  }

  .captcha-box {
    width: 480px;
    max-width: 92vw;
    background: rgba(10, 10, 20, 0.98);
    border: 2px solid #ffe600;
    font-family: 'Share Tech Mono', monospace;
    box-shadow:
      0 0 40px rgba(255, 230, 0, 0.3),
      0 0 80px rgba(255, 230, 0, 0.1);
  }

  .captcha-header {
    padding: 0.8rem 1.2rem;
    background: rgba(255, 230, 0, 0.1);
    border-bottom: 1px solid rgba(255, 230, 0, 0.3);
    color: #ffe600;
    font-size: 0.75rem;
    letter-spacing: 2px;
    text-transform: uppercase;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .captcha-icon {
    font-size: 1rem;
  }

  .captcha-body {
    padding: 1.5rem;
  }

  .captcha-instruction {
    color: #aaa;
    font-size: 0.8rem;
    margin: 0 0 1rem;
    line-height: 1.4;
  }

  .captcha-phrase {
    background: rgba(255, 230, 0, 0.05);
    border: 1px solid rgba(255, 230, 0, 0.2);
    padding: 1rem;
    color: #ffe600;
    font-size: 0.95rem;
    text-align: center;
    margin-bottom: 1rem;
    letter-spacing: 1px;
    line-height: 1.6;
    word-break: break-word;
  }

  .captcha-input {
    width: 100%;
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 230, 0, 0.3);
    color: #ffe600;
    font-family: 'Share Tech Mono', monospace;
    font-size: 0.85rem;
    padding: 0.7rem;
    outline: none;
    box-sizing: border-box;
    margin-bottom: 0.8rem;
  }

  .captcha-input:focus {
    border-color: #ffe600;
    box-shadow: 0 0 10px rgba(255, 230, 0, 0.2);
  }

  .captcha-input.error {
    border-color: #ff0000;
    animation: captchaShake 0.3s ease-in-out;
  }

  @keyframes captchaShake {
    0%, 100% { transform: translateX(0); }
    25% { transform: translateX(-8px); }
    75% { transform: translateX(8px); }
  }

  .captcha-submit {
    width: 100%;
    padding: 0.7rem;
    background: linear-gradient(135deg, #ffe600, #ff8800);
    border: none;
    color: #000;
    font-family: 'Orbitron', sans-serif;
    font-size: 0.7rem;
    letter-spacing: 2px;
    text-transform: uppercase;
    cursor: pointer;
    font-weight: bold;
    transition: all 0.3s;
  }

  .captcha-submit:hover {
    box-shadow: 0 0 20px rgba(255, 230, 0, 0.4);
  }

  .captcha-error {
    color: #ff0000;
    font-size: 0.75rem;
    text-align: center;
    margin-top: 0.8rem;
    letter-spacing: 1px;
  }

  .captcha-fine-print {
    padding: 0.6rem 1.2rem;
    color: #444;
    font-size: 0.55rem;
    border-top: 1px solid rgba(255, 230, 0, 0.1);
    line-height: 1.4;
  }

  /* === Quiz === */
  .quiz-box {
    width: 520px;
    max-width: 92vw;
    background: rgba(10, 10, 20, 0.98);
    border: 2px solid #00f0ff;
    font-family: 'Share Tech Mono', monospace;
    box-shadow:
      0 0 40px rgba(0, 240, 255, 0.3),
      0 0 80px rgba(0, 240, 255, 0.1);
  }

  .quiz-header {
    padding: 0.8rem 1.2rem;
    background: rgba(0, 240, 255, 0.1);
    border-bottom: 1px solid rgba(0, 240, 255, 0.3);
    color: #00f0ff;
    font-size: 0.7rem;
    letter-spacing: 2px;
    text-transform: uppercase;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .quiz-body {
    padding: 1.5rem;
  }

  .quiz-question {
    color: #e0e0e0;
    font-size: 0.9rem;
    line-height: 1.5;
    margin: 0 0 1.2rem;
  }

  .quiz-choices {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .quiz-choice {
    display: flex;
    align-items: center;
    gap: 0.8rem;
    width: 100%;
    padding: 0.7rem 1rem;
    background: rgba(255, 255, 255, 0.03);
    border: 1px solid rgba(0, 240, 255, 0.2);
    color: #ccc;
    font-family: 'Share Tech Mono', monospace;
    font-size: 0.8rem;
    text-align: left;
    cursor: pointer;
    transition: all 0.2s;
  }

  .quiz-choice:hover:not(:disabled) {
    background: rgba(0, 240, 255, 0.08);
    border-color: #00f0ff;
    color: #fff;
  }

  .quiz-choice.selected {
    border-color: #00f0ff;
    background: rgba(0, 240, 255, 0.1);
  }

  .quiz-choice.correct {
    border-color: #39ff14;
    background: rgba(57, 255, 20, 0.1);
    color: #39ff14;
  }

  .quiz-choice.wrong {
    border-color: #ff0000;
    background: rgba(255, 0, 0, 0.1);
    color: #ff4444;
  }

  .quiz-choice:disabled {
    cursor: default;
    opacity: 0.7;
  }

  .quiz-letter {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 22px;
    height: 22px;
    border: 1px solid rgba(0, 240, 255, 0.3);
    font-size: 0.7rem;
    color: #00f0ff;
    flex-shrink: 0;
  }

  .quiz-result {
    text-align: center;
    font-size: 0.8rem;
    margin-top: 1rem;
    padding: 0.6rem;
    letter-spacing: 1px;
  }

  .quiz-result.correct {
    color: #39ff14;
    background: rgba(57, 255, 20, 0.05);
    border: 1px solid rgba(57, 255, 20, 0.2);
  }

  .quiz-result.wrong {
    color: #ff4444;
    background: rgba(255, 0, 0, 0.05);
    border: 1px solid rgba(255, 0, 0, 0.2);
  }

  /* === Ads === */
  .ad-overlay {
    position: fixed;
    top: 0; left: 0; right: 0; bottom: 0;
    z-index: 10000;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(0, 0, 0, 0.6);
    backdrop-filter: blur(3px);
  }

  .ad-position {
    position: absolute;
    transform: translate(-50%, -50%);
  }

  /* === Narratives === */
  .narrative-overlay {
    position: fixed;
    top: 0; left: 0; right: 0; bottom: 0;
    z-index: 10002;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(0, 0, 0, 0.7);
    backdrop-filter: blur(4px);
  }

  .narrative-popup {
    width: 450px;
    max-width: 90vw;
    background: rgba(10, 10, 20, 0.95);
    border: 1px solid #00f0ff;
    font-family: 'Share Tech Mono', monospace;
    box-shadow:
      0 0 40px rgba(0, 240, 255, 0.2),
      0 0 80px rgba(0, 240, 255, 0.1);
    animation: narrativeGlow 2s ease-in-out infinite;
  }

  .narrative-popup.threatening {
    border-color: #ff0000;
    box-shadow: 0 0 40px rgba(255, 0, 0, 0.3);
  }

  .narrative-popup.urgent {
    border-color: #ffe600;
    box-shadow: 0 0 40px rgba(255, 230, 0, 0.3);
    animation: urgentPulse 0.5s ease-in-out infinite;
  }

  .narrative-popup.corporate {
    border-color: #888;
    box-shadow: 0 0 20px rgba(136, 136, 136, 0.2);
  }

  @keyframes narrativeGlow {
    0%, 100% { box-shadow: 0 0 30px rgba(0, 240, 255, 0.2); }
    50% { box-shadow: 0 0 50px rgba(0, 240, 255, 0.4); }
  }

  @keyframes urgentPulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.8; }
  }

  .narrative-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.6rem 1rem;
    background: rgba(0, 240, 255, 0.08);
    border-bottom: 1px solid rgba(0, 240, 255, 0.2);
  }

  .narrative-speaker {
    color: #00f0ff;
    font-size: 0.8rem;
    letter-spacing: 1px;
    text-shadow: 0 0 8px rgba(0, 240, 255, 0.5);
  }

  .narrative-close {
    background: none;
    border: none;
    color: #00f0ff;
    font-size: 1rem;
    cursor: pointer;
    padding: 0 0.3rem;
    transition: color 0.2s;
  }

  .narrative-close:hover { color: #ff00aa; }

  .narrative-body {
    padding: 1.5rem;
  }

  .narrative-text {
    color: #e0e0e0;
    font-size: 0.9rem;
    line-height: 1.7;
    margin: 0;
  }

  .narrative-footer {
    padding: 0.8rem 1.5rem;
    border-top: 1px solid rgba(0, 240, 255, 0.1);
    display: flex;
    justify-content: flex-end;
  }

  .narrative-dismiss {
    background: transparent;
    border: 1px solid #00f0ff;
    color: #00f0ff;
    font-family: 'Orbitron', sans-serif;
    font-size: 0.65rem;
    letter-spacing: 2px;
    padding: 0.4rem 1rem;
    cursor: pointer;
    transition: all 0.3s;
  }

  .narrative-dismiss:hover {
    background: rgba(0, 240, 255, 0.15);
    box-shadow: 0 0 15px rgba(0, 240, 255, 0.3);
  }
</style>
