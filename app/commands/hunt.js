import { player, savePlayerData, updatePlayerInfo } from '../script.js';
import { items } from '../utils/items.js';

const huntableAnimals = [
    { name: 'Rabbit', value: 50, chance: 0.4 },
    { name: 'Deer', value: 100, chance: 0.3 },
    { name: 'Bear', value: 200, chance: 0.2 },
    { name: 'Legendary Fox', value: 500, chance: 0.1 }
];

const huntResponses = {
    success: [
        "You successfully hunted a {animal}!",
        "After a long chase, you caught a {animal}!",
        "Your hunting skills paid off! You caught a {animal}!"
    ],
    fail: [
        "You couldn't find any animals...",
        "The animals were too quick for you today.",
        "Better luck next time!"
    ]
};

const huntCooldown = 30000; // 30 seconds

function executeHuntCommand() {
    // Check if player has a hunting rifle equipped
    if (!player.equipment.huntingRifle) {
        // Check if they have one in inventory
        const huntingRifles = items.filter(i => 
            i.type === 'huntingRifle' && 
            player.inventory[i.name] > 0
        );
        
        if (huntingRifles.length > 0) {
            return "You have a hunting rifle in your inventory! Use '/use Hunting Rifle' to equip it first.";
        }
        return "You need a hunting rifle to hunt! Buy one from the shop with `/shop`.";
    }

    const now = Date.now();
    if (player.lastHuntTime && now - player.lastHuntTime < huntCooldown) {
        const remainingTime = Math.ceil((huntCooldown - (now - player.lastHuntTime)) / 1000);
        return `You need to wait ${remainingTime}s before hunting again.`;
    }

    const rifle = items.find(i => i.name === player.equipment.huntingRifle);
    const successRate = rifle.stats.successRate;
    const exoticChance = rifle.stats.exoticChance;

    // Determine success and rarity
    const success = Math.random() < successRate;
    if (!success) {
        player.lastHuntTime = now;
        savePlayerData();
        return "😔 You didn't find any animals this time.";
    }

    // Determine drop rarity
    let rarity;
    if (Math.random() < exoticChance) rarity = 'exotic';
    else if (Math.random() < 0.1) rarity = 'rare';
    else if (Math.random() < 0.3) rarity = 'uncommon';
    else rarity = 'common';

    // Get possible drops for this rarity
    const possibleDrops = items.filter(i => 
        i.category === 'material' && 
        i.rarity === rarity && 
        (i.name.includes('Pelt') || i.name.includes('Fur') || i.name.includes('Hide'))
    );

    const drop = possibleDrops[Math.floor(Math.random() * possibleDrops.length)];
    const amount = rarity === 'exotic' ? 1 : Math.floor(Math.random() * 3) + 1;

    // Add to inventory with stacking
    player.inventory[drop.name] = (player.inventory[drop.name] || 0) + amount;
    player.lastHuntTime = now;
    player.stats.animalsHunted++;
    savePlayerData();

    return `🎯 Success! You caught ${amount}x ${drop.name}!\nRarity: ${rarity}\nValue: $${drop.value * amount}`;
}

export { executeHuntCommand }; 