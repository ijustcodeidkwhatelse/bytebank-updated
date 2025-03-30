import { player, savePlayerData, updatePlayerInfo } from '../script.js';

const giftRewards = [
    { min: 100, max: 500 },
    { min: 500, max: 1000 },
    { min: 1000, max: 2000 }
];

function executeGiftCommand(args) {
    if (!args) {
        return "Please specify an item to gift. Example: /gift Fishing Rod";
    }

    const itemName = args;
    const itemIndex = player.inventory.findIndex(item => 
        item.toLowerCase() === itemName.toLowerCase()
    );

    if (itemIndex === -1) {
        return `You don't have a ${itemName} in your inventory.`;
    }

    // Remove item from inventory
    const item = player.inventory[itemIndex];
    player.inventory.splice(itemIndex, 1);

    // Give random reward
    const reward = giftRewards[Math.floor(Math.random() * giftRewards.length)];
    const amount = Math.floor(Math.random() * (reward.max - reward.min + 1)) + reward.min;
    
    player.cash += amount;
    savePlayerData();
    updatePlayerInfo();

    return `You gifted your ${item} and received $${amount} in return! 🎁`;
}

export { executeGiftCommand }; 