// items.js

export const items = [
  // Weapons
  {
    name: 'Rusty Sword',
    value: 10,
    chance: 0.8, // 80% chance
    emoji: '⚔️',
    category: 'weapon',
    description: 'An old rusty sword, barely usable'
  },
  {
    name: 'Diamond Sword',
    value: 5000,
    chance: 0.01,
    emoji: '🗡️',
    category: 'weapon',
    description: 'A powerful sword made of pure diamond'
  },
  // Tools
  {
    name: 'Fishing Rod',
    value: 500,
    chance: 0.3,
    emoji: '🎣',
    category: 'tool',
    description: 'Increases fish catch rate by 25%'
  },
  {
    name: 'Hunting Rifle',
    value: 1000,
    chance: 0.2,
    emoji: '🔫',
    category: 'tool',
    description: 'Increases hunting success rate by 30%'
  },
  // Luck Items
  {
    name: 'Lucky Charm',
    value: 2000,
    chance: 0.1,
    emoji: '🍀',
    category: 'luck',
    description: 'Increases gambling win rate by 20%'
  },
  {
    name: 'Golden Horseshoe',
    value: 3000,
    chance: 0.05,
    emoji: '🐎',
    category: 'luck',
    description: 'Increases all luck-based activities by 15%'
  },
  // Rare Items
  {
    name: 'Ancient Artifact',
    value: 10000,
    chance: 0.001,
    emoji: '🏺',
    category: 'rare',
    description: 'A mysterious artifact of immense value'
  },
  {
    name: 'Gold Coin',
    value: 50,
    chance: 0.3, // 30% chance
    emoji: '💰',
    category: 'misc',
    description: 'A shiny gold coin'
  },
  {
    name: 'Wooden Stick',
    value: 1,
    chance: 0.95, // 95% chance
    emoji: '🥖',
    category: 'misc',
    description: 'Just a regular stick'
  },
  {
    name: 'Old Boot',
    value: 5,
    chance: 0.6, // 60% chance
    emoji: '👢',
    category: 'misc',
    description: 'A worn-out boot'
  },
  // Hunting Equipment
  {
    name: 'Basic Hunting Rifle',
    value: 1000,
    emoji: '🔫',
    category: 'equipment',
    type: 'huntingRifle',
    tier: 1,
    description: 'Required for hunting. 30% success rate',
    stats: {
      successRate: 0.3,
      exoticChance: 0.01
    }
  },
  {
    name: 'Advanced Hunting Rifle',
    value: 5000,
    emoji: '🎯',
    category: 'equipment',
    type: 'huntingRifle',
    tier: 2,
    description: 'Better hunting rifle. 45% success rate, 5% exotic chance',
    stats: {
      successRate: 0.45,
      exoticChance: 0.05
    },
    upgrade: {
      from: 'Basic Hunting Rifle',
      cost: 3000
    }
  },
  {
    name: 'Exotic Hunting Rifle',
    value: 15000,
    emoji: '✨',
    category: 'equipment',
    type: 'huntingRifle',
    tier: 3,
    description: 'Top-tier hunting rifle. 60% success rate, 15% exotic chance',
    stats: {
      successRate: 0.6,
      exoticChance: 0.15
    },
    upgrade: {
      from: 'Advanced Hunting Rifle',
      cost: 10000
    }
  },
  // Fishing Equipment
  {
    name: 'Basic Fishing Rod',
    value: 500,
    emoji: '🎣',
    category: 'equipment',
    type: 'fishingRod',
    tier: 1,
    description: 'Required for fishing. 25% catch rate',
    stats: {
      catchRate: 0.25,
      exoticChance: 0.01
    }
  },
  {
    name: 'Advanced Fishing Rod',
    value: 2500,
    emoji: '🎣',
    category: 'equipment',
    type: 'fishingRod',
    tier: 2,
    description: 'Better fishing rod. 40% catch rate, 5% exotic chance',
    stats: {
      catchRate: 0.4,
      exoticChance: 0.05
    },
    upgrade: {
      from: 'Basic Fishing Rod',
      cost: 1500
    }
  },
  {
    name: 'Exotic Fishing Rod',
    value: 7500,
    emoji: '✨',
    category: 'equipment',
    type: 'fishingRod',
    tier: 3,
    description: 'Top-tier fishing rod. 55% catch rate, 15% exotic chance',
    stats: {
      catchRate: 0.55,
      exoticChance: 0.15
    },
    upgrade: {
      from: 'Advanced Fishing Rod',
      cost: 5000
    }
  },
  // Hunting Drops
  {
    name: 'Rabbit Pelt',
    value: 30,
    emoji: '🐰',
    category: 'material',
    description: 'A common hunting material',
    rarity: 'common'
  },
  {
    name: 'Deer Hide',
    value: 75,
    emoji: '🦌',
    category: 'material',
    description: 'A decent quality hide',
    rarity: 'uncommon'
  },
  {
    name: 'Bear Fur',
    value: 150,
    emoji: '🐻',
    category: 'material',
    description: 'A valuable hunting material',
    rarity: 'rare'
  },
  {
    name: 'Golden Bear Pelt',
    value: 5000,
    emoji: '✨',
    category: 'material',
    description: 'An extremely rare exotic pelt',
    rarity: 'exotic'
  },
  // Fishing Drops
  {
    name: 'Common Fish',
    value: 25,
    emoji: '🐟',
    category: 'material',
    description: 'A common fish',
    rarity: 'common'
  },
  {
    name: 'Tropical Fish',
    value: 60,
    emoji: '🐠',
    category: 'material',
    description: 'An uncommon colorful fish',
    rarity: 'uncommon'
  },
  {
    name: 'Rare Fish',
    value: 125,
    emoji: '🎣',
    category: 'material',
    description: 'A rare species of fish',
    rarity: 'rare'
  },
  {
    name: 'Golden Fish',
    value: 4000,
    emoji: '✨',
    category: 'material',
    description: 'An extremely rare exotic fish',
    rarity: 'exotic'
  }
];

export const itemCategories = {
  weapon: '⚔️ Weapons',
  tool: '🔧 Tools',
  luck: '🍀 Luck Items',
  rare: '✨ Rare Items',
  equipment: '🔧 Equipment',
  material: '📦 Materials',
  misc: '📎 Miscellaneous'
};

export const rarityColors = {
  common: '#ffffff',
  uncommon: '#1eff00',
  rare: '#0070dd',
  exotic: '#a335ee'
};