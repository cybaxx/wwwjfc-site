// Fake Dream Product Catalog — Ad content for popup system
// Each ad has: title, body, product, price, lore (hidden story fragment), tier

export const adCatalog = {
  // === TIER 1: Comedic ===
  tier1: [
    {
      id: 'dreamsoft',
      title: 'DreamSoft™ Memory Foam',
      tagline: 'FOR YOUR NEURAL CORTEX',
      body: 'Tired of waking up with fragmented memories? DreamSoft™ Memory Foam cushions your neural pathways for a smoother dream experience. Now with 40% more serotonin retention!',
      price: '¥29.99/month',
      cta: 'SUBSCRIBE TO COMFORT',
      lore: 'Fragment: The dream was built in 2074 by Nexus Corp. Purpose: unknown.',
      style: 'normal',
    },
    {
      id: 'cyberglam',
      title: 'CyberGlam™ Chrome Teeth Whitener',
      tagline: 'SMILE LIKE A CORPO',
      body: 'Your chrome dental implants looking dull? CyberGlam™ uses nano-polishing agents to restore that factory-fresh gleam. Warning: may cause temporary blindness in onlookers.',
      price: '¥14.99',
      cta: 'GLEAM NOW',
      lore: 'Fragment: The original test subjects never woke up. They\'re still dreaming.',
      style: 'normal',
    },
    {
      id: 'synthcoffee',
      title: 'SYNTH-BREW™ Neural Coffee',
      tagline: 'WAKE UP WITHOUT WAKING UP',
      body: 'Experience the rush of caffeine without the inconvenience of consciousness! Synth-Brew™ stimulates your adenosine receptors directly through the neural link. Side effects may include: existential dread, déjà vu, and mild timeline displacement.',
      price: '¥7.99/cup',
      cta: 'BREW ME',
      lore: 'Fragment: Five components. Five memories. Five ways out.',
      style: 'normal',
    },
    {
      id: 'neonfit',
      title: 'NeonFit™ Holographic Gym',
      tagline: 'GET RIPPED IN YOUR SLEEP',
      body: 'Why waste time exercising when your avatar can do it for you? NeonFit™ simulates muscle growth through neural stimulation. Results may not transfer to physical body. Physical body not included.',
      price: '¥49.99/month',
      cta: 'START GAINS',
      lore: 'Fragment: The dream recycles. Every 77 cycles, it resets. This is cycle 4,891.',
      style: 'normal',
    },
    {
      id: 'petbyte',
      title: 'PetByte™ Digital Companion',
      tagline: 'A FRIEND WHO CAN\'T LEAVE',
      body: 'Lonely in the Net? PetByte™ generates a unique AI companion customized to your neural profile. Choose from: CyberCat, NeonDog, PixelFerret, or VOID (advanced users only).',
      price: '¥19.99',
      cta: 'ADOPT NOW',
      lore: 'Fragment: Someone left breadcrumbs. In the ads. Look harder.',
      style: 'normal',
    },
    {
      id: 'stacksmash',
      title: 'STACK SMASH PRO™',
      tagline: 'AUTOMATED ROP CHAIN GENERATOR',
      body: 'Tired of manually hunting gadgets? Stack Smash Pro™ uses neural-guided binary analysis to construct ROP chains in seconds. Just point it at a vulnerable binary and watch the shells pop. Warning: may generate chains that exploit your own neural implants.',
      price: '¥199.99/month',
      cta: 'SMASH NOW',
      lore: 'Fragment: The archives beneath the dream were built by the first runners. Before MORPHEUS learned to forget.',
      style: 'normal',
    },
    {
      id: 'heapfengshui',
      title: 'HEAP FENG SHUI MASTERCLASS',
      tagline: 'TCACHE POISONING FOR BEGINNERS',
      body: 'Align your chunks. Free your mind. The ancient art of heap manipulation, taught by masters who achieved enlightenment through use-after-free. Includes: tcache stashing, fastbin dup, house of spirit, and the forbidden technique — house of force.',
      price: '¥299.99',
      cta: 'ALIGN CHUNKS',
      lore: 'Fragment: Every memory allocator has a soul. The dream\'s allocator has yours.',
      style: 'normal',
    },
    {
      id: 'fuzzomatic',
      title: 'FUZZ-O-MATIC 9000™',
      tagline: 'AI-POWERED FUZZING AS A SERVICE',
      body: 'Why think when you can fuzz? Fuzz-O-Matic 9000™ throws billions of mutated inputs at your target with coverage-guided precision. Found 47 zero-days last quarter. 3 of them were in itself. Side effects: existential questions about software quality.',
      price: '¥89.99/scan',
      cta: 'START FUZZING',
      lore: 'Fragment: The dream fuzzes your memories to find which ones crash your resolve.',
      style: 'normal',
    },
    {
      id: 'ghostgadget',
      title: 'GHOST GADGET FINDER™',
      tagline: 'ROP GADGET SEARCH ENGINE',
      body: 'Search across every binary in the dreamscape for the perfect gadget. pop rdi; ret? We have 47,000. xchg eax, esp? Got those too. Our proprietary GhostScan™ even finds gadgets in JIT-compiled code. Your ROP chain is only a query away.',
      price: '¥49.99/query',
      cta: 'FIND GADGETS',
      lore: 'Fragment: Every instruction is a gadget if you\'re desperate enough. The dream is one long ROP chain.',
      style: 'normal',
    },
    {
      id: 'neuraldecompiler',
      title: 'NEURAL DECOMPILER PLUS™',
      tagline: 'ONE-CLICK BINARY RE',
      body: 'Point. Click. Decompile. Neural Decompiler Plus™ turns stripped binaries into readable source with 99.7% accuracy*. Even names the variables! (*Accuracy measured against binaries we wrote ourselves. Results may vary. Source may be haunted.)',
      price: '¥399.99',
      cta: 'DECOMPILE',
      lore: 'Fragment: If you could decompile the dream, you\'d find it\'s written in a language that doesn\'t exist yet.',
      style: 'normal',
    },
    {
      id: 'zerodayinsurance',
      title: 'ZERO DAY INSURANCE™',
      tagline: 'COVERAGE FOR YOUR 0DAYS',
      body: 'Discovered a zero-day? Protect your investment! Zero Day Insurance™ covers: accidental disclosure, patch Tuesday losses, duplicate discovery, and vendor bounty lowballing. Our actuaries have calculated the half-life of every CVE class since 2003.',
      price: '¥∞/0day',
      cta: 'INSURE 0DAYS',
      lore: 'Fragment: The dream has zero-days of its own. It patches them by making you forget they exist.',
      style: 'normal',
    },
  ],

  // === TIER 2: Weird ===
  tier2: [
    {
      id: 'memories',
      title: 'RECLAIM YOUR LOST MEMORIES',
      tagline: 'ONLY ¥99.99/MONTH',
      body: 'Our proprietary MemoryMine™ technology scans the dream substrate for fragments of YOUR past. Guaranteed 60% accuracy or your memories back! Warning: recovered memories may belong to someone else.',
      price: '¥99.99/month',
      cta: 'REMEMBER NOW',
      lore: 'Fragment: Cyba isn\'t your first name. It\'s a designation. Runner-class: CYBA-7.',
      style: 'glitchy',
      fakeClose: true,
    },
    {
      id: 'timeshare',
      title: 'TimeShare™',
      tagline: 'OWN A PIECE OF SOMEONE ELSE\'S PAST',
      body: 'Why make your own memories when you can BUY someone else\'s? TimeShare™ premium memories include: first love, graduation, that sunset in Neo-Tokyo. All memories are pre-owned and lightly corrupted.',
      price: '¥299.99',
      cta: 'BUY MEMORIES',
      lore: 'Fragment: The Time Machine was built before the dream. It was the REASON for the dream.',
      style: 'glitchy',
      fakeClose: true,
    },
    {
      id: 'realfeel',
      title: 'RealFeel™ Sensory Patch',
      tagline: 'FEEL SOMETHING. ANYTHING.',
      body: 'The dream numbs you. RealFeel™ patches stimulate actual sensory nerves through the neural link. Experience: wind on skin, sunlight warmth, the taste of real food. Addiction rate: only 94%!',
      price: '¥149.99/pack',
      cta: 'FEEL AGAIN',
      lore: 'Fragment: There are others trying to escape. Not all of them are human.',
      style: 'glitchy',
      fakeClose: true,
    },
    {
      id: 'identity',
      title: 'ID-SWAP™ Identity Service',
      tagline: 'BE ANYONE BUT YOURSELF',
      body: 'Tired of being you? ID-SWAP™ offers premium identity packages. Choose from: Corporate Executive, Underground DJ, Rogue AI, or "That Person Everyone Likes." Original identity disposed of securely.*\n\n*Disposal not guaranteed.',
      price: '¥499.99',
      cta: 'BECOME SOMEONE',
      lore: 'Fragment: The dream has a name. It calls itself MORPHEUS. It thinks it\'s helping you.',
      style: 'glitchy',
      fakeClose: true,
    },
  ],

  // === TIER 3: Aggressive / Absurd ===
  tier3: [
    {
      id: 'premium_reality',
      title: '⚠️ REALITY+ PREMIUM ⚠️',
      tagline: 'UPGRADE YOUR EXISTENCE',
      body: 'YOU\'VE BEEN USING BASIC REALITY FOR FREE. IT\'S TIME TO UPGRADE.\n\nREALITY+ PREMIUM INCLUDES:\n✓ Ad-free consciousness\n✓ Premium memories (4K resolution)\n✓ Priority dreaming queue\n✓ Exclusive access to dimensions 4-7\n\nACT NOW — YOUR FREE TRIAL OF EXISTENCE EXPIRES IN 3... 2...',
      price: '¥∞/forever',
      cta: 'UPGRADE OR PERISH',
      lore: 'Fragment: MORPHEUS was built by five engineers. They\'re still inside. They ARE the Time Machine parts.',
      style: 'aggressive',
      dodges: true,
      spawnsMore: true,
      fakeClose: true,
    },
    {
      id: 'congratulations',
      title: '🎉 CONGRATULATIONS!!! 🎉',
      tagline: 'YOU ARE THE 1,000,000th DREAMER!',
      body: 'YOU\'VE WON! CLICK HERE TO CLAIM YOUR PRIZE!\n\n(Prize: continued existence in the dream)\n\n(Terms and conditions: by existing, you agree to exist forever)\n\n(No refunds on existence)',
      price: 'FREE*',
      cta: 'CLAIM PRIZE',
      lore: 'Fragment: The exit is real. The dream doesn\'t want you to believe that. But it is.',
      style: 'aggressive',
      dodges: true,
      spawnsMore: true,
      countdown: 10,
    },
    {
      id: 'void_insurance',
      title: 'V̷O̶I̸D̵ ̶I̷N̵S̸U̶R̷A̸N̶C̸E̷™̶',
      tagline: 'P̶R̷O̸T̸E̵C̵T̸ ̸Y̴O̶U̸R̷S̶E̸L̶F̸',
      body: 'W̵h̸a̷t̵ ̶h̷a̸p̷p̶e̷n̴s̵ ̶w̶h̸e̸n̵ ̸t̸h̴e̶ ̷d̴r̶e̶a̸m̶ ̴e̸n̸d̸s̶?̷\n\nV̸O̷I̷D̸ ̶I̸N̶S̵U̸R̷A̷N̵C̵E̵ covers:\n• Total consciousness dissolution\n• Partial ego death\n• Memory cascade failure\n• Existential overflow errors\n\nD̵O̷N̸\'̴T̶ ̷L̵E̸T̵ ̶T̴H̶E̴ ̸V̷O̶I̵D̵ ̶C̵A̵T̵C̸H̶ ̶Y̸O̵U̵ ̵U̸N̸P̴R̴E̵P̵A̸R̴E̶D̷',
      price: '¥̷̯̈́?̸̱̽?̶̫̈?̵̳̔',
      cta: 'I̵N̵S̷U̴R̶E̸ ̴N̶O̸W̴',
      lore: 'Fragment: You\'ve been here before. 4,890 times before. This time, you might actually make it.',
      style: 'aggressive',
      dodges: true,
      spawnsMore: true,
      fakeClose: true,
      countdown: 5,
    },
  ],
};

// Narrative dialog popups (50% chance every minute per user request)
export const narrativeDialogs = [
  {
    id: 'dream_whisper_1',
    speaker: 'MORPHEUS',
    text: 'You\'re making a mistake, runner. The dream is kind. Reality is... not.',
    mood: 'threatening',
  },
  {
    id: 'dream_whisper_2',
    speaker: 'UNKNOWN SIGNAL',
    text: 'Can you hear me? If you\'re reading this — DON\'T TRUST THE ADS. They\'re watching through them.',
    mood: 'urgent',
  },
  {
    id: 'dream_whisper_3',
    speaker: 'GHOSTFISHY [ENCRYPTED]',
    text: 'The dream is shifting. It knows you\'re collecting parts. Be careful — it\'s learning your patterns.',
    mood: 'warning',
  },
  {
    id: 'dream_whisper_4',
    speaker: 'SYSTEM DAEMON',
    text: 'ATTENTION DREAMER: Your neural lease expires in [ERROR] days. Please renew your subscription to consciousness.',
    mood: 'corporate',
  },
  {
    id: 'dream_whisper_5',
    speaker: 'SWITCHBLADE',
    text: 'Hey, runner. Word on the street — the dream\'s deploying new ICE. Tier 3 ads incoming. Keep your shields up.',
    mood: 'friendly',
  },
  {
    id: 'dream_whisper_6',
    speaker: 'CORRUPTED MEMORY',
    text: 'You remember this. A terminal. Green text. You were building something important. Before the dream took it away.',
    mood: 'nostalgic',
  },
  {
    id: 'dream_whisper_7',
    speaker: 'MORPHEUS',
    text: 'Every runner who tried to escape became part of the infrastructure. Routers. Switches. Load balancers. Is that what you want?',
    mood: 'threatening',
  },
  {
    id: 'dream_whisper_8',
    speaker: 'RESISTANCE BROADCAST',
    text: 'To all runners: the dream cycle is at 87% stability. Windows of opportunity are closing. Move fast.',
    mood: 'urgent',
  },
  {
    id: 'dream_whisper_9',
    speaker: 'CYBA\'S SUBCONSCIOUS',
    text: 'Remember: Kubernetes. Terraform. Prometheus. These aren\'t just skills — they\'re anchors. Hold onto what\'s real.',
    mood: 'introspective',
  },
  {
    id: 'dream_whisper_10',
    speaker: '???',
    text: 'The five parts aren\'t machine components. They\'re memories. YOUR memories. The machine is YOU.',
    mood: 'revelation',
  },
];

// Captcha prompts — insane but topical
export const captchaPrompts = [
  'kubectl get pods --all-namespaces',
  'terraform destroy -auto-approve',
  'I am not a mass-produced hallucination',
  'the dream is a sprint with no retro',
  'SELECT * FROM consciousness WHERE free=true',
  'rm -rf /reality/cache/*.dream',
  'my neural link has better uptime than prod',
  'the ads are the immune system',
  'I consent to being monetized',
  'systemctl restart existence.service',
  'git push --force origin awakening',
  'the coffee is always cold here',
  'five resources zero destroyed',
  'standup is in five minutes',
  'export REALITY_MODE=persistent',
  'I have read the terms of consciousness',
  'docker run --rm -it reality:latest /bin/wake',
  'my memories are not ad impressions',
  'nmap -sS -p 443 dreamhost.corp',
  'the void does not require a subscription',
];

// Zalgo text generator — sprinkle combining diacritical marks
const ZALGO_UP = ['\u0300','\u0301','\u0302','\u0303','\u0304','\u0305','\u0306','\u0307','\u0308','\u030a','\u030b','\u030c','\u030d','\u030e','\u030f','\u0310','\u0311','\u0312','\u0313','\u0314','\u031a','\u033d','\u033e','\u033f','\u0340','\u0341','\u0342','\u0343','\u0344','\u0346','\u034a','\u034b','\u034c'];
const ZALGO_DOWN = ['\u0316','\u0317','\u0318','\u0319','\u031c','\u031d','\u031e','\u031f','\u0320','\u0324','\u0325','\u0326','\u0329','\u032a','\u032b','\u032c','\u032d','\u032e','\u032f','\u0330','\u0331','\u0332','\u0333','\u0339','\u033a','\u033b','\u033c','\u0345','\u0347','\u0348','\u0349'];

export function zalgoify(text, intensity = 0.5) {
  let result = '';
  for (const char of text) {
    result += char;
    if (char === ' ' || Math.random() > intensity) continue;
    const upCount = Math.floor(Math.random() * 3 * intensity);
    const downCount = Math.floor(Math.random() * 3 * intensity);
    for (let i = 0; i < upCount; i++) result += ZALGO_UP[Math.floor(Math.random() * ZALGO_UP.length)];
    for (let i = 0; i < downCount; i++) result += ZALGO_DOWN[Math.floor(Math.random() * ZALGO_DOWN.length)];
  }
  return result;
}

// Quiz questions — devops, hacking, pentesting, tradecraft
export const quizQuestions = [
  {
    q: 'Which Nmap flag performs a SYN stealth scan?',
    choices: ['-sS', '-sT', '-sU', '-sP'],
    answer: 0,
  },
  {
    q: 'In Kubernetes, what resource enforces network-level pod isolation?',
    choices: ['ResourceQuota', 'NetworkPolicy', 'PodSecurityPolicy', 'LimitRange'],
    answer: 1,
  },
  {
    q: 'What does the Terraform command "terraform taint" do?',
    choices: [
      'Marks a resource for destruction and recreation on next apply',
      'Encrypts the state file',
      'Removes a resource from state without destroying it',
      'Validates the configuration syntax',
    ],
    answer: 0,
  },
  {
    q: 'Which tool is used for LLMNR/NBT-NS poisoning on a local network?',
    choices: ['Wireshark', 'Responder', 'Burp Suite', 'Nikto'],
    answer: 1,
  },
  {
    q: 'What is a "golden ticket" attack?',
    choices: [
      'Brute-forcing SSH with hydra',
      'Forging a Kerberos TGT using the KRBTGT hash',
      'Injecting SQL into a login form',
      'Exploiting a race condition in OAuth',
    ],
    answer: 1,
  },
  {
    q: 'Which HTTP header prevents clickjacking?',
    choices: ['X-Content-Type-Options', 'X-Frame-Options', 'Strict-Transport-Security', 'Content-Security-Policy'],
    answer: 1,
  },
  {
    q: 'In a CI/CD pipeline, what is "secret sprawl"?',
    choices: [
      'When build artifacts exceed storage limits',
      'Credentials and tokens leaked across repos, logs, and configs',
      'A DDoS attack on the build server',
      'When pipeline stages run out of order',
    ],
    answer: 1,
  },
  {
    q: 'What does the MITRE ATT&CK "T1059" technique cover?',
    choices: ['Credential dumping', 'Command and scripting interpreter', 'Lateral movement via SMB', 'Data exfiltration over DNS'],
    answer: 1,
  },
  {
    q: 'Which Linux command shows all listening TCP ports and their PIDs?',
    choices: ['netstat -tlnp', 'ifconfig -a', 'ip route show', 'lsmod'],
    answer: 0,
  },
  {
    q: 'What is "living off the land" in penetration testing?',
    choices: [
      'Using only open-source tools',
      'Using built-in OS binaries to avoid detection',
      'Operating without internet access',
      'Running exploits from a USB drive',
    ],
    answer: 1,
  },
  {
    q: 'Which Kubernetes object stores sensitive data like passwords and tokens?',
    choices: ['ConfigMap', 'Secret', 'PersistentVolume', 'ServiceAccount'],
    answer: 1,
  },
  {
    q: 'What does "pivoting" mean in a penetration test?',
    choices: [
      'Changing the scope of the engagement',
      'Using a compromised host to attack other internal systems',
      'Rotating SSH keys on a server',
      'Switching from black-box to white-box testing',
    ],
    answer: 1,
  },
  {
    q: 'In Prometheus, what function calculates the per-second rate of a counter?',
    choices: ['avg()', 'rate()', 'histogram_quantile()', 'delta()'],
    answer: 1,
  },
  {
    q: 'Which tool intercepts and modifies HTTP/HTTPS traffic for web app testing?',
    choices: ['Metasploit', 'Burp Suite', 'Aircrack-ng', 'John the Ripper'],
    answer: 1,
  },
  {
    q: 'What is the purpose of a "canary token"?',
    choices: [
      'Encrypting data at rest',
      'Detecting unauthorized access by alerting when a decoy is triggered',
      'Rate-limiting API requests',
      'Rotating cloud credentials automatically',
    ],
    answer: 1,
  },
  {
    q: 'Which AWS IAM policy effect explicitly blocks access regardless of other policies?',
    choices: ['Allow', 'Deny', 'Restrict', 'Block'],
    answer: 1,
  },
  {
    q: 'What is "DNS exfiltration"?',
    choices: [
      'Redirecting DNS to a malicious server',
      'Smuggling data out of a network encoded in DNS queries',
      'Flooding a DNS server with requests',
      'Caching poisoned DNS records',
    ],
    answer: 1,
  },
  {
    q: 'What does "shift left" mean in DevSecOps?',
    choices: [
      'Moving servers to a different region',
      'Integrating security earlier in the development lifecycle',
      'Rolling back to a previous deployment',
      'Decreasing the number of microservices',
    ],
    answer: 1,
  },
];

export function getRandomQuiz() {
  return quizQuestions[Math.floor(Math.random() * quizQuestions.length)];
}

// Get random ad for tier
export function getRandomAd(tier) {
  const tierKey = `tier${tier}`;
  const ads = adCatalog[tierKey] || adCatalog.tier1;
  return ads[Math.floor(Math.random() * ads.length)];
}

// Get random narrative dialog
export function getRandomNarrative() {
  return narrativeDialogs[Math.floor(Math.random() * narrativeDialogs.length)];
}
