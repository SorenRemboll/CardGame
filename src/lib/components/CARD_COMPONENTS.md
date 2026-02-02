# Card Component Architecture

This document explains the three-tier card component structure.

## Component Hierarchy

```
Card.svelte (Base Visual Component)
    ├── Card.display.svelte (Static Display Wrapper)
    └── Card.game.svelte (Interactive Game Wrapper)
```

## Components

### 1. `Card.svelte` - Base Visual Component
**Purpose:** Pure presentation layer for card visuals  
**Responsibility:** Renders the card UI with no logic  
**Props:**
- `card: Card` - Card data object
- `isEnemy?: boolean` - Enemy styling variant
- `variant?: 'default' | 'hover'` - Visual behavior variant
- `class?: string` - Additional CSS classes

**Features:**
- Card header with name
- Card body with description
- Footer with stats (Spirit cost, Type, Siege, Bastion)
- Enemy/player color theming
- Optional hover effects and glow

**Usage:**
```svelte
<Card {card} isEnemy={false} variant="hover" />
```

---

### 2. `Card.display.svelte` - Static Display Wrapper
**Purpose:** Wrapper for displaying cards in UI (deck builder, lists, etc.)  
**Responsibility:** Adds click handling and hover effects  
**Props:**
- `card: Card` - Card data object
- `onclick?: () => void` - Click handler function
- `isEnemy?: boolean` - Enemy styling variant

**Features:**
- Wraps base `Card.svelte`
- Adds click interactivity
- Hover lift and glow effects
- No drag/drop functionality

**Usage:**
```svelte
<CardDisplay {card} onclick={() => addToDeck(card)} />
```

**Use Cases:**
- Deck builder card selection
- Card collection/library views
- Inventory/shop displays
- Any static card display

---

### 3. `Card.game.svelte` - Interactive Game Wrapper
**Purpose:** Wrapper for battle/game card interactions  
**Responsibility:** Handles drag/drop, positioning, and game state  
**Props:**
- `card: Card` - Card data object
- `index: number` - Card index in hand
- `isEnemy?: boolean` - Enemy card flag
- `htmlClass?: string` - Additional CSS classes

**Features:**
- Wraps base `Card.svelte`
- Drag and drop functionality
- Dynamic positioning (dragging state)
- Board state integration
- Rotation and hover animations
- Mouse event handlers

**Usage:**
```svelte
<CardGame {card} {index} isEnemy={false} />
```

**Use Cases:**
- Battle/game hand cards
- Playable cards in combat
- Any interactive card gameplay

---

## Helper Components

### `DisplayCard.svelte`
Legacy wrapper that uses `Card.display.svelte` internally.  
Adds optional amount badge display.

**Props:**
- `card: Card`
- `onclick: () => void`
- `amount?: number` - Optional quantity badge

---

## Migration Guide

### Old Pattern:
```svelte
<Card {card} interactive={true} {index} {isEnemy} />  // Game
<Card {card} interactive={false} {onclick} />         // Display
```

### New Pattern:
```svelte
<CardGame {card} {index} {isEnemy} />    // Game
<CardDisplay {card} {onclick} />         // Display
```

---

## File Locations

```
src/lib/components/
├── Card.svelte           # Base visual component
├── Card.display.svelte   # Static display wrapper
├── Card.game.svelte      # Interactive game wrapper
└── DisplayCard.svelte    # Legacy helper (uses Card.display.svelte)
```

---

## Benefits of This Architecture

1. **Separation of Concerns**: Visual logic separated from interaction logic
2. **Reusability**: Base card can be used in multiple contexts
3. **Maintainability**: Changes to visuals update all card types
4. **Type Safety**: Each wrapper has specific, focused props
5. **Performance**: No unnecessary logic in static displays
6. **Clarity**: Component name indicates purpose (`.game` vs `.display`)
