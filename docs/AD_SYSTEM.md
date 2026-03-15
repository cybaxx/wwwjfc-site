# Ad System Documentation

The dream's immune system. Ads are both gameplay obstacles and narrative devices — they escalate as the player progresses, contain hidden lore fragments, and interact with the credits economy.

## Tier Escalation

Ad tier is determined by how many nodes the player has visited:

| Nodes Visited | Tier | Behavior |
|---|---|---|
| 1-7 | Tier 1 (Comedic) | Close button appears after 3s delay. Gentle. |
| 8-15 | Tier 2 (Weird) | Fake close button → lore reveal. Real close is 8x8px, 30% opacity. |
| 16+ | Tier 3 (Aggressive) | Dodge cursor, spawn extra ads, countdowns, glitch animations. |

## Ad Catalog (`adContent.js`)

### Tier 1 (5 ads)
DreamSoft Memory Foam, CyberGlam Chrome Teeth Whitener, Synth-Brew Neural Coffee, NeonFit Holographic Gym, PetByte Digital Companion

### Tier 2 (4 ads)
MemoryMine Recovered Memories, TimeShare Premium Memories, RealFeel Sensory Patch, ID-SWAP Identity Service

### Tier 3 (3 ads)
Reality+ Premium, Congratulations 1,000,000th Dreamer, Void Insurance (zalgo text)

Every ad includes a hidden **lore fragment** — story clues visible after fake-close click or on tier 1 ads.

## Special Ad Behaviors

Triggered by the global `totalAdsShown` counter:

### Every 5th Ad — Captcha
Full-screen overlay requiring exact text input. 20 topical prompts including:
- `kubectl get pods --all-namespaces`
- `terraform destroy -auto-approve`
- `the coffee is always cold here`
- `I consent to being monetized`
- `standup is in five minutes`

**Reward**: +10 credits on completion.

### Every 10th Ad — Evader
Ad jumps to a random position 1-2 times when you try to close it. Displays taunts:
- "Ha! You think it's that easy?"
- "Fine. You can close me now." (after max evades)

### Every 15th Ad — Quiz
Multiple choice question on devops, hacking, pentesting, and tradecraft. 18 questions covering:
- Nmap flags, Kubernetes NetworkPolicy, Terraform taint
- LLMNR poisoning, golden ticket attacks, DNS exfiltration
- MITRE ATT&CK techniques, living off the land
- Prometheus PromQL, Burp Suite, canary tokens
- CI/CD secret sprawl, shift-left DevSecOps

**Reward**: +25 credits correct, -15 credits wrong. Shows correct answer on miss.

### Random Behaviors (~per ad)
- **~30% Auto-close**: Flashes rapidly for 800ms then vanishes (2-6s lifespan)
- **~20% Manual-only**: No auto-dismiss, must find and click close button
- **~25% Credit gain**: +5-25 CR on close
- **~25% Credit loss**: -3-15 CR on close

## Zalgo Text

~20% of story choice options in the terminal get zalgo corruption (combining diacritical marks). Intensity scales with ad tier:
- Tier 1: 0.3 intensity (subtle)
- Tier 2: 0.55 intensity (noticeable)
- Tier 3: 0.8 intensity (heavy corruption)

## Narrative Popups

Separate from ads. 50% chance every 60 seconds (25% chance the next comes in 30s). 10 narrative dialogs from characters like MORPHEUS, Switchblade, Ghostfishy, the Resistance, and Cyba's subconscious. Auto-dismiss after 12 seconds.

## Credits Economy

| Action | Credits |
|---|---|
| Starting balance | +100 |
| Captcha completed | +10 |
| Quiz correct | +25 |
| Quiz wrong | -15 |
| Ad with gain | +5 to +25 |
| Ad with loss | -3 to -15 |

Credits visible via `status` command in the terminal.

## Positioning

All ad popups spawn at random positions (10%-80% of viewport on each axis). Multiple ads scatter across the screen rather than stacking.
