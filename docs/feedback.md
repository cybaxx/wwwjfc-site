# Site Feedback

## What's Great

- **The boot sequence** is a fun touch — a fake Linux kernel boot with Cyberpunk 2077 references (Militech, Braindance, Kiroshi Optics, Netrunner). Sets the vibe immediately.
- **Easter eggs** — Konami code, a hidden terminal with commands, text scramble effects. Shows personality.
- **Tech choices** — Svelte 3 + Three.js + Rollup is lean and performant for a portfolio site. No unnecessary bloat.
- **Good meta tags** — OG and Twitter cards are set up properly.

## Things to Consider Improving

- **Svelte 3 is outdated** — Svelte 5 has been out for a while. Not urgent for a portfolio, but worth noting.
- **`.bak` files in src/** — `App.svelte.bak`, `ThreeScene.svelte.bak`, and `ThreeScene.original.svelte` are sitting in the source tree. These should be gitignored or removed.
- **Boot sequence length** — ~180 lines of boot text is a lot. Users might bounce before seeing actual content. Consider shortening it or adding a "skip" button.
- **The file is huge** — App.svelte is 26k+ tokens, which suggests most of the app lives in one monolithic component. The `components/` directory has the right idea (about, contact, education, etc.) but the main file could likely be broken up further.
- **`chroma_db` directory** at the project root seems out of place for a portfolio site — leftover from an AI/embedding experiment?

## Summary

Overall it's got strong aesthetic identity. The cyberpunk theme is committed and well-executed. The main practical concern is the boot sequence potentially hurting engagement — people visiting a portfolio want to see your work quickly.
