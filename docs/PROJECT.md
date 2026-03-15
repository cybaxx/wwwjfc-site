# wwwjfc-site — Project Documentation

## Overview

A cyberpunk-themed interactive resume disguised as a text adventure. Built with Svelte 5, Vite, and Three.js. The site presents Cyba's professional history as a dystopian narrative — the "Cyber Dream" — where the user collects five time machine components scattered across districts that map to real resume sections (skills, work experience, education, community projects).

The twist ending reveals it was all a dream: Cyba fell asleep at their desk. The five components are Terraform resources. The coworker's badge says "S. Blade." The IRC channel is real.

## Tech Stack

- **Svelte 5** (runes-based reactivity — `$state`, `$derived`, `$effect`)
- **Vite 6** (build tooling)
- **Three.js** (background 3D scene)
- **No other dependencies** — no router, no CSS framework, no state library

## Architecture

```
wwwjfc/src/
├── App.svelte                    # Root — boot sequence, resume layout, keyboard handlers
├── main.js                       # Entry point
├── ThreeScene.svelte             # Three.js background
├── lib/
│   ├── gameState.svelte.js       # Reactive game engine (inventory, navigation, credits, ads)
│   ├── storyNodes.js             # Story node graph (~65 nodes, all game content)
│   └── adContent.js              # Ad catalog, captchas, quizzes, zalgo, narratives
└── components/
    ├── DraggableWindow.svelte    # Reusable draggable/focusable window container
    ├── StoryOverlay.svelte       # Interactive story dialog (choices, typewriter effect)
    ├── StoryTerminal.svelte      # CLI terminal for commands, challenges, assembly
    ├── AdManager.svelte          # Ad lifecycle — spawns, captchas, quizzes, credit effects
    ├── AdPopup.svelte            # Individual ad — evade, autoclose, flash, dodge
    ├── InventoryHUD.svelte       # Persistent HUD showing collected parts
    ├── AudioVisualizer.svelte    # Audio reactive visualizer
    ├── header.svelte             # Resume header/hero section
    ├── about.svelte              # About section
    ├── experience.svelte         # Work experience cards
    ├── education.svelte          # Certifications/education
    ├── skills.svelte             # Technical skills
    └── contact.svelte            # Contact info
```

## Game Engine

### State (`gameState.svelte.js`)

Singleton reactive store using Svelte 5 runes:

- `currentNode` — active story node ID
- `inventory` — collected item IDs (5 time machine parts)
- `credits` — currency (starts at 100, modified by ads/quizzes)
- `adTier` — escalates 1→2→3 based on nodes visited
- `totalAdsShown` — global counter driving special ad behaviors
- `storyFlags` — arbitrary key/value flags set by choices (e.g., `rachel_approved`)
- `visitedNodes` — Set tracking exploration progress
- `fixedParts` — Set of part IDs repaired at fsociety arcade
- `activeChallenge` — current CTF challenge ID (null when not in a challenge)
- `challengeState` — per-challenge progress tracking

### Story Nodes (`storyNodes.js`)

A flat object of ~65 nodes. Each node:

```js
{
  id: 'node_id',
  text: `Story text with typewriter rendering...`,
  location: 'resume-section',      // optional — maps to resume highlight
  grantsItem: 'chrono_coil',       // optional — gives item on visit
  choices: [
    { id: 'choice_id', text: '> displayed text', next: 'target_node' },
    { id: 'flag_choice', text: '> ...', next: 'node', setFlag: 'flag_name' },
    { id: 'gate', text: '> ...', next: 'node', requiresAll: true },
  ],
}
```

### Districts / Story Map

| District | Resume Section | Part | Nodes | Key NPCs |
|---|---|---|---|---|
| Black Market | Core Skills | Chrono Coil | 7 | Switchblade, Pixel |
| Wetfish Sector | Professional Experience | Quantum Flux Capacitor | 8 | Ghostfishy |
| JFC Rave Venue | Community Projects | (info hub) | 9 | Rachel |
| ClearCaptions Tower | Professional Experience | Neural Sync Module | 8 | Floor 13 NPC |
| STG Labs | Professional Experience | Temporal Drift Compensator | 7 | Ghost Consultant |
| Neural Academy | Education/Certs | Dream Anchor | 6 | Mentor |
| Community Safe House | Community Projects | (intel hub) | 4 | Resistance Operative |
| fsociety Arcade | — | (repair hub) | 9 | Elliot (Holo Ghost) |
| Intro + Endgame | — | — | 8 | — |

### Foreshadowing Thread

Subtle details that pay off in the twist ending:

1. **Wake up**: notification chime, cold coffee smell
2. **Switchblade**: 3AM data center memory feels "too recent"
3. **Wetfish**: flash of #wetfish-dev IRC channel
4. **ClearCaptions**: Neural Sync feels like "a badge on a lanyard"
5. **STG Labs**: YOUR name on the architect sign-off
6. **Academy mentor**: "You're not a prisoner. You're an employee."
7. **Assembly**: memories of crunch, pizza boxes, falling asleep at—
8. **Wake**: everything clicks. S. Blade. #wetfish-dev. Five terraform resources.

### Wetfish → JFC Gate

The Wetfish storyline requires talking to Rachel at JFC first. Ghostfishy sends you there. Rachel runs the trust/access policies. After Rachel approves you (`rachel_approved` flag), Ghostfishy proceeds with the values test and saboteur investigation.

## Ad System

### Tiers
- **Tier 1** (nodes 1-7): Comedic ads, close button delayed 3s
- **Tier 2** (nodes 8-15): Weird ads, fake close button, tiny real close
- **Tier 3** (nodes 16+): Aggressive ads, dodging, spawning, countdowns

### Special Behaviors (based on global ad count)
- **Every 5th ad**: Captcha — type an insane but topical phrase exactly
- **Every 10th ad**: Evader — ad dodges 1-2 clicks before letting you close
- **Every 15th ad**: Quiz — multiple choice on devops/hacking/pentesting
- **~30% of ads**: Auto-close with flash effect (2-6s)
- **~20% of ads**: Manual close only
- **~25% of ads**: Grant credits (+5-25 CR)
- **~25% of ads**: Steal credits (-3-15 CR)

### Zalgo Effect
~20% of story choice text gets zalgo corruption, intensity scales with ad tier.

### Credits
Start at 100. Modified by ad interactions, captchas (+10), quizzes (+25 correct / -15 wrong). Visible via `status` terminal command.

## UI System

### Dual-Window Interface

Both the story dialog and terminal render as **draggable windows** (via `DraggableWindow.svelte`):

- **StoryOverlay** (cyan border) — narrative text with typewriter effect + clickable choice buttons. For story interaction.
- **StoryTerminal** (green border) — CLI for commands, challenges, navigation, assembly. For technical interaction.

Both can be open simultaneously. Click to bring a window to front. Drag title bar to reposition anywhere.

### Window Features
- Drag-to-move via title bar
- Click-to-focus (z-order management)
- Close via X button or ESC
- Configurable: border color, title, icon, size, initial position

### Input Matching
Terminal accepts story choices via:
- `> full choice text` (original method)
- Any 4+ character substring match (e.g., typing `pixe` matches "Where do I find Pixel?")

## Key NPCs

| NPC | Location | Role |
|---|---|---|
| **Switchblade** (S. Blade) | Black Market | Arms dealer, Chrono Coil holder. Chrome arm. Stays in dream because "nobody needs a chrome arm out there." |
| **Pixel** | Black Market (Glitch Quarter) | Trickster data fence. Trades in riddles. Made of dead pixels. |
| **Ghostfishy** | Wetfish Sector | Infrastructure maintainer. One of the five original MORPHEUS engineers. First words: "IT SMELLS LIKE PUMPKIN PIE IN HERE." |
| **Rachel** | JFC Rave Venue | Real leader of Wetfish. Writes access policies. Inspired by Telecomix. Gates the Wetfish storyline. |
| **Floor 13 NPC (Maria)** | ClearCaptions Tower | Trapped NPC who might be real. Moral choice: help or keep moving. |
| **Ghost Consultant** | STG Labs | Stuck in a standup loop for 1,847 cycles. Free or harvest credentials. |
| **Mentor** | Neural Academy | Holographic teacher. Reveals "You're not a prisoner. You're an employee." |
| **Driftwood** | Wetfish (saboteur) | Corrupted copy of a former member. Ghost in the CI/CD pipeline. |

## JFC — Jellyfish Crew

Inspired by the real-life **Telecomix** hacker group. A hacker-anarchist rave collective operating in the deep layers of the dream. "No logs, no cops, no cover charge."

- **Rachel** runs it — handles trust, access policy, the hard decisions
- **Vendor stalls**: cyber stims, bottled club dreams, wetfish merch
- **Intel gathering**: tips about ClearCaptions service entrance, STG DNS anomalies, ad timing vulnerabilities
- **Philosophy**: connectivity is a human right, the network is the revolution

## Ending

The "escape" is waking up at a desk:

- Keyboard imprint on cheek
- Cold coffee, four hours old
- Terminal: `Apply complete! Resources: 5 added, 0 changed, 0 destroyed.`
- Coworker: "Dude. You fell asleep again. Standup's in five."
- S. Blade holds the door. #wetfish-dev is a real IRC channel. The certs on the wall are yours.
- Final standup: "Yesterday I worked on the infrastructure migration. Today I'll continue the infrastructure migration. No blockers."

The dream didn't trap you. It showed you what your life looks like from the inside.
