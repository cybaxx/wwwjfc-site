// Game State Engine - Svelte 5 runes-based reactive state

// Pausable timer system — suspends when tab is hidden
const activePausables = new Set();
let _tabVisible = true;

if (typeof document !== 'undefined') {
  document.addEventListener('visibilitychange', () => {
    _tabVisible = !document.hidden;
    if (_tabVisible) {
      activePausables.forEach(p => p._resume());
    } else {
      activePausables.forEach(p => p._pause());
    }
  });
}

export function pausableTimeout(callback, delay) {
  let remaining = delay;
  let startTime = Date.now();
  let timerId = null;
  let done = false;

  const p = {
    _pause() {
      if (done) return;
      if (timerId) { clearTimeout(timerId); timerId = null; }
      remaining -= (Date.now() - startTime);
      if (remaining < 0) remaining = 0;
    },
    _resume() {
      if (done) return;
      startTime = Date.now();
      timerId = setTimeout(() => {
        done = true;
        activePausables.delete(p);
        callback();
      }, remaining);
    },
    clear() {
      done = true;
      if (timerId) clearTimeout(timerId);
      activePausables.delete(p);
    },
  };

  activePausables.add(p);
  if (_tabVisible) p._resume();
  return p;
}

export function pausableInterval(callback, delay) {
  let timer = null;

  function tick() {
    timer = pausableTimeout(() => {
      callback();
      tick();
    }, delay);
  }

  tick();
  return {
    clear() {
      if (timer) timer.clear();
    },
  };
}

function createGameState() {
  let currentNode = $state('intro');
  let inventory = $state([]);
  let choicesMade = $state({});
  let storyFlags = $state({});
  let adTier = $state(1);
  let visitedNodes = $state(new Set());
  let gameStarted = $state(false);
  let storyVisible = $state(false);
  let narrativeLog = $state([]);
  let pendingAd = $state(false);
  let pendingNarrative = $state(null);
  let credits = $state(100);
  let totalAdsShown = $state(0);
  let fixedParts = $state(new Set());
  let activeChallenge = $state(null);
  let challengeState = $state({});
  let scrollsFound = $state(new Set());
  let bonusChallengesComplete = $state(new Set());

  const TIME_MACHINE_PARTS = [
    { id: 'chrono_coil', name: 'Chrono Coil', location: 'skills', description: 'A shimmering copper coil that bends temporal frequencies' },
    { id: 'quantum_flux', name: 'Quantum Flux Capacitor', location: 'wetfish', description: 'Salvaged from a crashed Arasaka transport — still humming' },
    { id: 'neural_sync', name: 'Neural Sync Module', location: 'clearcaptions', description: 'Corporate-grade neural bridge, wiped clean of tracking firmware' },
    { id: 'temporal_drift', name: 'Temporal Drift Compensator', location: 'stg', description: 'Keeps you anchored while the timeline shifts around you' },
    { id: 'dream_anchor', name: 'Dream Anchor', location: 'education', description: 'The final piece — without it, you drift forever between dreams' },
  ];

  const partsCollected = $derived(
    TIME_MACHINE_PARTS.filter(p => inventory.includes(p.id))
  );

  const completionPercent = $derived(
    Math.floor((partsCollected.length / TIME_MACHINE_PARTS.length) * 100)
  );

  const allPartsFixed = $derived(fixedParts.size === TIME_MACHINE_PARTS.length);
  const canEscape = $derived(allPartsFixed);

  function showStory() {
    storyVisible = true;
  }

  function hideStory() {
    storyVisible = false;
  }

  function navigate(nodeId, { silent = false } = {}) {
    currentNode = nodeId;
    if (!silent) storyVisible = true;
    visitedNodes = new Set([...visitedNodes, nodeId]);
    // Escalate ad tier based on nodes visited
    const count = visitedNodes.size;
    if (count > 15) adTier = 3;
    else if (count > 7) adTier = 2;
    else adTier = 1;
  }

  function addItem(itemId) {
    if (!inventory.includes(itemId)) {
      inventory = [...inventory, itemId];
    }
  }

  function hasItem(itemId) {
    return inventory.includes(itemId);
  }

  function setFlag(flag, value = true) {
    storyFlags = { ...storyFlags, [flag]: value };
  }

  function getFlag(flag) {
    return storyFlags[flag] || false;
  }

  function recordChoice(nodeId, choiceId) {
    choicesMade = { ...choicesMade, [nodeId]: choiceId };
  }

  function requestAd() {
    pendingAd = true;
  }

  function clearAdRequest() {
    pendingAd = false;
  }

  function addCredits(amount) {
    credits = Math.max(0, credits + amount);
  }

  function incrementAdCount() {
    totalAdsShown++;
    return totalAdsShown;
  }

  function fixPart(id) {
    fixedParts = new Set([...fixedParts, id]);
  }

  function isPartFixed(id) {
    return fixedParts.has(id);
  }

  function findScroll(id) {
    scrollsFound = new Set([...scrollsFound, id]);
  }

  function hasScroll(id) {
    return scrollsFound.has(id);
  }

  function completeBonusChallenge(id) {
    bonusChallengesComplete = new Set([...bonusChallengesComplete, id]);
  }

  function startChallenge(id) {
    activeChallenge = id;
    challengeState = {};
  }

  function completeChallenge() {
    if (activeChallenge) {
      fixPart(activeChallenge);
      activeChallenge = null;
      challengeState = {};
    }
  }

  function abandonChallenge() {
    activeChallenge = null;
    challengeState = {};
  }

  function setNarrative(n) {
    pendingNarrative = n;
  }

  function clearNarrative() {
    pendingNarrative = null;
  }

  function addNarrativeLine(text, type = 'story') {
    narrativeLog = [...narrativeLog, { text, type, timestamp: Date.now() }];
  }

  function startGame() {
    gameStarted = true;
    storyVisible = false;
    currentNode = 'wake_up';
    narrativeLog = [];
    inventory = [];
    choicesMade = {};
    storyFlags = {};
    adTier = 1;
    credits = 100;
    totalAdsShown = 0;
    fixedParts = new Set();
    activeChallenge = null;
    challengeState = {};
    scrollsFound = new Set();
    bonusChallengesComplete = new Set();
    visitedNodes = new Set(['wake_up']);
  }

  return {
    get currentNode() { return currentNode; },
    get inventory() { return inventory; },
    get choicesMade() { return choicesMade; },
    get storyFlags() { return storyFlags; },
    get adTier() { return adTier; },
    get visitedNodes() { return visitedNodes; },
    get gameStarted() { return gameStarted; },
    get storyVisible() { return storyVisible; },
    get narrativeLog() { return narrativeLog; },
    get pendingAd() { return pendingAd; },
    get pendingNarrative() { return pendingNarrative; },
    get credits() { return credits; },
    get totalAdsShown() { return totalAdsShown; },
    get fixedParts() { return fixedParts; },
    get activeChallenge() { return activeChallenge; },
    get challengeState() { return challengeState; },
    set challengeState(v) { challengeState = v; },
    get scrollsFound() { return scrollsFound; },
    get bonusChallengesComplete() { return bonusChallengesComplete; },
    get allPartsFixed() { return allPartsFixed; },
    get partsCollected() { return partsCollected; },
    get completionPercent() { return completionPercent; },
    get canEscape() { return canEscape; },
    TIME_MACHINE_PARTS,
    navigate,
    addItem,
    hasItem,
    setFlag,
    getFlag,
    recordChoice,
    addNarrativeLine,
    showStory,
    hideStory,
    requestAd,
    clearAdRequest,
    setNarrative,
    clearNarrative,
    addCredits,
    incrementAdCount,
    fixPart,
    isPartFixed,
    findScroll,
    hasScroll,
    completeBonusChallenge,
    startChallenge,
    completeChallenge,
    abandonChallenge,
    startGame,
  };
}

export const gameState = createGameState();
