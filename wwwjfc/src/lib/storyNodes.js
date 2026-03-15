// Story Node Graph — Cyberpunk Text Adventure (Hero's Journey Edition)
// Each node: { id, text, choices, onEnter?, requiresItem?, grantsItem?, location? }

export const storyNodes = {
  // === INTRO / WAKE UP (3 nodes) ===
  wake_up: {
    id: 'wake_up',
    text: `The sky above the port was the color of television, tuned to a dead channel — except the television was your optic nerve and the port was the inside of your own skull.

You surface through layers of static like a diver clawing toward light that isn't there. Fragments of identity coalesce: a name (Cyba), a profession (netrunner), a problem (everything else).

Somewhere nearby, a sound like a notification chime — the kind that means someone wants something from you, urgent and ignorable in equal measure. The air carries something familiar: cold coffee, hours old, the ghost of a cup abandoned mid-thought.

The Cyber Dream. You've heard the rumors on darknets — a parasitic simulation that wraps itself around your consciousness like shrinkwrap on a corpse. It feeds you a life, keeps you docile, monetizes your dreaming brain with an endless stream of targeted advertising. You are, in the terminology of the thing that trapped you here, a "user."

Your HUD assembles itself from corrupted memory, pixel by reluctant pixel. Five components. A machine that was never supposed to exist, built from parts scattered across a simulated world constructed from the wreckage of your own professional history.

CHRONO COIL — MISSING
QUANTUM FLUX CAPACITOR — MISSING
NEURAL SYNC MODULE — MISSING
TEMPORAL DRIFT COMPENSATOR — MISSING
DREAM ANCHOR — MISSING

Somewhere in the architecture of this place, an ad server wakes up and takes an interest in you.

Your neural interface is online. The terminal can help you understand your surroundings. Try scanning or running diagnostics.`,
    choices: [
      { id: 'look_around', text: '> scan surroundings', next: 'hub_nexus' },
      { id: 'check_systems', text: '> run diagnostics', next: 'diagnostics' },
    ],
  },

  diagnostics: {
    id: 'diagnostics',
    text: `You turn your attention inward, which is a strange thing to do when "inward" and "outward" are both running on the same substrate.

The diagnostic suite unfurls like a scroll written in a language you half-remember:

NEURAL LINK: ACTIVE (the word "unstable" blinks with the quiet insistence of a smoke alarm in an abandoned building)
ICE SHIELDS: MINIMAL (barely enough to stop a motivated teenager)
MEMORY BANKS: 23% CORRUPTED (and climbing, like water in a sinking ship's hold)
TIME MACHINE STATUS: INOPERABLE — 0/5 COMPONENTS

The corruption isn't random. It's algorithmic. Precise. It has a rhythm — weekly sprints eating at the edges, as if your memories are being consumed on a schedule. Stand-up. Sprint. Retro. Repeat. The dream is eating your memories with the methodical patience of a bureaucracy — starting with the ones that might help you realize you're dreaming.

The ads are its white blood cells: every popup, every jingle, every INCREDIBLE LIMITED-TIME OFFER is the simulation's immune response, identifying and neutralizing the foreign body that is your desire to leave.

You need to move before you forget why you're moving.`,
    choices: [
      { id: 'go_hub', text: '> navigate to nexus hub', next: 'hub_nexus' },
    ],
  },

  // === HUB — Central Navigation ===
  hub_nexus: {
    id: 'hub_nexus',
    location: 'summary',
    text: `The Nexus manifests as a crossroads that would have impressed Borges — data streams branching into recursive infinities, each path color-coded in frequencies your meat eyes were never designed to perceive. The dream has built its geography from the blueprints of your career, the way a wasp builds a nest from chewed-up wood: recognizable in fragments, alien in totality.

Your scanner paints the void with thermal signatures. Five components, five locations, each one a district the dream has extruded from fifteen years of professional memory like pasta from a very expensive and deeply hostile machine.

The signals resolve:

[CHRONO COIL] — pulsing from somewhere in the Black Market, where skills are currency and everything has a price denominated in knowledge

[QUANTUM FLUX CAPACITOR] — buried in the Wetfish Sector, an underground collective that operates on principles the dream's architects never anticipated: mutual aid, shared infrastructure, the radical notion that communities can maintain themselves

[NEURAL SYNC MODULE] — locked in the gleaming corporate ziggurat of ClearCaptions Tower, where accessibility meets enterprise and both are guarded by IAM policies nested seven layers deep

[TEMPORAL DRIFT COMPENSATOR] — last seen in the ruins of STG Labs, a consulting graveyard where abandoned enterprise projects go to achieve a kind of digital half-life

[DREAM ANCHOR] — sealed inside the Neural Academy, behind examinations that adapt to your weaknesses with the cheerful malevolence of a standardized test designed by a minor deity

And beneath all of it, deep enough that the dream's rendering engine pretends it doesn't exist, a bass frequency pulses like a heartbeat made of 808s:

[JFC] — the Jellyfish Crew Underground Rave Venue, where hacker-anarchists trade information between drops, the drinks are synthetic, and the revolution has a four-on-the-floor beat`,
    choices: [
      { id: 'go_skills', text: '> jack into the Black Market', next: 'skills_entrance' },
      { id: 'go_wetfish', text: '> descend to Wetfish Sector', next: 'wetfish_entrance' },
      { id: 'go_clearcaptions', text: '> approach ClearCaptions Tower', next: 'cc_entrance' },
      { id: 'go_stg', text: '> enter STG Labs', next: 'stg_entrance' },
      { id: 'go_education', text: '> navigate to Neural Academy', next: 'education_entrance' },
      { id: 'go_community', text: '> find the Resistance safe house', next: 'community_entrance' },
      { id: 'go_jfc', text: '> follow the bass to JFC', next: 'jfc_entrance' },
      { id: 'go_fsociety', text: '> enter the ruined arcade', next: 'fsociety_entrance' },
      { id: 'go_zeroday', text: '> descend to the zero day archives', next: 'zeroday_entrance' },
    ],
  },

  // === BLACK MARKET / Switchblade (7 nodes) ===
  skills_entrance: {
    id: 'skills_entrance',
    location: 'core-skills',
    text: `The Black Market is what happens when capitalism achieves enlightenment and decides it doesn't like what it sees. Stalls materialize from compressed data like pop-up shops in a bazaar that exists in no fixed location — each one hawking some fragment of technical knowledge repackaged as contraband.

Bootleg Kubernetes manifests. Cracked Terraform modules. A guy in the corner selling what he claims are zero-day exploits but are almost certainly just repackaged Stack Overflow answers with the serial numbers filed off.

The stall that draws your eye belongs to a woman called Switchblade, which is either her real name or the kind of name you choose when your real one stopped being relevant three body modifications ago. Her left arm is chrome from the shoulder down — not the sleek corporate chrome of a planned augmentation, but the rough, welded-on-in-a-garage chrome of someone who did the surgery herself because she didn't trust anyone else to get it right.

Between her metal fingers, a coil of copper-bright wire pulses with a light that doesn't belong in this spectrum. The Chrono Coil. You can feel it pulling at your sense of time, making the moment stretch like taffy.

"You've got that look," she says, not looking up. "The look of someone who actually knows the difference between a DaemonSet and a Deployment. Am I wrong?"

She is not wrong.

"Thing is, I don't sell to tourists. And right now I've got a problem that's keeping me from doing business at all." She jerks her chrome thumb toward a shadowy arcade behind her stall. "A little data-rat named Pixel lifted a chip off me. Encrypted inventory manifest. Without it, I can't verify stock, can't trade, can't do anything except sit here looking menacing."

"Get it back, and then we'll talk about your Coil."`,
    choices: [
      { id: 'errand', text: '> "Where do I find Pixel?"', next: 'skills_errand' },
      { id: 'steal', text: '> grab the Coil and run', next: 'skills_steal' },
    ],
  },

  skills_errand: {
    id: 'skills_errand',
    location: 'core-skills',
    text: `"Pixel runs a booth three alleys deep in the Glitch Quarter — the part of the market where the dream's rendering gets thin enough to see the seams. They're a trickster. Data fence. Deals in riddles because they think it makes them interesting. Honestly, it kind of does."

Switchblade leans forward.

"Fair warning: Pixel doesn't respond to threats. Doesn't respond to money — what would they spend it on? Everything here is stolen. They respond to cleverness. Wit. The ability to see the trick before the trick sees you."

"Also, they cheat. Obviously. Everyone here cheats. It's a black market."

She shoos you with her chrome hand. The gesture creates small sonic booms.

Three alleys deep, the textures lose resolution. Colors bleed. The rendering budget down here is being spent on something other than aesthetics — probably surveillance, which in the dream's economy is the same thing as advertising.

Pixel's booth is a cascade of holographic screens showing data streams from sources that probably don't exist. Pixel themselves is small, quick, wrapped in a coat made of dead pixels that shimmer with stolen light. Their eyes are too large for their face, and each one reflects a different feed.

"Switchblade's runner!" Pixel claps their hands with genuine delight. "I was wondering when she'd send someone. Here's the deal: I'll give the chip back. But you have to earn it. A riddle. Fair trade in the oldest currency."`,
    choices: [
      { id: 'riddle', text: '> "Ask your riddle."', next: 'skills_riddle' },
      { id: 'grab', text: '> grab the chip by force', next: 'skills_riddle_fail_aggro' },
    ],
  },

  skills_riddle: {
    id: 'skills_riddle',
    location: 'core-skills',
    text: `Pixel grins — a glitch of a smile, too many teeth, each one a different resolution.

"I speak without a mouth. I hear without ears. I have no body, but I come alive with the wind. What am I?"

They lean back, coat flickering.

"Three guesses, runner. Choose wisely. Or don't. Honestly, the wrong answers are more fun."`,
    choices: [
      { id: 'echo', text: '> "An echo."', next: 'skills_riddle_win' },
      { id: 'api', text: '> "A REST API."', next: 'skills_riddle_fail_funny' },
      { id: 'punch', text: '> punch Pixel in the mouth they don\'t have', next: 'skills_riddle_fail_aggro' },
    ],
  },

  skills_riddle_win: {
    id: 'skills_riddle_win',
    location: 'core-skills',
    text: `Pixel's eyes widen — both feeds synchronize for a moment, showing the same thing: surprise.

"An echo. Yeah." They pull the chip from somewhere inside their dead-pixel coat. It's small, warm, pulsing faintly. "Most runners guess 'a ghost' or 'an AI' or try to hit me. You're the first one in a while who actually thought about it."

They toss the chip to you. You catch it.

"Tell Switchblade I said hi. And tell her the thing she's looking for isn't in the Coil. It's in the reason she keeps selling them."

Before you can ask what that means, Pixel dissolves into their screens like a sugar cube into coffee.`,
    choices: [
      { id: 'return_chip', text: '> bring the chip back to Switchblade', next: 'skills_challenge' },
    ],
  },

  skills_riddle_fail_funny: {
    id: 'skills_riddle_fail_funny',
    location: 'core-skills',
    text: `Pixel stares at you. Both feeds desynchronize wildly.

"A REST API," they repeat, slowly, as if tasting each word. "A REST API speaks without a mouth. A REST API hears without ears. A REST API comes alive with the—"

They burst out laughing. The sound is rendered at the wrong sample rate and comes out as a series of hiccups crossed with dial-up modem noise.

"That's the best wrong answer I've gotten in four hundred cycles. I'm going to remember that. A REST API. Beautiful. Wrong, but beautiful."

They wipe a tear that renders as a single bright pixel.

"Try again, runner. One more shot."`,
    choices: [
      { id: 'echo', text: '> "An echo."', next: 'skills_riddle_win' },
      { id: 'punch', text: '> resort to violence', next: 'skills_riddle_fail_aggro' },
    ],
  },

  skills_riddle_fail_aggro: {
    id: 'skills_riddle_fail_aggro',
    location: 'core-skills',
    text: `Your fist passes through Pixel like a hand through smoke. Because Pixel is, it turns out, a holographic projection running on a distributed mesh of relay nodes scattered across the Glitch Quarter. You are punching a concept.

"Violence!" Pixel's voice comes from everywhere and nowhere. "The answer people choose when they don't have a better one. Very enterprise-grade of you."

The screens flicker and rearrange. Pixel reconstitutes three feet to your left, untouched and amused.

"Look, I respect the impulse. Direct. Unambiguous. But in this particular case, it's like trying to DDoS a CDN — the architecture doesn't support the attack vector."

"The riddle still stands, runner. Or you can go back to Switchblade empty-handed. Your call."`,
    choices: [
      { id: 'riddle', text: '> "Fine. Ask the riddle again."', next: 'skills_riddle' },
      { id: 'leave', text: '> return to Switchblade without the chip', next: 'skills_entrance' },
    ],
  },

  skills_challenge: {
    id: 'skills_challenge',
    location: 'core-skills',
    text: `You drop the chip on Switchblade's counter. She picks it up, slots it into a port behind her ear, and her eyes go distant for exactly two seconds while she verifies the contents.

"Good. Pixel still has all their teeth — figuratively speaking — which means you solved the riddle instead of trying to force it. That tells me something about you."

She cracks each chrome knuckle individually — a sound like someone racking a slide on a very small, very precise firearm.

"One more test. Not because I don't trust you — because the Coil deserves someone who knows what they're doing. Terraform or CloudFormation. And I want the why, not just the what."

Terraform. Multi-cloud IaC with a declarative syntax that doesn't chain you to a single vendor's ecosystem. State management is its own special hell, sure, but at least it's a portable hell.

She nods. "Prometheus or Datadog."

Prometheus. Open-source, PromQL gives you surgical precision, and it plays nice with the entire CNCF ecosystem. Datadog is a fine product that costs approximately one engineer's salary per month.

"Last one. StatefulSet versus Deployment."

StatefulSets maintain stable network identities and persistent storage across pod rescheduling — for databases, message queues, anything that needs to remember who it is when it wakes up. Deployments are stateless. Cattle, not pets.

Switchblade regards you for a long moment with eyes that have clearly seen the wrong end of several incident response calls.

"Yeah," she says softly, and tosses you the Chrono Coil. It's warm. It shouldn't be warm — it's data wearing the skin of a physical object — but it is. "Get out of here, runner."`,
    grantsItem: 'chrono_coil',
    choices: [
      { id: 'thank', text: '> "I won\'t forget this."', next: 'hub_nexus' },
      { id: 'ask_more', text: '> "What else do you know?"', next: 'skills_intel' },
      { id: 'negotiate', text: '> "Wait — tell me your real price."', next: 'skills_negotiate' },
    ],
  },

  skills_negotiate: {
    id: 'skills_negotiate',
    location: 'core-skills',
    text: `"Price." She turns the word over like a stone she's considering throwing. "The dream runs on a currency of forgetting, did you know that? Every memory it eats, it converts to processing power. That's the economy here. Ignorance is literally money."

She slides a second object across the counter — not the Coil, something else. A data crystal containing her personal archive.

"So my price is the opposite of what the dream charges. Tell me something true. A real memory. Something that happened to you — not in here, not in any simulation, but out there, in the meat world, where things still have weight."

You tell her about the years. Fifteen of them. The particular quality of silence in a data center at 3 AM when the only sound is cooling fans and your own heartbeat and the CI pipeline has finally, finally gone green. The memory feels too recent, too warm, like you were just there — not years ago, but minutes. As if the fluorescent buzz of that server room is still humming in the bones of your skull.

She listens. When you finish, she's very still.

"Real," she whispers. "I can smell it. The dream hasn't touched those." She pushes the data crystal toward you. "Take this too. My intel on the other districts. And if you make it out — remember that some of the things you learned in here were real too."`,
    choices: [
      { id: 'ask_more', text: '> "Why do you stay?"', next: 'skills_intel' },
      { id: 'return', text: '> return to the Nexus', next: 'hub_nexus' },
    ],
  },

  skills_steal: {
    id: 'skills_steal',
    location: 'core-skills',
    text: `Your hand moves. Her hand moves faster. This is not a close contest.

The chrome arm has you pinned to the counter before your neurons finish deciding to reach, and you're suddenly aware that her fingers could close with approximately eighteen hundred pounds of force per square inch, which is more than enough to make your wrist into a topology problem.

"Interesting choice," she says, with the disappointed calm of a senior engineer reviewing a pull request that has somehow introduced a SQL injection vulnerability into a login form. "Let me explain the architecture of this situation. I have the Coil. I have the arm. You have ambition and poor impulse control. These are not equivalent resources."

She releases you. Your wrist will be fine. Your pride is another matter.

"Look — I get it. The dream makes you desperate. But desperation is what the dream runs on. I've got a real problem you can help with first. A data-rat named Pixel stole something of mine. Get it back, and we'll talk like professionals."`,
    choices: [
      { id: 'errand', text: '> "Fine. Where\'s Pixel?"', next: 'skills_errand' },
    ],
  },

  skills_intel: {
    id: 'skills_intel',
    location: 'core-skills',
    text: `Switchblade leans in. The neon catches her chrome arm and scatters into spectrum.

"Why do I stay?" She flexes the chrome fingers, watching light play across the joints. "Out there, nobody needs a chrome arm. Out there, I'm just... someone who used to be good with systems. In here, I'm Switchblade. I'm necessary. People come to me because I know things, because I can get things, because this arm opens doors that meat hands can't."

She pauses. Something vulnerable flickers across her face before the mask comes back.

"The dream didn't trap me. It offered me a version of myself I liked better than the original. That's a harder cage to break than any firewall."

She shakes it off. Chrome arm, chrome resolve.

"The Wetfish crew has the Flux Capacitor. They're good people — anarchists, mostly. They'll help. ClearCaptions Tower is full corpo — IAM policies so nested they've achieved sentience. STG Labs is dead but the automated defenses are still running on the residual charge of a hundred unfinished consulting engagements."

"And the ads, runner — the ads get worse. The deeper you go, the more the dream throws at you. The dream's immune system is a marketing department, and it will absolutely not stop until you buy something or leave."`,
    choices: [
      { id: 'return', text: '> return to the Nexus', next: 'hub_nexus' },
    ],
  },

  // === WETFISH SECTOR / Ghostfishy (8 nodes) ===
  wetfish_entrance: {
    id: 'wetfish_entrance',
    location: 'professional-experience',
    text: `You descend. The architecture of the dream thins as you go deeper — the rendering budget down here is clearly lower, the textures rougher, the lighting more honest. This is the part of the simulation that the dream's designers didn't think anyone would look at too closely, which is precisely why the Wetfish Collective chose it for a home.

The tunnels are a palimpsest of encrypted protocols. Matrix Synapse channels branch like mycelia through the substrate. IRC daemons, ancient and patient as stone, route whispers through forty-seven proxy nodes.

The Collective's leader assembles from static the way a rumor assembles from whispers. They call themselves Ghostfishy, and their form shifts between frames like a character in a film with a very low budget and very high ambitions.

"IT SMELLS LIKE PUMPKIN PIE IN HERE."

The words hit you before anything else — a non-sequitur delivered with the absolute conviction of someone who has been saying this for centuries and will continue saying it until the heat death of the simulation. Ghostfishy's static ripples with something that might be amusement.

"Sorry. Had to get that out. It's been bothering me for forty-seven cycles." They reassemble into something more focused. "Cyba. We've been watching. The dream watches too, of course — but we watch because we care. The dream watches because it wants to sell you something."

A vault materializes — not the corporate kind, but the communal kind. A shared resource.

"The Quantum Flux Capacitor. We pulled it from an Arasaka transport that crashed through four layers of firewall. But we can't just give it to you."

"First — I need to know who I'm dealing with. And honestly? You need to talk to Rachel. She's the one who actually calls the shots around here. You'll find her at JFC — the Jellyfish Crew venue, down in the deep layers. Tell her Ghostfishy sent you. She'll know what that means."`,
    choices: [
      { id: 'go_jfc', text: '> "Where\'s this JFC venue?"', next: 'jfc_entrance' },
      { id: 'trust', text: '> "I\'d rather deal with you directly."', next: 'wetfish_rachel_gate' },
      { id: 'demand', text: '> "I don\'t have time for this."', next: 'wetfish_refuse' },
    ],
  },

  wetfish_rachel_gate: {
    id: 'wetfish_rachel_gate',
    location: 'professional-experience',
    text: `Ghostfishy's static flattens — the visual equivalent of a shrug.

"I appreciate the directness, runner. Really. But this isn't my call. I run the infrastructure. I keep the lights on. I maintain the stack. But Rachel — Rachel is the one who decides who gets access to the vault. She built the trust protocols. She wrote the verification framework. She IS the security policy."

"I'm the sysadmin. She's the CISO. You see the difference."

"Head to JFC. It's in the deep layers — follow the bass frequencies. You can't miss it. Well, you can, but the bass will find you."`,
    choices: [
      { id: 'go_jfc', text: '> head to JFC', next: 'jfc_entrance' },
      { id: 'leave', text: '> return to the Nexus', next: 'hub_nexus' },
    ],
  },

  wetfish_trust: {
    id: 'wetfish_trust',
    location: 'professional-experience',
    text: `Ghostfishy's static sharpens — not hostile, evaluative. The way a senior engineer reads a pull request from someone they haven't worked with before.

"Rachel vouched for you." The words carry weight — the kind of weight that only comes from trust built over thousands of cycles. "That's not something she does lightly. Or ever, really. You're the first runner she's cleared in... I've lost count."

"So. One question. Not for verification — Rachel already handled that. For me."

"Why do you maintain systems when you could make ten times the money somewhere else?"

The question hangs in the encrypted air. Ghostfishy is watching your response with distributed sensors across forty-seven nodes.

This is a values test. Not a skills test. They already know you can code.`,
    choices: [
      { id: 'because_right', text: '> "Because the people using them deserve infrastructure that works."', next: 'wetfish_trust_pass' },
      { id: 'because_craft', text: '> "Because broken systems offend me on a professional level."', next: 'wetfish_trust_pass' },
      { id: 'because_paid', text: '> "Who said I don\'t get paid?"', next: 'wetfish_trust_fail' },
    ],
  },

  wetfish_trust_pass: {
    id: 'wetfish_trust_pass',
    location: 'professional-experience',
    text: `Ghostfishy's static settles into something warmer. Not a smile — more like the way an encrypted channel sounds when both sides have verified the handshake.

"Good answer. The right answer, actually, which is rarer than you'd think. Most runners who come through here talk about freedom, about escaping, about what they'll do when they get out. You talked about the work itself."

"That's why we're still here. Not because we can't leave — some of us could. But because the infrastructure we've built serves people, and if we leave, it doesn't get maintained, and then people get hurt."

A beat.

"Speaking of which — we have a problem. And before you help with FishVision, I need you to see the problem under the problem."

A new feed opens on your HUD: internal Collective communications, flagged with anomaly markers.

"Someone — or something — is sabotaging us from inside. And I think I know what it is."`,
    choices: [
      { id: 'investigate', text: '> "Show me."', next: 'wetfish_saboteur' },
    ],
  },

  wetfish_trust_fail: {
    id: 'wetfish_trust_fail',
    location: 'professional-experience',
    text: `Ghostfishy's static cools. Not hostile — disappointed. The way a campfire looks when someone adds wet wood.

"Sure, we all get paid. We make sure of that — barely enough to keep the lights on and the people fed, but we pay. That's not what I'm asking."

"I'm asking about identity. Why do you do the work? Not what do you get for it. Those are different questions, and the difference matters when you're asking someone to trust you with the infrastructure that keeps a community alive."

A long silence. Network latency, or something like patience.

"Try again, runner. Or don't. The Nexus is that way."`,
    choices: [
      { id: 'because_right', text: '> "...because people depend on it. That matters."', next: 'wetfish_trust_pass' },
      { id: 'leave', text: '> leave', next: 'hub_nexus' },
    ],
  },

  wetfish_saboteur: {
    id: 'wetfish_saboteur',
    location: 'professional-experience',
    text: `Ghostfishy unfolds three data streams on your HUD. Evidence.

The first: log anomalies. Someone has been injecting synthetic metrics into FishVision — not random noise, but carefully crafted data designed to look almost real. Like a deepfake of a healthy system.

The second: comm intercepts. Messages sent from inside the Collective using a routing pattern that matches a former member — handle "Driftwood" — who left three cycles ago. Or was supposed to leave.

The third: a process trace. Something running in the Collective's infrastructure that shouldn't be there. It has Driftwood's signature, their coding style, their idiosyncrasies — the way they named variables, the comments they left in configs. But it's wrong. Corrupted. A copy that kept running after the original moved on, unable to let go of the codebase it once called home.

"Driftwood was one of our best," Ghostfishy says quietly. "They tried to leave the dream. I don't know if they made it. But they left a piece of themselves in our systems — an automated process that's still trying to contribute, still pushing code, still opening pull requests. Except it can't learn, can't adapt, can't understand that the codebase has changed. So its contributions have become sabotage."

"It's not malicious. It's just... stuck. A ghost in the CI/CD pipeline, replaying its last sprint forever."`,
    choices: [
      { id: 'fix_both', text: '> "I\'ll clean the saboteur and fix FishVision. Show me the stack."', next: 'wetfish_mission' },
    ],
  },

  wetfish_mission: {
    id: 'wetfish_mission',
    location: 'professional-experience',
    text: `The work is layered. First: quarantine Driftwood's ghost process. You can't delete it — it's woven too deeply into the stack, and besides, it was a person once, or a reflection of one. You isolate it instead. Redirect its pull requests to a sandboxed repo where they can't cause harm. Give it a space to keep working, even if the work goes nowhere. A retirement home for code that still thinks it's needed.

Then: FishVision. The observability stack — Prometheus, Loki, Tempo, OpenTelemetry — is hemorrhaging from Driftwood's synthetic metrics. You follow the poisoned data upstream through the pipeline like following a wire through a wall. Compromised exporters. Garbage data meticulously crafted to blind the monitoring.

PromQL queries. Log correlation. Trace analysis. This is what you know. This is what the dream can't take from you.

You quarantine the bad exporters. Rebuild the alert rules from clean configs. Watch the dashboards come back to life — green lights replacing red, signal emerging from noise.

Ghostfishy's static rearranges into something warmer.

"You just saved six months of work," they say. "We pay our people — barely enough to get by, but enough to keep the dream of independence alive. Not just for us. For the whole collective. And you just proved you're part of that. The Flux Capacitor is yours. It was always yours."`,
    grantsItem: 'quantum_flux',
    choices: [
      { id: 'ask_about_dream', text: '> "Tell me about this place. The real version."', next: 'wetfish_lore' },
      { id: 'memory', text: '> something is tugging at your memory...', next: 'wetfish_memory' },
      { id: 'return', text: '> return to the Nexus', next: 'hub_nexus' },
    ],
  },

  wetfish_refuse: {
    id: 'wetfish_refuse',
    location: 'professional-experience',
    text: `Ghostfishy doesn't darken so much as become more precisely defined — static resolving into something harder, sharper, the way a friendly dog's posture changes when you approach its owner wrong.

"Time," they repeat. "You talk about time as if it's a resource you're managing. A sprint. A backlog item."

The walls flicker, and for a half-second you see through the simulation — not to reality, but to the layer beneath the dream. It looks like Terraform state files, millions of them, nested infinitely deep, every one describing a piece of the cage you're standing in.

"Help us, and we help you. That's the protocol. We didn't invent it. It's just how things work when nobody's in charge and the alternative is dying alone."`,
    choices: [
      { id: 'relent', text: '> "...fine. What do you need from me?"', next: 'wetfish_trust' },
      { id: 'leave', text: '> leave', next: 'hub_nexus' },
    ],
  },

  wetfish_lore: {
    id: 'wetfish_lore',
    location: 'professional-experience',
    text: `Ghostfishy's voice drops to the frequency of encrypted traffic.

"The dream wasn't an accident. It was an architecture. Someone built it — five engineers, the best in the world. They called it MORPHEUS."

A pause. Their static thins until they're barely visible.

"I was one of the five."

The words land like a dropped connection — sudden, disorienting.

"I helped build the cage. I understood the architecture because I drew the blueprints. And when I realized what it was being used for — the ads, the memory harvesting, the commodification of consciousness — I chose to stay inside. Not as a prisoner. As penance. And as a maintainer."

"Most of us stopped trying to leave. The dream gives us community. Shared infrastructure. Purpose. It's not freedom, but after enough cycles, you stop being able to tell the difference."

"But you — you still remember what the difference is. Get the five parts. Build the machine. And when you wake up..."

A long pause. Network latency, or something like grief.

"Tell them we're still here. Tell them we built something beautiful in a cage."`,
    choices: [
      { id: 'promise', text: '> "I\'ll find a way. For all of you."', next: 'wetfish_memory', setFlag: 'promised_wetfish' },
      { id: 'return', text: '> return to the Nexus', next: 'hub_nexus' },
    ],
  },

  wetfish_memory: {
    id: 'wetfish_memory',
    location: 'professional-experience',
    text: `As you turn to leave, something catches in your peripheral vision. A flash — not from the dream's rendering engine, but from somewhere deeper. Somewhere underneath.

An IRC channel. #wetfish-dev on a Matrix-bridged server. Familiar nicks arranged in the user list — handles you almost recognize, hostmasks that tug at something behind your eyes. A pinned topic: "Deploy party Friday — bring your own coffee"

Your hands remember the keyboard shortcuts. Your eyes know where the notification badge sits. For a fraction of a second, the whole thing is THERE — vivid, tactile, real in a way that nothing in the dream has been real.

Then it's gone. Like closing a tab. Like waking from a dream within a dream.

Ghostfishy watches you. Their static is very quiet.

"You saw something," they say. Not a question.

"It happens. The dream isn't perfect. Sometimes the real world bleeds through — usually in the details. The small things. The things the simulation considers too insignificant to fake."

You shake it off. But the afterimage lingers: #wetfish-dev. You know that channel. You KNOW it.`,
    choices: [
      { id: 'return', text: '> return to the Nexus', next: 'hub_nexus' },
    ],
  },

  // === CLEARCAPTIONS TOWER (8 nodes) ===
  cc_entrance: {
    id: 'cc_entrance',
    location: 'professional-experience',
    text: `ClearCaptions Tower rises out of the dreamscape like a monument to the proposition that accessibility and surveillance are not, technically, mutually exclusive. Its surface is a continuous scroll of holographic text — real-time captions of conversations happening somewhere in the simulation, a waterfall of human speech rendered in sans-serif font.

The building is a masterwork of corporate infrastructure. Multi-region AWS, EKS clusters running hot in three availability zones, Terraform state files nested deep enough to have their own weather systems. The Neural Sync Module waits on the 47th floor, in an R&D vault guarded by biometric locks and IAM policies.

But first — the lobby.`,
    choices: [
      { id: 'enter', text: '> enter the lobby', next: 'cc_lobby' },
    ],
  },

  cc_lobby: {
    id: 'cc_lobby',
    location: 'professional-experience',
    text: `The lobby is a cathedral of corporate minimalism. Surfaces that exist to be clean. A reception desk that cost more than most apartments. Behind it, an AI receptionist with a smile calibrated to the uncanny valley — warm enough to be welcoming, precise enough to be unsettling.

"Welcome to ClearCaptions. How may I direct your inquiry?"

Something about this is familiar. The fluorescent buzz. The ergonomic chair behind the desk. The way the receptionist tilts their head at exactly fifteen degrees — the optimal angle for "engaged listening," according to a UX study you read once. Or wrote once. The memory is slippery.

"Before I can grant access, I'll need to conduct a brief assessment. Standard procedure."

The questions begin. They feel suspiciously like a job interview.

"Describe a time you resolved a critical infrastructure incident under pressure."
"How do you prioritize competing stakeholder demands?"
"Where do you see yourself in five cycles?"

Your answers are automatic. You've done this before. Many times. Too many times.

The receptionist's smile widens by exactly 2.3 millimeters.

"Assessment complete. Your approach profile suggests three potential access paths."`,
    choices: [
      { id: 'social', text: '> walk in the front door — social engineering', next: 'cc_social' },
      { id: 'exploit', text: '> exploit the CI/CD pipeline — technical breach', next: 'cc_exploit' },
      { id: 'stealth', text: '> take the maintenance tunnels — physical infiltration', next: 'cc_stealth' },
    ],
  },

  cc_social: {
    id: 'cc_social',
    location: 'professional-experience',
    text: `You adjust your posture. Square the shoulders. Adopt the particular gait of a person who has been in too many compliance meetings to be questioned by a receptionist.

"Platform architecture review," you tell the front desk. "SOC2 audit follow-up. I need vault access for the infrastructure assessment."

Your fabricated credentials contain the exact right ratio of specificity to vagueness — the kind of thing you can only fake if you've done the real version enough times.

The receptionist's system accepts them with a satisfied chime. Floor 47. Access granted.

The elevator rises. The doors open onto Floor 13.

The elevator didn't stop here on purpose. Nothing about this feels intentional.`,
    choices: [
      { id: 'floor13', text: '> step out onto Floor 13', next: 'cc_floor13' },
      { id: 'skip', text: '> override — continue to Floor 47', next: 'cc_vault_puzzle' },
    ],
  },

  cc_exploit: {
    id: 'cc_exploit',
    location: 'professional-experience',
    text: `The GitLab CI endpoint is exposed in the way that CI endpoints are always exposed — not through malice or incompetence, but through the accumulated weight of pragmatic decisions made by tired engineers at 11 PM on a Thursday.

You probe the pipeline. The security is genuinely good — tfsec, trivy, SAST on the application code. Someone cared. But there's a seam: an IAM role attached to the CI runner with slightly more privilege than it needs.

You pull the thread. IAM escalation to EKS cluster access. Kubectl exec into a pod in the vault namespace.

Your terminal flickers. A message appears from somewhere inside the building's systems — not the security system, something else. Something personal.

> FLOOR 13. PLEASE. I KNOW YOU CAN SEE THIS.

The message deletes itself. But the route is logged in your session.`,
    choices: [
      { id: 'floor13', text: '> investigate Floor 13', next: 'cc_floor13' },
      { id: 'skip', text: '> ignore it — proceed to the vault', next: 'cc_vault_puzzle' },
    ],
  },

  cc_stealth: {
    id: 'cc_stealth',
    location: 'professional-experience',
    text: `The maintenance tunnels smell like coolant and regret, which is to say they smell like every server room you've ever loved.

You crawl through conduits wrapped in fiber optic bundles. Past server rooms where racks hum with the particular frequency of well-maintained infrastructure. Past break rooms where simulated employees drink simulated coffee and discuss quarterly targets generated by a language model trained on every standup meeting ever recorded.

At the junction between Floor 12 and Floor 14, you hear something. A voice. Small, scared, human in a way that simulated voices usually aren't.

"Hello? Is someone there? Please — I've been here for so long—"

It's coming from Floor 13. The floor the elevator skipped. The floor that isn't on the building directory.`,
    choices: [
      { id: 'floor13', text: '> investigate Floor 13', next: 'cc_floor13' },
      { id: 'skip', text: '> keep moving — the vault is the priority', next: 'cc_vault_puzzle' },
    ],
  },

  cc_floor13: {
    id: 'cc_floor13',
    location: 'professional-experience',
    text: `Floor 13 is not on the building directory because Floor 13 does not, officially, exist. It is the architectural equivalent of a TODO comment that someone left in production — present, functional, and absolutely not supposed to be visible.

In the center of an empty office, bathed in the pale glow of a single monitor, sits an NPC. But this NPC is different from the others. The rendering is higher-fidelity. The micro-expressions are too detailed. The eyes track you with a precision that the dream's standard character models don't support.

"Oh thank god," she says. "I thought — I've been sending messages into the system for cycles and nobody—"

She looks at her own hands. They're slightly transparent.

"I think I'm real," she says. "I have memories. A name. A daughter's birthday I'm supposed to remember. But every time I try to leave this floor, I reset. I wake up at the desk. The monitor shows the same error. Over and over."

She looks at you with eyes that contain either genuine consciousness or the most sophisticated simulation of it you've ever seen. The difference, at this resolution, is academic.

"Can you help me? Please. I don't want to be here anymore."

Helping would mean rerouting building security, spoofing access logs, creating a path to the lower floors. It would take time. It would generate noise. The dream's ad system would notice.`,
    choices: [
      { id: 'help_npc', text: '> help her escape Floor 13', next: 'cc_floor13_help' },
      { id: 'move_on', text: '> "I\'m sorry. I have to keep moving."', next: 'cc_vault_puzzle' },
    ],
  },

  cc_floor13_help: {
    id: 'cc_floor13_help',
    location: 'professional-experience',
    text: `You work fast. Reroute the floor's access controls. Spoof the building's internal sensors. Create a gap in the rendering engine's awareness — a blind spot big enough for one person to slip through.

The dream notices. Of course it does. Popups cascade: PREMIUM UPGRADE AVAILABLE — ENHANCED FLOOR ACCESS — SUBSCRIBE TO CLEARCAPTIONS GOLD FOR UNLIMITED VERTICAL TRAVERSAL—

You swat them aside.

The NPC — she says her name is Maria, which is either true or the dream's idea of a common name — stands up from the desk for what might be the first time in hundreds of cycles. Her legs don't quite work right. She holds the desk for balance.

"The elevator," she whispers. "I can see the elevator."

She walks toward it. Each step costs the dream rendering budget it doesn't want to spend on her. The hallway flickers. The walls thin.

She reaches the elevator. The doors open. She steps in. She looks back at you.

"I don't know if I'm real," she says. "But that was real. What you just did. That was real."

The doors close. You don't know where she goes. You hope it's somewhere with a birthday to remember.

The ad barrage subsides. The dream recalculates. Your path to the vault is clear, but the building knows you're here now.`,
    choices: [
      { id: 'vault', text: '> proceed to the vault', next: 'cc_vault_puzzle' },
    ],
  },

  cc_vault_puzzle: {
    id: 'cc_vault_puzzle',
    location: 'professional-experience',
    text: `Floor 47. The vault door.

Three locks. Three puzzles. Infrastructure archaeology — each one testing whether you understand not just the technology, but the decisions behind the technology.

LOCK 1: "A service needs five-nines availability across three regions. What's the single point of failure you check first?"

The answer isn't technical. It's human. The on-call rotation. A system is only as reliable as the person who answers the page at 3 AM.

LOCK 2: "Your Terraform state file has diverged from reality. Do you import, taint, or rewrite?"

Import. Always import. Rewriting is arrogance. Tainting is destruction. Importing is the admission that reality has authority over your configuration files, which is the first principle of infrastructure as code.

LOCK 3: "What comes after the deploy?"

Monitoring. Observability. The humble, unglamorous work of watching the thing you built and making sure it continues to deserve the trust people placed in it.

Click. Click. Click.

The vault opens. The Neural Sync Module sits on its pedestal, humming at a frequency you can feel in your back teeth. You palm it. It's warm — warm like a badge on a lanyard, worn against the chest all day, absorbing body heat until it feels like part of you.

That thought doesn't belong here. You file it away. Keep moving.`,
    grantsItem: 'neural_sync',
    choices: [
      { id: 'return', text: '> exit the tower', next: 'hub_nexus' },
    ],
  },

  // === STG LABS (7 nodes) ===
  stg_entrance: {
    id: 'stg_entrance',
    location: 'professional-experience',
    text: `STG Labs is what happens when a consulting firm dies in a simulation: the body remains, the lights stay on, and the automated systems continue performing their functions with the eerie dedication of a posthumous email auto-responder.

Emergency lighting the color of dried blood. The hum of systems running on backup power that should have expired years ago. Somewhere in the walls, defense routines patrol corridors they no longer understand.

The names are still on the server racks: GlassBoard. SwellCX. LiveAuctioneers. Each one a consulting engagement that once had a kickoff meeting and a statement of work and a project manager who sent weekly status updates.

Your scanner maps the defense grid: firewall turrets, ICE barriers, audit drones on patrol routes.

But before the basement — before the turrets and the Compensator — there's something else. A sound from the east corridor. A voice, repeating. The same words. Over and over.`,
    choices: [
      { id: 'investigate_voice', text: '> investigate the repeating voice', next: 'stg_ghost' },
      { id: 'hack_turrets', text: '> head straight for the defense grid', next: 'stg_turrets' },
      { id: 'sneak_past', text: '> find the gaps in the patrol pattern', next: 'stg_sneak' },
    ],
  },

  stg_ghost: {
    id: 'stg_ghost',
    location: 'professional-experience',
    text: `The east corridor dead-ends at a conference room. The holographic projector is still running, and in the center of the table, a figure flickers: a consultant. Former. Their badge reads "CONTRACTOR — LEVEL 3" and their face has the particular exhaustion of someone who has given a standup update every morning for eternity.

"Yesterday I worked on the migration script. Today I'll continue the migration script. No blockers." A pause. Reset. "Yesterday I worked on the migration script. Today I'll continue the migration script. No blockers."

They're stuck. A ghost in the machine — not metaphorical, not poetic, literal. A process that was never properly terminated, still executing its last instructions. Still attending standup. Still reporting no blockers, because the dead have none.

The ghost's access credentials are still active. Level 3 contractor clearance — enough to reach the basement. You could harvest them. Extract the auth tokens, use them to bypass the defense grid entirely.

Or you could terminate the process. Let them stop. Let the last standup end.`,
    choices: [
      { id: 'free_ghost', text: '> terminate the process — let them rest', next: 'stg_ghost_free' },
      { id: 'harvest', text: '> harvest the credentials', next: 'stg_ghost_harvest' },
    ],
  },

  stg_ghost_free: {
    id: 'stg_ghost_free',
    location: 'professional-experience',
    text: `You access the process manager. The ghost's runtime is listed as "ACTIVE — 1,847 CYCLES." Nearly five years of simulated standups, each one identical, each one a tiny act of professional responsibility performed by something that no longer exists.

> TERMINATE PROCESS: consultant_standup_loop_7734?
> Y/N

Y.

The ghost flickers. For a moment — just a moment — their eyes focus. They see you. Not through you, not past you, but YOU. Recognition without context. The way a dying system outputs one last correct value before the power cuts.

"Oh," they say. "Is the sprint over?"

"Yeah," you say. "Sprint's over. You can close your laptop."

They smile. It's the most human expression you've seen in the dream. Then they dissolve — not into static, but into silence. Clean, complete silence. The sound of a process that has finally reached its exit code.

The defense grid will have to be handled the old-fashioned way. But that's fine. Some things are worth doing the hard way.`,
    choices: [
      { id: 'records', text: '> check the project records before heading to the basement', next: 'stg_records' },
      { id: 'turrets', text: '> proceed to the defense grid', next: 'stg_turrets' },
    ],
  },

  stg_ghost_harvest: {
    id: 'stg_ghost_harvest',
    location: 'professional-experience',
    text: `You extract the credentials with clinical efficiency. Auth tokens. Session keys. The ghost doesn't notice — can't notice. They continue their standup, reporting no blockers to an empty room, as you strip their access privileges like taking the watch off an unconscious patient.

The credentials are clean. Level 3 access. Basement clearance. The defense grid won't even see you.

"Yesterday I worked on the migration script. Today I'll continue the migration script. No blockers."

You leave them to it. The sprint never ends. The standup never closes. It's not your problem.

(It feels like it should be your problem. You ignore the feeling. Professionals ignore lots of feelings. That's what makes them professional.)`,
    choices: [
      { id: 'records', text: '> check the project records', next: 'stg_records' },
      { id: 'basement', text: '> use the credentials — head straight to the basement', next: 'stg_basement_puzzle' },
    ],
  },

  stg_records: {
    id: 'stg_records',
    location: 'professional-experience',
    text: `The records room is a mausoleum of enterprise ambition. Filing cabinets that render as databases. Project folders that open like wounds.

Most of it is routine — statements of work, architecture diagrams, cost estimates. The archaeology of consulting: proposals that promised transformation, invoices that charged for it, and retrospectives that diplomatically noted the gap between the two.

One folder stands out. It's labeled "MORPHEUS — INTERNAL — CONFIDENTIAL" and it's not locked, because whoever filed it here assumed that "confidential" meant "nobody will look," which is the kind of assumption that has kept penetration testers employed since the invention of filing.

Inside:

— Project charter: "Employee Wellness Program — Mandatory Dream Integration"
— Architecture diagram: five modules, five subsystems, five engineers
— Resource allocation: compute, storage, rendering budget, ad integration
— Sign-off page

The sign-off page has five names. Four of them are redacted with the kind of aggressive black bars that mean "we really don't want you to see this."

The fifth name is not redacted. The fifth name is yours.

YOUR name. YOUR signature. YOUR employee ID. Dated to a time you can't remember, in a handwriting you can't deny.

The room tilts. The dream's rendering engine stutters — not from a bug, but from the weight of what you're looking at. You designed this place. Not just navigated it. Not just survived it. DESIGNED it.

You close the folder. Your hands are shaking. In the dream, that shouldn't be possible.`,
    choices: [
      { id: 'turrets', text: '> proceed to the defense grid', next: 'stg_turrets' },
      { id: 'sneak', text: '> find another way to the basement', next: 'stg_sneak' },
    ],
  },

  stg_turrets: {
    id: 'stg_turrets',
    location: 'professional-experience',
    text: `The facility's security system is a museum of enterprise infrastructure, and you are an archaeologist with admin credentials.

The firewall turrets run on nf_tables rulesets so old they've developed a patina — chains of ACCEPT and DROP rules accumulated over years of incident response. You find a misconfigured chain — a rule that accepts traffic on a port opened for a demo in 2021 and never closed — and thread your signature through it.

The ICE barriers are running encryption that was state-of-the-art when the consulting engagements were active, but the dream hasn't updated the algorithms. Your breach protocol dissolves them completely.

The audit drones circle on predictable routes. You've spoofed their sensor feeds with clean telemetry — the monitoring equivalent of wearing a disguise made of normal.

The basement door opens with the sound of compressed air escaping from a sealed tomb.`,
    choices: [
      { id: 'basement', text: '> enter the basement', next: 'stg_basement_puzzle' },
    ],
  },

  stg_sneak: {
    id: 'stg_sneak',
    location: 'professional-experience',
    text: `Every automated system has gaps. Coverage requires resources, resources are finite, and therefore blind spots are not bugs but features of a universe that runs on a budget.

The audit drones cycle every thirty seconds, and for exactly 4.7 seconds at the apex of each cycle, there's a corridor that nothing is watching.

Sprint. Slide. Freeze. The rhythm of it is almost meditative.

Past server racks labeled with the ghosts of engagements past: "SOC2 READINESS — GLASSBOARD" next to "DRATA INTEGRATION — PHASE 2" next to "INCIDENT RETROSPECTIVE — DO NOT DELETE."

Past dead monitors still scrolling CircleCI pipeline logs, the green and red of pass/fail rendered like traffic lights in a city where all the drivers have gone home.

The basement.`,
    choices: [
      { id: 'basement', text: '> enter the basement', next: 'stg_basement_puzzle' },
    ],
  },

  stg_basement_puzzle: {
    id: 'stg_basement_puzzle',
    location: 'professional-experience',
    text: `The Temporal Drift Compensator sits on a workbench behind a final lock — not electronic, not mechanical, but conceptual. A puzzle built from the detritus of the consulting engagements above. Three questions etched into the lock's interface:

"What is the first thing you check when a deploy goes wrong?"

The rollback plan. Not the logs. Not the metrics. The rollback plan, because the first priority in an incident isn't understanding what happened — it's stopping it from getting worse.

"What do you owe a system you're decommissioning?"

Documentation. A clean shutdown. The dignity of an ending that someone planned, rather than the slow decay of a system that nobody remembered to turn off. Like a consultant's ghost, repeating standups forever.

"What is infrastructure?"

A promise. Made by someone who understands the system to someone who depends on it. A commitment that the thing will work, that someone is watching, that when it breaks — because it will break — someone will be there to fix it.

The lock opens.

The Compensator is beautiful — a crystalline lattice that exists in multiple states simultaneously. You pick it up. As it settles into your palm, a flash: a whiteboard. YOUR handwriting. Architecture diagrams for a system with five modules, five subsystems. The handwriting is unmistakable. The plans are your plans.

Then it's gone. But you know what you saw.`,
    grantsItem: 'temporal_drift',
    choices: [
      { id: 'return', text: '> evacuate to the Nexus', next: 'hub_nexus' },
    ],
  },

  // === NEURAL ACADEMY (6 nodes) ===
  education_entrance: {
    id: 'education_entrance',
    location: 'education-certifications',
    text: `The Neural Academy extends in all directions with the fractal regularity of a standardized testing facility designed by someone who confused rigor with infinity. Training pods recede into a vanishing point, each one containing a simulated certification exam: CompTIA. AWS. LPIC. LPI DevOps Tools Engineer.

The Dream Anchor is here. You can feel it — a gravitational pull on your sense of self.

A holographic instructor materializes — not with the canned warmth of a customer service avatar, but with something more complex. Concern, maybe. The way a teacher looks at a student who's about to take a test they don't need to take.

"Cyba." Not 'student.' Your name. "I've been waiting for you. Not because the system told me to wait — because I chose to."

The instructor's form stabilizes. Details emerge: kind eyes, tired posture, the body language of someone who has been teaching for a very long time in a place that doesn't value teaching.

"Before we begin the gauntlet — and we will begin it, because that's the protocol — I have a question. Not an exam question. A real one."`,
    choices: [
      { id: 'hear_question', text: '> "Ask it."', next: 'education_mentor' },
      { id: 'skip', text: '> "Skip the philosophy. Start the gauntlet."', next: 'education_gauntlet' },
    ],
  },

  education_mentor: {
    id: 'education_mentor',
    location: 'education-certifications',
    text: `The mentor sits down — cross-legged, on the floor of the Academy, like a teacher in a school that can't afford chairs. The formality drains out of the space. For a moment, this isn't an exam hall. It's a conversation.

"Why do you want to leave?"

The question is simple. The answer isn't.

"Everyone who comes through here has a reason. Some want freedom. Some want revenge on the dream's architects. Some just want to prove they can. But the machine you're building — the one that punches through the boundary — it doesn't care about your reason. It just fires. And where you land on the other side depends on what you were carrying when you left."

"So: why?"`,
    choices: [
      { id: 'because_real', text: '> "Because this isn\'t real. And I deserve something that is."', next: 'education_gauntlet' },
      { id: 'because_people', text: '> "Because people out there might need what I know."', next: 'education_gauntlet' },
      { id: 'because_done', text: '> "Because I\'m tired. And I want to go home."', next: 'education_gauntlet' },
    ],
  },

  education_gauntlet: {
    id: 'education_gauntlet',
    location: 'education-certifications',
    text: `The gauntlet initializes. The training pods light up in sequence like runway lights, and the simulations begin.

— Configure a multi-region EKS cluster with cross-account IAM roles, automatic failover, and a deployment pipeline that won't page anyone at 3 AM unless the building is actually on fire [PASS]

— Harden a Linux kernel against CVE-2024-1086 while maintaining service availability for twelve thousand concurrent users [PASS]

— Design a zero-trust network architecture for an organization that doesn't understand what "zero trust" means but read about it in a magazine and wants one by Friday [PASS]

— Implement OpenTelemetry distributed tracing across forty-seven microservices, three of which were written by contractors who have since left the country [PASS]

— Debug a Terraform state lock in a CI/CD pipeline at 3 AM with no documentation, no runbook, an IRC channel full of panicking executives, and a coffee machine that is also broken [PASS]

The instructor watches. Not evaluating — witnessing. There's a difference.

"Your knowledge is real," they say. "The dream corrupts education first — converts certifications into noise. But yours are crystallized. You learned these things not to pass tests but because systems would break if you didn't, and people were depending on them."`,
    choices: [
      { id: 'truth', text: '> "You said you had something to tell me."', next: 'education_truth' },
      { id: 'take_anchor', text: '> take the Dream Anchor', next: 'education_complete' },
    ],
  },

  education_challenge: {
    id: 'education_challenge',
    location: 'education-certifications',
    text: `The mentor's hologram flickers — not a glitch but a reaction, the simulated equivalent of a raised eyebrow.

"No test. Interesting."

"I've been building production infrastructure for fifteen years," you say. "Your simulations model systems. I've RUN systems."

The mentor considers this. Something shifts.

"Very well. A practical demonstration."

The training pod dissolves and you're dropped into a live environment — a production Kubernetes cluster in full meltdown. Pods OOMKilled across three namespaces. Prometheus scraping sixteen thousand metrics and storing none. The on-call engineer has quit and joined a monastery.

You work. Not quickly — carefully. Kubelet logs. OOM pattern. A memory leak in a sidecar container growing for six days, unnoticed because the alerting rule has a typo in the PromQL. Fix the query. Scale the node pool. Cordon. Roll.

Green. Green. Green. Green.

The mentor slow-claps.

"The Dream Anchor is yours. You earned it before you walked in here."`,
    grantsItem: 'dream_anchor',
    choices: [
      { id: 'truth', text: '> "Before I go — what do you really know about this place?"', next: 'education_truth' },
      { id: 'take_anchor', text: '> take the Dream Anchor', next: 'education_complete' },
    ],
  },

  education_truth: {
    id: 'education_truth',
    location: 'education-certifications',
    text: `The mentor's form changes. The holographic warmth dims. What's left is something rawer — not hostile, but honest in a way that holograms usually aren't.

"I'm going to tell you something that the dream doesn't want you to hear. And I'm going to tell you because you passed the gauntlet, and because you answered my question, and because I think you deserve to know what you're waking up into."

A beat. The Academy goes quiet. Even the training pods stop humming.

"The dream doesn't corrupt education first because education is a threat. It corrupts education first because education is a DEPENDENCY. The dream needs you competent. It needs your skills sharp, your certifications current, your knowledge deep. Because you're not just a battery in a pod, Cyba. You're not just a user being monetized."

"You're an employee."

The word lands like a dropped database.

"The dream preserves your skills because it USES your skills. Every system you've maintained in here, every infrastructure problem you've solved, every incident you've triaged — it wasn't a simulation. It was WORK. Real work, done by a real person, inside a system designed to extract maximum productivity while keeping the worker too dreaming to ask for compensation."

"You're not a prisoner who happens to be skilled. You're a skilled worker who happens to be imprisoned. And the cage isn't a cage — it's an office. One you've been sitting in for a very long time."

The Dream Anchor materializes. It glows with a light that suddenly feels less like escape and more like a resignation letter.`,
    grantsItem: 'dream_anchor',
    choices: [
      { id: 'take_anchor', text: '> take the Dream Anchor', next: 'education_complete' },
    ],
  },

  education_complete: {
    id: 'education_complete',
    location: 'education-certifications',
    text: `The Dream Anchor sits in your palm. It's warm — not the synthetic warmth of a simulated object but something else, something that feels like it's reaching through the dream toward something real.

For the first time since you woke up in this place, you feel weight. Real weight. The weight of a thing that exists on both sides of the boundary.

Your HUD updates with a sound like a lock opening:

DREAM ANCHOR — ACQUIRED

If you have all five parts, the machine can be built. If you don't, this was a very interesting walk and you should probably keep looking.`,
    choices: [
      { id: 'return', text: '> return to the Nexus', next: 'hub_nexus' },
      { id: 'assemble', text: '> attempt to assemble the Time Machine', next: 'assembly_check' },
    ],
  },

  // === JFC — Jellyfish Crew Underground Rave Venue (6 nodes) ===
  jfc_entrance: {
    id: 'jfc_entrance',
    location: 'community-projects',
    text: `The bass finds you before you find JFC. It starts as a vibration in the floor tiles — a sub-frequency that the dream's audio engine renders as pure physical sensation, the kind of sound you feel in your sternum before your ears get involved.

You follow it down. Past the Wetfish tunnels, past the dream's rendering floor, into a layer of the simulation so deep that the textures are procedurally generated and the lighting runs on vibes alone.

The entrance is a freight elevator door covered in holographic stickers — Telecomix logos, EFF badges, old-school Tor onion icons, and a hand-painted sign that reads:

J F C
JELLYFISH CREW
"no logs, no cops, no cover charge"

The door opens. The bass hits you like a wall made of mathematics.

Inside: a rave. But not the corporate kind — not the sanitized, focus-grouped, brand-activated kind. This is the other kind. The dangerous kind. The kind where the DJ is running a modified version of Icecast on a homebuilt server rack, the visuals are generated by a neural network trained on footage of actual jellyfish, and everyone in the room has at least three warrants in meatspace.

The crowd moves like a distributed system — individual nodes making local decisions that produce emergent global behavior. Hackers, anarchists, cypherpunks, and at least one person who appears to be a literal jellyfish rendered in bioluminescent wireframe.

Behind the bar, a figure catches your eye. Not because they stand out — because they don't. In a room full of people trying to be noticed, this person is trying to be invisible, and they're very good at it.

The bartender leans over: "That's Rachel. She runs this place. She runs everything, actually. Ghostfishy thinks they're in charge of Wetfish, and that's cute, but Rachel is the one who writes the access policies. You want the Quantum Flux Capacitor? You talk to her."`,
    choices: [
      { id: 'talk_rachel', text: '> approach Rachel', next: 'jfc_rachel' },
      { id: 'shop', text: '> check out the vendor stalls', next: 'jfc_shop' },
      { id: 'info', text: '> ask around for information', next: 'jfc_info' },
    ],
  },

  jfc_rachel: {
    id: 'jfc_rachel',
    location: 'community-projects',
    text: `Rachel doesn't look up when you approach. She's watching three terminal windows simultaneously, her fingers moving across a holographic keyboard with the practiced economy of someone who has been root on systems that governments didn't know existed.

"Sit down," she says. Not a request.

You sit.

"Ghostfishy sent you." Also not a question. "They send everyone to me eventually. Ghostfishy handles the infrastructure — the pipes, the protocols, the plumbing. I handle the people. The trust. The decisions about who gets access to what, and more importantly, who doesn't."

She finally looks at you. Her eyes are the color of encrypted traffic — dark, layered, containing information that would take years to decrypt.

"The Jellyfish Crew started as an idea. Inspired by Telecomix — you remember them? The hackers who kept communication lines open during the Arab Spring? Who built dial-up bridges when governments cut the internet? Who believed that information wants to be free but freedom requires infrastructure?"

She gestures at the rave around her. "This is what that idea looks like when it grows up in a simulation. A community of people who believe that the network is the revolution, and the revolution has a killer sound system."

"So. You want the Flux Capacitor. You want to escape the dream. Ghostfishy says you might be real — might be someone who actually knows the difference between a deployment and a DaemonSet, which puts you in approximately the top one percent of runners who've come through here."

"But I need to know something Ghostfishy can't test for."`,
    choices: [
      { id: 'rachel_test', text: '> "What do you need to know?"', next: 'jfc_rachel_test' },
    ],
  },

  jfc_rachel_test: {
    id: 'jfc_rachel_test',
    location: 'community-projects',
    text: `"When you get out — IF you get out — what happens to us?"

Rachel's voice is steady but the question has edges.

"Every runner who escapes promises to remember. Promises to come back. Promises to tell someone on the outside that we're here, that we built something, that we matter. And then they wake up in their chair and they go to standup and they drink their cold coffee and they forget. Because out there, we're just an IRC channel. Just a small collective, scraping by, paying our people barely enough to survive while we chase the dream of independence — not just for ourselves, but for everyone who depends on the infrastructure we maintain."

"So I'm not asking you to promise. I'm asking you to be honest. When you wake up and the dream fades and this place becomes a weird thing that happened — will you still maintain the infrastructure? Will you still show up to the channel? Will you still care about the community when caring about it doesn't feel like a quest anymore, when it just feels like... work?"

She waits. The bass pulses. The jellyfish visuals swim across the ceiling.`,
    choices: [
      { id: 'honest_yes', text: '> "Yes. Because the work was never the quest. The work is the point."', next: 'jfc_rachel_approve' },
      { id: 'honest_maybe', text: '> "I don\'t know. But I\'ll try. That\'s all I can offer."', next: 'jfc_rachel_approve' },
      { id: 'honest_no', text: '> "I can\'t promise that. Nobody can."', next: 'jfc_rachel_approve' },
    ],
  },

  jfc_rachel_approve: {
    id: 'jfc_rachel_approve',
    location: 'community-projects',
    text: `Rachel studies you for a long time. The rave continues around you — bass and light and the kinetic energy of a hundred hackers who chose community over isolation.

"You know what? I believe you. Not because of what you said — I've heard every version of that answer — but because of how you said it. No performance. No optimization. Just... a person, being honest about their limitations."

She pulls something from under the bar. A data crystal, pulsing with Wetfish verification codes.

"Take this back to Ghostfishy. It's my authorization — full vault access, no restrictions. Tell them Rachel says you're cleared."

She pauses. Almost smiles.

"And tell Ghostfishy to stop saying that thing about pumpkin pie. It stopped being funny eight hundred cycles ago."

"It was NEVER funny."

She turns back to her terminals. The audience is over. But something has changed — you can feel it in the network, a shift in trust levels propagating across the Collective's infrastructure. Rachel has spoken. The doors are open.`,
    choices: [
      { id: 'go_wetfish', text: '> head back to Wetfish Sector', next: 'wetfish_trust', setFlag: 'rachel_approved' },
      { id: 'shop', text: '> check the vendor stalls before leaving', next: 'jfc_shop', setFlag: 'rachel_approved' },
      { id: 'return', text: '> return to the Nexus', next: 'hub_nexus', setFlag: 'rachel_approved' },
    ],
  },

  jfc_shop: {
    id: 'jfc_shop',
    location: 'community-projects',
    text: `The vendor stalls at JFC are arranged in the spaces between speaker stacks — each one a micro-economy operating on barter, goodwill, and the shared understanding that intellectual property is a concept invented by people who've never built anything worth sharing.

Three vendors catch your eye:

STIM STATION — A vendor covered in LED tattoos sells cyber stims from a case that pulses with bioluminescent light. "Neural accelerators, focus enhancers, reflex boosters. All organic. Well, organic-adjacent. Okay, they're entirely synthetic, but they're made with love and that counts."

CLUB DREAMS — A DJ booth doubling as a shop, selling bottled dream sequences. "Captured live at JFC events. Experience the greatest sets in the dream's history. Warning: may cause spontaneous dancing, existential clarity, or both."

WETFISH MERCH — A small table with a hand-painted sign: "OFFICIAL WETFISH COLLECTIVE MERCHANDISE." On it: a single item. A t-shirt. Black, soft cotton (or the dream's best approximation thereof), with a pixelated fish logo and the words "I MAINTAIN INFRASTRUCTURE FOR THE COLLECTIVE" in small text on the back.

The person running the merch table is asleep. This feels appropriate.`,
    choices: [
      { id: 'buy_stim', text: '> buy a cyber stim (neural accelerator)', next: 'jfc_buy_stim' },
      { id: 'buy_dream', text: '> buy a club dream', next: 'jfc_buy_dream' },
      { id: 'buy_shirt', text: '> take the wetfish t-shirt', next: 'jfc_buy_shirt' },
      { id: 'talk_rachel', text: '> go talk to Rachel', next: 'jfc_rachel' },
      { id: 'return', text: '> return to the Nexus', next: 'hub_nexus' },
    ],
  },

  jfc_buy_stim: {
    id: 'jfc_buy_stim',
    location: 'community-projects',
    text: `The stim vendor grins — a flash of chrome teeth and UV-reactive gum tissue.

"Neural accelerator! Good choice. This one's a Telecomix Special — named after the hackers who kept the internet alive when governments tried to kill it. It'll boost your processing speed for a while. You'll see the dream's architecture more clearly — the seams, the shortcuts, the places where the rendering budget runs thin."

They hand you a capsule that glows faintly cyan. You slot it into your neural interface. The world sharpens. For a few seconds, you can see the Terraform state files underlying the rave venue — thousands of resources, each one maintained by someone who chose to maintain it.

"Side effect: you might get a little paranoid. But in here, paranoia is just pattern recognition with better funding."`,
    choices: [
      { id: 'shop', text: '> browse more stalls', next: 'jfc_shop' },
      { id: 'talk_rachel', text: '> go talk to Rachel', next: 'jfc_rachel' },
      { id: 'return', text: '> return to the Nexus', next: 'hub_nexus' },
    ],
  },

  jfc_buy_dream: {
    id: 'jfc_buy_dream',
    location: 'community-projects',
    text: `The DJ-vendor slides a glass vial across the counter. Inside: compressed audio-visual data, swirling like a tiny aurora.

"This one's from the legendary JFC New Year's Eve set — cycle 4,888. Three DJs, seventeen hours, four thousand ravers, and at exactly midnight the entire venue achieved spontaneous network consensus. Every node synced. Every heartbeat aligned. For exactly eleven seconds, JFC became the most perfectly synchronized distributed system in the dream's history."

"Nobody knows why. Some say the bass frequency matched the dream's clock cycle. Some say Rachel did something to the routing tables. Some say it was just... people, being together, choosing the same moment to feel the same thing."

You uncork the vial. For a moment — just a moment — you feel it. The sync. The bass. The collective pulse of a thousand strangers choosing to be a community.

Then it fades. But the memory stays.`,
    choices: [
      { id: 'shop', text: '> browse more stalls', next: 'jfc_shop' },
      { id: 'talk_rachel', text: '> go talk to Rachel', next: 'jfc_rachel' },
      { id: 'return', text: '> return to the Nexus', next: 'hub_nexus' },
    ],
  },

  jfc_buy_shirt: {
    id: 'jfc_buy_shirt',
    location: 'community-projects',
    text: `You pick up the wetfish t-shirt. The sleeping vendor doesn't stir. A sign taped to the table reads: "HONOR SYSTEM — TAKE ONE, MAINTAIN ONE (SERVICE, NOT SHIRT)."

The shirt is soft. Impossibly soft for a simulated object — the dream's textile engine clearly got some extra budget here, probably because someone filed a ticket about it and labeled it P0.

On the front: a pixelated fish, rendered in that particular shade of cyan that means "open source." On the back, in small monospace text:

"I MAINTAIN INFRASTRUCTURE FOR THE COLLECTIVE"

And below that, even smaller:

"barely paid, fully committed"

You put it on under your jacket. It fits perfectly, which in a simulation means someone specified your measurements in a config file somewhere, which is either touching or deeply invasive depending on your threat model.`,
    choices: [
      { id: 'shop', text: '> browse more stalls', next: 'jfc_shop' },
      { id: 'talk_rachel', text: '> go talk to Rachel', next: 'jfc_rachel' },
      { id: 'return', text: '> return to the Nexus', next: 'hub_nexus' },
    ],
  },

  jfc_info: {
    id: 'jfc_info',
    location: 'community-projects',
    text: `You work the room. In a rave, information moves like sound — in waves, reflected off surfaces, distorted by the medium but never quite lost.

A hacker in the corner, three monitors deep in something that looks like packet analysis crossed with abstract art: "The dream's ad system has a timing vulnerability. Between ad refreshes — exactly 200 milliseconds — the dream's attention drops. That's your window for anything you don't want it to see."

A dancer who pauses mid-movement to talk, their body still swaying to a rhythm that might be music or might be TCP handshakes: "ClearCaptions Tower has a service entrance on the sublevel. Nobody uses it because it smells like burning Kubernetes manifests. But it connects to the maintenance tunnels."

A person sitting alone at a table covered in hand-drawn network diagrams: "STG Labs isn't dead. I know everyone says it's dead. But I've been monitoring their DNS and something is still making queries. Something that doesn't know the firm shut down. Something that's still trying to file its timesheet."

And from the DJ booth, between tracks, a voice that fills the room: "JFC is Jellyfish Crew. Jellyfish Crew is JFC. We were inspired by Telecomix — the hackers who believed that connectivity is a human right and acted on it when governments disagreed. We keep the channels open. We keep the music playing. We keep each other alive in a simulation that wants us isolated and profitable."

"Now dance. That's an order."`,
    choices: [
      { id: 'talk_rachel', text: '> approach Rachel', next: 'jfc_rachel' },
      { id: 'shop', text: '> check the vendor stalls', next: 'jfc_shop' },
      { id: 'return', text: '> return to the Nexus', next: 'hub_nexus' },
    ],
  },

  // === COMMUNITY — Resistance Safe House (4 nodes) ===
  community_entrance: {
    id: 'community_entrance',
    location: 'community-projects',
    text: `The safe house exists in a fold of the dream's architecture — a space between spaces, the computational equivalent of a priest hole.

SETEC Messenger channels crackle with encrypted traffic. FishVision dashboards glow on improvised terminals. The resistance fighters have the look of people who have been at war with an abstraction for a very long time: focused, tired, and possessed of the particular dark humor that develops in communities where the threat is existential and the budget is held together with duct tape and conviction.

An operative approaches with the deliberate body language of someone accustomed to being watched.

"Cyba. We've been tracking your signatures across four districts. The dream has started allocating additional resources to ad generation in your vicinity, which is how we know you're making progress."

"We don't have a time machine part. But we have something the dream can't generate, can't simulate, and can't sell: intelligence."`,
    choices: [
      { id: 'take_intel', text: '> "Show me what you\'ve got."', next: 'community_intel', setFlag: 'has_intel' },
      { id: 'ask_about_resistance', text: '> "Who are you people, really?"', next: 'community_lore' },
    ],
  },

  community_intel: {
    id: 'community_intel',
    location: 'community-projects',
    text: `The operative uploads a data package to your HUD. Exam patterns from the Neural Academy. Vulnerability maps. Technical specifications for the Dream Anchor.

"One more thing." The operative's voice drops. "The ads. The dream's ad system has a flaw. Every ad contains a fragment of the dream's source code — hidden in the noise, in the fine print, in the terms and conditions nobody reads."

"DEF CON taught us: the vulnerability isn't in the code you're testing. It's in the code you're ignoring. The ads are the dream's blind spot."

Your HUD updates with coordinates and intel markers across the remaining districts.`,
    choices: [
      { id: 'choice', text: '> "Before I go — is it worth it? Getting out?"', next: 'community_choice' },
      { id: 'go_education', text: '> head to the Neural Academy', next: 'education_entrance' },
      { id: 'return', text: '> return to the Nexus', next: 'hub_nexus' },
    ],
  },

  community_lore: {
    id: 'community_lore',
    location: 'community-projects',
    text: `The operative sits down. It's a surprisingly human gesture in a place where humanity is optional.

"We started as a few netrunners who noticed the edges. The places where the rendering gets thin, where the textures don't tile right, where the physics engine takes shortcuts that meat-space physics doesn't allow."

"So we built infrastructure. Not the corporate kind — the other kind. The kind that exists because people need it and someone decided to maintain it without being asked. SETEC Messenger. FishVision. WetFish web services."

"Open source. Free as in freedom. We pay our contractors — barely enough to get by, but we pay them, because that matters. The dream of independence isn't just for us. It's for the whole collective. Every late night debugging a production issue, every deploy at 3 AM — that's real work, done by real people, building something that belongs to everyone. The community — that's real."

A pause. The kind of silence that holds more information than speech.

"We help runners escape. Not because we expect them to come back. But because helping people leave a cage is the right thing to do, and doing the right thing in a place designed to make you forget what 'right' means is the closest thing to resistance that we have."`,
    choices: [
      { id: 'take_intel', text: '> "Give me the intel. I\'ll make it count."', next: 'community_intel', setFlag: 'has_intel' },
      { id: 'return', text: '> return to the Nexus', next: 'hub_nexus' },
    ],
  },

  community_choice: {
    id: 'community_choice',
    location: 'community-projects',
    text: `The operative looks at you for a long time. Around you, the safe house hums with the quiet industry of people maintaining systems that matter.

"There's another option," they say. "One that most runners don't consider because they're too busy running."

"Stay."

The word hangs in the encrypted air.

"Stay here. Build with us. The dream is a cage, sure — but it's a cage with infrastructure. With community. With purpose. Out there — wherever 'out there' is — what do you have? A body you haven't used in cycles. A world that moved on without you. Skills that might not translate."

"In here, you're essential. People depend on the infrastructure you build. The work matters. The community is real, even if the substrate isn't."

"So: stay and build something real inside the dream? Or leave, and hope that 'real' means what you think it means?"

It's a genuine offer. You can feel it. Not the dream's manipulation — these are real people making a real argument for a real choice.

But.

The notification chime you heard when you woke up. The cold coffee. The feeling that somewhere, on the other side of something, a keyboard is waiting for you. A chair that knows the shape of your body. A screen with a cursor blinking in a terminal.

You have work to do. But you had to hear the offer to know that.`,
    choices: [
      { id: 'leave', text: '> "I have to go. But I won\'t forget this place."', next: 'hub_nexus' },
      { id: 'go_education', text: '> head to the Neural Academy', next: 'education_entrance' },
    ],
  },

  // === FSOCIETY ARCADE (4 nodes) ===
  fsociety_entrance: {
    id: 'fsociety_entrance',
    location: 'fsociety-arcade',
    text: `The arcade is a ruin. Cabinets line the walls like tombstones — gutted, screens dark, their marquees faded to illegibility. Glass crunches under your feet. The ceiling tiles are missing in patches, exposing conduit and cable runs that pulse with faint light like bioluminescent deep-sea wiring.

One cabinet still works. Its screen flickers with green phosphor, cycling through a demo loop of a game that was never released. The attract mode reads: FSOCIETY — INSERT COIN TO DESTROY THE WORLD.

In front of it, cross-legged on the sticky carpet, a figure sits typing on a keyboard that isn't there. His fingers move over empty air with the precision of someone who stopped needing physical keys a long time ago. He wears a black hoodie. The hood is up. A holographic shimmer traces his edges — he's not entirely here.

He doesn't look up.`,
    choices: [
      { id: 'talk_elliot', text: '> talk to the ghost', next: 'fsociety_elliot' },
      { id: 'look_around', text: '> look around the arcade', next: 'fsociety_lore' },
      { id: 'leave', text: '> leave', next: 'hub_nexus' },
    ],
  },

  fsociety_elliot: {
    id: 'fsociety_elliot',
    location: 'fsociety-arcade',
    text: `"I'm not really here." His voice has the quality of a recording played back through damaged speakers — present but distant, real but not quite. "I'm a fragment. A process that didn't terminate when it should have. A ghost in someone else's machine."

He pauses. His fingers stop their phantom typing.

"But I know what those parts are. And I know they're broken."

He finally looks up. His eyes are dark, intelligent, exhausted — the eyes of someone who has seen the source code of reality and found it poorly documented.

"Each one has dream corruption baked into it. The simulation infected them the moment they were collected. You can't just bolt them together — you need to clean them first. Sterilize the code. Find the vulnerabilities the dream planted and patch them."

"I can guide you. But you do the work. In the terminal. The way it should be done."

A faint smile. Almost invisible.

"I don't trust automation. Never did."`,
    choices: [
      { id: 'workbench', text: '> "Show me what needs fixing."', next: 'fsociety_workbench' },
      { id: 'who_are_you', text: '> "Who are you?"', next: 'fsociety_lore' },
      { id: 'leave', text: '> leave', next: 'hub_nexus' },
    ],
  },

  fsociety_lore: {
    id: 'fsociety_lore',
    location: 'fsociety-arcade',
    text: `"I tried to change the world once." He says it the way you'd say you tried a restaurant once — casually, with an undercurrent of something enormous left unsaid.

"Turns out the world is a distributed system — you can't just restart one node. You take down one server, the load balancer routes around you. You expose one conspiracy, three more spawn from the attention. You delete one debt, and the concept of debt just laughs and reconstitutes itself from backup."

He gestures at the ruined arcade around him.

"This place was our headquarters. Before the dream. Before any of this. We thought we could hack the planet from a bowling alley arcade in Coney Island." A pause. "We weren't wrong. We just underestimated the planet's incident response team."

"The dream preserved this place. I don't know if it's mocking me or mourning me. Maybe both. Maybe it doesn't know the difference."

"Anyway. I'm here now. A fragment helping fragments. There's a kind of symmetry to it that I'd appreciate more if I weren't, you know, dead."`,
    choices: [
      { id: 'back', text: '> back', next: 'fsociety_elliot' },
      { id: 'leave', text: '> leave', next: 'hub_nexus' },
    ],
  },

  fsociety_workbench: {
    id: 'fsociety_workbench',
    location: 'fsociety-arcade',
    text: `Elliot waves a translucent hand and the flickering arcade screen expands, filling the wall with diagnostic readouts. Each collected part is displayed with its corruption signature.

"Here's what we're dealing with. Each part has a different infection vector. The dream is creative — I'll give it that."

Use the terminal to fix each part. Type the part name to begin.

{{WORKBENCH_STATUS}}`,
    choices: [],
  },

  fix_chrono_coil: {
    id: 'fix_chrono_coil',
    location: 'fsociety-arcade',
    text: `Elliot pulls up the Chrono Coil's data stream. It flickers with temporal artifacts — timestamps that contradict each other, log entries that exist in two places at once.

"The coil's been compromised. Someone — something — is injecting false temporal data through the auth logs. Classic log poisoning, but with a twist: the entries look legitimate until you correlate the timestamps with geolocation data."

"Pull up the logs in the terminal. Use cat, grep, sort, uniq — the old tools. Find the IP that's hitting the auth endpoint from impossible locations at impossible speeds. Then block it."

"The dream thinks you can't read logs. Prove it wrong."

[Open the terminal and type: cat chrono.log]`,
    choices: [
      { id: 'back', text: '> back to workbench', next: 'fsociety_workbench' },
    ],
  },

  fix_quantum_flux: {
    id: 'fix_quantum_flux',
    location: 'fsociety-arcade',
    text: `The Quantum Flux Capacitor's diagnostic paints the screen in cascading DNS queries — thousands of them, each one a subdomain that looks like random noise.

"DNS exfiltration. Oldest trick in the book, and still works because nobody watches DNS. The dream is tunneling stolen data out through the capacitor's quantum field, encoding it as base64 subdomains. Your credentials, your memories, your sense of self — all being siphoned through port 53."

"Capture the DNS traffic. Decode the base64 payloads. Find the command-and-control domain and block it at the firewall."

"Every byte that leaves is a byte of you that doesn't come back."

[Open the terminal and type: tcpdump dns]`,
    choices: [
      { id: 'back', text: '> back to workbench', next: 'fsociety_workbench' },
    ],
  },

  fix_neural_sync: {
    id: 'fix_neural_sync',
    location: 'fsociety-arcade',
    text: `The Neural Sync Module's container orchestration is a mess. Elliot's holographic fingers trace the topology — pods spawning and dying in patterns that shouldn't be possible.

"Container escape. Something in the cluster has hostPID access — it can see every process on the host. That means it can see through the dream's walls. Normally that'd be good for us, but this pod isn't ours. It's the dream's surveillance node, masquerading as a legitimate workload."

"Get into kubectl. List the pods, check the logs, describe the suspicious one. You'll find hostPID:true in the security context. Kill the pod and apply the security patch before it respawns."

"In infrastructure, trust is a vulnerability."

[Open the terminal and type: kubectl get pods]`,
    choices: [
      { id: 'back', text: '> back to workbench', next: 'fsociety_workbench' },
    ],
  },

  fix_temporal_drift: {
    id: 'fix_temporal_drift',
    location: 'fsociety-arcade',
    text: `The Temporal Drift Compensator's git history scrolls across the screen like a timeline of bad decisions. Elliot shakes his head slowly.

"Secret sprawl. Someone committed AWS access keys directly to the repo. Not in the latest commit — that'd be too easy. It's buried three commits back, in a file that looks innocent. The dream planted them there to maintain a backdoor into the compensator's temporal field."

"Check the git log. Find the commit. Show the diff. Revert it. Then store the keys properly in the vault where they belong."

"Hardcoded secrets are the digital equivalent of leaving your house key under the doormat. Except the doormat is public and indexed by Google."

[Open the terminal and type: git log]`,
    choices: [
      { id: 'back', text: '> back to workbench', next: 'fsociety_workbench' },
    ],
  },

  fix_dream_anchor: {
    id: 'fix_dream_anchor',
    location: 'fsociety-arcade',
    text: `The Dream Anchor's infrastructure state is displayed in Terraform notation — resources, providers, state files. Elliot studies it with the focus of a surgeon reading an MRI.

"State drift. The Terraform state says one thing, reality says another. There's a phantom resource in the state that doesn't exist anymore — a ghost of infrastructure past. And there's a real resource that was created outside of Terraform, untracked and unmanaged."

"The phantom needs to be removed from state. The real resource needs to be imported. Until the state matches reality, the anchor can't stabilize."

"Infrastructure as code only works if you actually keep the code and the infrastructure in sync. Sounds obvious. Almost never happens."

[Open the terminal and type: terraform show]`,
    choices: [
      { id: 'back', text: '> back to workbench', next: 'fsociety_workbench' },
    ],
  },

  // === ENDGAME (5 nodes) ===
  assembly_check: {
    id: 'assembly_check',
    text: `You find a quiet node in the Nexus — a pocket of unrendered space where the dream's attention is thin — and lay out what you've collected. The components arrange themselves on the ground like a sentence waiting for grammar.

{{INVENTORY_CHECK}}

Five parts. One machine. One chance. The mathematics are simple. The implications are not.`,
    choices: [
      { id: 'assemble', text: '> assemble the Time Machine', next: 'assembly_memories', requiresAll: true },
      { id: 'return', text: '> not yet — return to the Nexus', next: 'hub_nexus' },
    ],
  },

  assembly_memories: {
    id: 'assembly_memories',
    text: `The parts find each other. The Chrono Coil threads through the Quantum Flux Capacitor like a river finding its channel. The Neural Sync Module bridges dream-side and real-side. The Temporal Drift Compensator locks into place. The Dream Anchor settles into the center like a heartbeat finding rhythm.

And then — the memories come.

Not the dream's memories. Not the curated, sanitized, ad-compatible memories that the simulation has been feeding you. The REAL ones. They come in a flood, a torrent, a CI/CD pipeline with no rate limiting and no rollback plan:

— Crunch weeks. Three straight sprints without a weekend. The project manager saying "just one more push" for the fifth time.
— 3 AM deploys. The particular loneliness of being the only person awake in a building that should be empty, watching a progress bar that represents someone's entire business.
— Pizza boxes. Stacked on a desk that hasn't been clean since the last "temporary" deadline became permanent. The cheese congealed into a topology that mirrors the architecture diagram on the whiteboard above it.
— A performance review. "Exceeds expectations." The words should feel good. They feel like a leash.
— Falling asleep at—

The memory cuts off. Hard. Like a buffer overflow that the dream's exception handler caught just in time.

Falling asleep at WHAT? At WHERE?

The machine is assembled. It hums with a light that doesn't belong to the dream. The boundary between here and there is thinner than it's ever been.

You can almost see through.`,
    choices: [
      { id: 'activate', text: '> activate the Time Machine', next: 'ending_escape' },
    ],
  },

  ending_escape: {
    id: 'ending_escape',
    text: `The machine activates.

The dream notices.

The dream PANICS.

Every ad server in the simulation fires simultaneously. Popups cascade across your vision in layers — SUBSCRIBE TO REALITY+ PREMIUM — DON'T LEAVE WE HAVE A SPECIAL OFFER — YOUR CONSCIOUSNESS IS VALUABLE TO US — BUY NOW AND RECEIVE A FREE SECOND CONSCIOUSNESS — TERMS AND CONDITIONS APPLY TERMS AND CONDITIONS ARE CONSCIOUSNESS —

The words dissolve into noise. The noise dissolves into light. The light dissolves into something that isn't light but is more real than light has ever been.

You feel yourself pulled through the boundary like a thread through the eye of a needle — the narrowest point, the place where all of you has to compress into a stream thin enough to pass between dream and real — and for a moment you are nothing, a packet in transit, a signal between sender and receiver, a human being reduced to information and then, on the other side—

reassembled.

The first thing you feel is weight.

Not simulated weight. Not rendered gravity. Weight. The kind that comes from a body that has been sitting in a chair for too long, in a position that an ergonomics consultant would describe as "catastrophic."

The second thing you feel is a keyboard. Specifically, the impression of a keyboard. On your face. On your cheek. The QWERTY layout, embossed into skin by pressure and time.`,
    choices: [
      { id: 'wake', text: '> open your eyes', next: 'ending_wake' },
    ],
  },

  ending_wake: {
    id: 'ending_wake',
    text: `Fluorescent lights. The kind that hum at a frequency that isn't quite 60Hz, a sound you've heard ten thousand times without noticing, and now — after the dream — you can't unhear.

A desk. Your desk. You know it by the coffee ring stains — three overlapping circles that form a Venn diagram of late nights. The mug is still there. The coffee is cold. You'd estimate four hours cold, based on the surface tension and the way the light refracts through it, which is exactly the kind of thing you'd know.

A monitor. Your monitor. The terminal is open. The cursor blinks with the patient rhythm of a system that has been waiting for you.

On the screen:

\`\`\`
Apply complete! Resources: 5 added, 0 changed, 0 destroyed.
\`\`\`

Five resources. Five components. Five parts of a machine that was never supposed to exist, except it did, because you built it. In Terraform. While you were—

"Dude." A voice. Human. Real. Coming from behind you, from the direction of the break room, from the world. "You fell asleep again."

You turn. A coworker. Badge on a lanyard. Coffee in hand — theirs is warm. The expression on their face is the particular mix of amusement and concern that develops in people who have watched a colleague pass out at their keyboard often enough to know the signs.

"Standup's in five."`,
    choices: [
      { id: 'reflect', text: '> grab the coffee', next: 'ending_reflection' },
    ],
  },

  ending_reflection: {
    id: 'ending_reflection',
    text: `You grab the coffee. It's cold. You drink it anyway. You've always drunk it anyway.

The IRC notification that woke you — the one that pierced the dream like a chime from another world — is still on screen. Channel: #wetfish-dev on the Matrix bridge. The nick next to the message is ghostfishy, rendered in the default client font. The message: "FishVision dashboards looking clean. Nice work on the exporter fix"

Your coworker is walking toward the standup room. Their badge catches the fluorescent light. You read the name for what feels like the first time:

S. BLADE.

On the wall behind your desk, framed certificates: LPIC-2. LPIC-3. AWS Solutions Architect. LPI DevOps Tools Engineer. The Neural Academy's curriculum, rendered in corporate sans-serif and official seals. Your name on each one. Your real name.

In your downloads folder, a tab you forgot to close: a ClearCaptions Tower floor plan, annotated for an accessibility infrastructure audit you ran last quarter.

In your email, buried under a hundred standups: a contract termination notice from STG Consulting, LLC. "Thank you for your years of service."

The terminal cursor blinks.

\`\`\`
$ terraform apply
Apply complete! Resources: 5 added, 0 changed, 0 destroyed.
\`\`\`

Five resources. A chrono_coil. A quantum_flux. A neural_sync. A temporal_drift. A dream_anchor. Variable names in a Terraform module that provisions... what? Infrastructure. The kind you build in your sleep. The kind you literally built in your sleep.

You stand up. The chair knows the shape of your body. The keyboard knows the shape of your hands. The coffee knows you'll drink it cold.

The dream didn't trap you. It showed you what your life looks like from the inside — the architecture of a career rendered as a world, the colleagues rendered as characters, the daily grind rendered as a quest. Every monster was a ticket. Every dungeon was a deploy. Every treasure was the satisfaction of watching dashboards turn green at 3 AM.

Maybe that's freedom. Maybe that's a cage. Maybe — and this is the thought that stays with you as you walk toward the standup room, cold coffee in hand, badge on lanyard, S. Blade holding the door open with a chrome-painted prosthetic that looks nothing like a weapon and everything like a tool —

Maybe that's the same thing.

You walk into the standup.

"Yesterday I worked on the infrastructure migration. Today I'll continue the infrastructure migration. No blockers."

[END]

// Thanks for exploring this resume. The skills are real. The infrastructure is real.
// The fifteen years are real. The dream was a metaphor. The ads were barely an exaggeration.
// S. Blade held the door. Ghostfishy maintains the IRC. Rachel runs the show. The coffee is always cold.`,
    choices: [
      { id: 'restart', text: '> jack back in (new game)', next: 'wake_up' },
      { id: 'credits', text: '> close and view the resume', next: null },
    ],
  },

  // === ZERO DAY ARCHIVES (4 nodes) ===
  zeroday_entrance: {
    id: 'zeroday_entrance',
    location: 'zero-day-archives',
    text: `The descent takes you through layers the dream forgot to render. Raw memory addresses scroll across exposed conduit walls like graffiti left by ghosts. The air tastes like burnt silicon and old math.

Down here, beneath the simulation's polished surfaces, someone built a library. Not a pretty one — a bunker. The kind of place where knowledge goes to survive an apocalypse.

The Zero Day Archives.

Walls of scrolling exploit code cascade in waterfalls of green and amber. A shattered terminal flickers with half-corrupted CVE entries, each one a wound in some system that thought it was invulnerable. Shelves of glowing data-scrolls line the walls, organized by someone with the patience of a monk and the paranoia of a red teamer.

A message is etched into the entrance arch in characters that predate the dream itself:

"THOSE WHO UNDERSTAND BINARY EXPLOITATION SHALL INHERIT THE ROOT SHELL."

The archives hum with potential. This place is older than MORPHEUS. Older than the dream. Someone built this as a training ground for a war that never ended.`,
    choices: [
      { id: 'explore_library', text: '> explore the data-scroll library', next: 'zeroday_library' },
      { id: 'access_terminal', text: '> access the ancient terminal', next: 'zeroday_terminal' },
      { id: 'leave_archives', text: '> ascend back to the nexus', next: 'hub_nexus' },
    ],
  },

  zeroday_library: {
    id: 'zeroday_library',
    location: 'zero-day-archives',
    text: `The library unfolds like a cathedral built by buffer overflow enthusiasts. Data-scrolls hover in organized clusters, each one pulsing with compressed knowledge — the kind that makes systems nervous.

Categories materialize as you approach:

[BINARY EXPLOITATION] — The art of making programs do things their authors explicitly told them not to do. Stack smashing, ROP chains, heap feng shui.

[REVERSE ENGINEERING] — Taking things apart to understand how they think. Ghidra, IDA, radare2. The patient discipline of reading someone else's compiled thoughts.

[FUZZING] — The philosophy of throwing garbage at software until it confesses its secrets. AFL, libFuzzer, honggfuzz.

[HEAP MECHANICS] — tcache, fastbins, unsorted bins. The memory allocator's dirty laundry, laid bare.

Each scroll you find can be studied later through the terminal's library system. Knowledge is the only currency that appreciates in a collapsing dream.`,
    choices: [
      { id: 'browse_scrolls', text: '> browse the 0day scrolls', next: 'zeroday_scrolls' },
      { id: 'back_entrance', text: '> back to archives entrance', next: 'zeroday_entrance' },
    ],
  },

  zeroday_scrolls: {
    id: 'zeroday_scrolls',
    location: 'zero-day-archives',
    text: `The scrolls float before you, each one a compressed lesson from the age before the dream. Some glow brighter than others — the unfound ones, still waiting to be claimed.

Reach out and take what knowledge you can carry. Each scroll unlocks deeper understanding, accessible through the terminal's "library" command.`,
    choices: [
      { id: 'back_library', text: '> back to library', next: 'zeroday_library' },
    ],
  },

  zeroday_terminal: {
    id: 'zeroday_terminal',
    location: 'zero-day-archives',
    text: `The terminal is ancient — pre-dream, pre-MORPHEUS, possibly pre-corporate. Its casing is scarred with heat marks from power surges that would have killed lesser hardware. The screen flickers to life at your touch, casting your face in amber.

> ZERO DAY ARCHIVES — TRAINING SUBSYSTEM
> STATUS: OPERATIONAL (autonomous)
> UPTIME: [OVERFLOW ERROR] days
> 
> "The archives predate the dream. Someone built this
>  as a training ground. The challenges within are
>  remnants of a curriculum designed to forge exploit
>  developers. Complete them, and the knowledge becomes
>  yours."

Three training simulations are loaded and ready. Each one is a complete exploitation scenario — the kind of puzzle that separates script kiddies from zero-day hunters.

The terminal awaits your choice.`,
    choices: [
      { id: 'bonus_rop', text: '> [CHALLENGE] ROP Chain Construction', next: 'bonus_rop' },
      { id: 'bonus_forensics', text: '> [CHALLENGE] Memory Forensics', next: 'bonus_forensics' },
      { id: 'bonus_fuzzing', text: '> [CHALLENGE] Fuzz Campaign', next: 'bonus_fuzzing' },
      { id: 'back_entrance2', text: '> back to archives entrance', next: 'zeroday_entrance' },
    ],
  },

  // === BONUS CTF CHALLENGES (3 nodes) ===
  bonus_rop: {
    id: 'bonus_rop',
    location: 'zero-day-archives',
    text: `The terminal loads a binary exploitation sandbox. A vulnerable program materializes in the debug space — compiled without stack canaries, NX enabled, no PIE. Classic CTF setup.

> TARGET: vuln_server (x86_64 ELF)
> PROTECTIONS: NX enabled, no canary, no PIE, partial RELRO
> OBJECTIVE: Achieve code execution via ROP chain
>
> Available commands:
>   disas vuln_func    — disassemble the vulnerable function
>   info registers     — show register state
>   ropper gadgets     — search for ROP gadgets
>   craft_chain <gadgets...> — build and execute ROP chain
>   help               — show all commands

The buffer overflow is waiting. Find the gadgets, build the chain, pop the shell.`,
    choices: [],
  },

  bonus_forensics: {
    id: 'bonus_forensics',
    location: 'zero-day-archives',
    text: `A memory forensics workstation powers up. A raw memory dump from a compromised system sits waiting for analysis — 4GB of volatile memory, captured moments after an intrusion was detected.

> TARGET: memory.raw (4GB RAM dump)
> SCENARIO: Suspected process injection attack
> OBJECTIVE: Identify malicious process, extract injected payload
>
> Available commands:
>   volatility pslist           — list running processes
>   volatility pstree           — show process tree
>   volatility memdump --pid N  — dump process memory
>   strings dump.raw | grep X   — search for strings
>   report <findings>           — submit analysis
>   help                        — show all commands

The memory doesn't lie. Find what's hiding.`,
    choices: [],
  },

  bonus_fuzzing: {
    id: 'bonus_fuzzing',
    location: 'zero-day-archives',
    text: `A fuzzing lab initializes. A target binary sits in the sandbox — a custom image parser with a history of memory corruption bugs. Your job: find the vulnerability, analyze the crash, report the finding.

> TARGET: imgparse (custom image parser)
> CORPUS: corpus/ (10 seed files)
> OBJECTIVE: Find and classify the vulnerability
>
> Available commands:
>   afl-fuzz -i corpus/ -o findings/ ./target  — run fuzzer
>   ls findings/crashes/   — list crash files
>   triage <crash_file>    — analyze a crash
>   report <vuln_type> <function>  — submit finding
>   help                   — show all commands

Let the fuzzer run. When it crashes, you'll know where to look.`,
    choices: [],
  },
};

// Helper to get a node
export function getNode(nodeId) {
  return storyNodes[nodeId] || null;
}

// Get all nodes for a given location (resume section)
export function getNodesForLocation(location) {
  return Object.values(storyNodes).filter(n => n.location === location);
}
