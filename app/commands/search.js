import { player, savePlayerData, updatePlayerInfo } from '../script.js';
import { items } from '../utils/items.js';

const searchLocations = [
    {
        name: 'street',
        messages: [
            "You found some coins on the street!",
            "You found a wallet with some cash!",
            "You found nothing but trash...",
            "You found a rare coin collection!"
        ],
        rewards: [
            { min: 10, max: 50, chance: 0.4 },
            { min: 50, max: 200, chance: 0.3 },
            { min: 0, max: 0, chance: 0.2 },
            { min: 500, max: 1000, chance: 0.1 }
        ],
        items: ['Rusty Coin', 'Gold Coin', 'Diamond']
    },
    {
        name: 'dumpster',
        messages: [
            "You found some recyclables!",
            "You found a valuable antique!",
            "Eww, just garbage...",
            "You found a rare collectible!"
        ],
        rewards: [
            { min: 5, max: 30, chance: 0.5 },
            { min: 100, max: 300, chance: 0.2 },
            { min: 0, max: 0, chance: 0.2 },
            { min: 400, max: 800, chance: 0.1 }
        ],
        items: ['Old Boot', 'Antique Watch', 'Rare Painting']
    },
    // Add more locations as needed
];

const searchCooldown = 30 * 1000; // 30 seconds cooldown

function executeSearchCommand(location) {
    const now = Date.now();
    if (player.lastSearchTime && now - player.lastSearchTime < searchCooldown) {
        const remainingTime = (searchCooldown - (now - player.lastSearchTime)) / 1000;
        return `You're too tired to search again. Wait ${remainingTime.toFixed(1)}s.`;
    }

    // If no location specified, show available locations
    if (!location) {
        return `Available search locations:\n${searchLocations.map(loc => loc.name).join('\n')}`;
    }

    const selectedLocation = searchLocations.find(loc => 
        loc.name.toLowerCase() === location.toLowerCase()
    );

    if (!selectedLocation) {
        return `Invalid location. Try: ${searchLocations.map(loc => loc.name).join(', ')}`;
    }

    // Random chance for money or item
    const findItem = Math.random() < 0.3; // 30% chance to find an item

    if (findItem) {
        const randomItem = selectedLocation.items[Math.floor(Math.random() * selectedLocation.items.length)];
        player.inventory.push(randomItem);
        player.lastSearchTime = now;
        savePlayerData();
        return `While searching the ${selectedLocation.name}, you found a ${randomItem}!`;
    }

    // Otherwise find money
    let reward = 0;
    let message = '';
    let cumulativeChance = 0;
    const random = Math.random();

    for (let i = 0; i < selectedLocation.rewards.length; i++) {
        cumulativeChance += selectedLocation.rewards[i].chance;
        if (random <= cumulativeChance) {
            const { min, max } = selectedLocation.rewards[i];
            reward = Math.floor(Math.random() * (max - min + 1)) + min;
            message = selectedLocation.messages[i];
            break;
        }
    }

    player.cash += reward;
    player.inventory['Gold Coin'] = (player.inventory['Gold Coin'] || 0) + 1;
    player.lastSearchTime = now;
    savePlayerData();
    updatePlayerInfo();

    return `${message}${reward > 0 ? ` (+$${reward})` : ''}`;
}

export { executeSearchCommand }; 