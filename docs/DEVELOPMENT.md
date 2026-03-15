# Development Guide

## Quick Start

```bash
cd wwwjfc
npm install
npm run dev      # dev server at localhost:5173
npm run build    # production build to dist/
npm run preview  # preview production build
```

## Project Structure

```
wwwjfc-site/
├── docs/                # Documentation (you are here)
├── wwwjfc/              # Main application
│   ├── src/
│   │   ├── App.svelte           # Root component
│   │   ├── main.js              # Entry point
│   │   ├── lib/                 # Game engine + content
│   │   │   ├── gameState.svelte.js
│   │   │   ├── storyNodes.js
│   │   │   └── adContent.js
│   │   └── components/          # UI components
│   ├── public/                  # Static assets
│   ├── dist/                    # Build output
│   ├── index.html               # HTML shell
│   └── vite.config.js           # Vite config
```

## Key Patterns

### Svelte 5 Runes
The project uses Svelte 5's runes API exclusively:
- `$state()` for reactive state
- `$derived()` for computed values
- `$effect()` for side effects
- `$props()` for component props
- `$bindable()` for two-way bindings

### Game State
`gameState` is a singleton created with `createGameState()` and exported. All game state flows through this object. Components read from it reactively and call its methods to mutate.

### Story Nodes
All story content lives in `storyNodes.js` as a flat object. No nesting, no separate files per district. Every node is keyed by its ID. Navigation is just changing `currentNode` to a new key.

### Adding a New Node
```js
my_new_node: {
  id: 'my_new_node',
  location: 'resume-section',           // optional, highlights resume section
  text: `Your story text here...`,
  grantsItem: 'item_id',                // optional
  choices: [
    { id: 'choice1', text: '> displayed text', next: 'target_node_id' },
    { id: 'choice2', text: '> ...', next: 'other_node', setFlag: 'flag_name' },
  ],
},
```

### Adding a New District
1. Add nodes to `storyNodes.js`
2. Add entry choice to `hub_nexus`
3. Add shortcut to `StoryTerminal.svelte` destinations map
4. Update docs

### Adding New Ads
Add to the appropriate tier array in `adContent.js`:
```js
{
  id: 'unique_id',
  title: 'AD TITLE',
  tagline: 'TAGLINE',
  body: 'Ad copy...',
  price: '¥99.99',
  cta: 'BUTTON TEXT',
  lore: 'Hidden story fragment...',
  style: 'normal' | 'glitchy' | 'aggressive',
  // Tier 2+:
  fakeClose: true,
  // Tier 3:
  dodges: true,
  spawnsMore: true,
  countdown: 10,
}
```

### Adding Quiz Questions
Add to `quizQuestions` array in `adContent.js`:
```js
{
  q: 'Question text?',
  choices: ['A', 'B', 'C', 'D'],
  answer: 0,  // index of correct answer
}
```

### Adding Captcha Prompts
Add strings to `captchaPrompts` array in `adContent.js`.

## Verification

After modifying story nodes, verify:
1. `npm run build` succeeds
2. All `next:` values reference existing node IDs or `null`
3. `grantsItem` only uses the 5 valid part IDs
4. Play through modified paths to verify flow

## UI Windows

Both StoryOverlay and StoryTerminal use `DraggableWindow.svelte`. To create a new draggable window:

```svelte
<DraggableWindow
  title="WINDOW TITLE"
  bind:visible={myVisible}
  width="600px"
  maxHeight="75vh"
  zBase={500}
  borderColor="#00f0ff"
  titleIcon=">"
  initialX={100}   <!-- use -1 for centered -->
  initialY={100}
>
  <div>Your content here</div>
</DraggableWindow>
```
