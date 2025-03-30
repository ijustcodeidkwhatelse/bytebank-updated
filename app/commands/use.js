import { player, savePlayerData, updatePlayerInfo } from '../script.js';
import { items } from '../utils/items.js';

const itemEffects = {
    'Fishing Rod': { duration: 300000, effect: 'Increased fishing luck for 5 minutes!' },
    'Hunting Rifle': { duration: 300000, effect: 'Increased hunting success for 5 minutes!' },
    'Lucky Charm': { duration: 300000, effect: 'Increased gambling luck for 5 minutes!' },
    'Thief Tools': { duration: 300000, effect: 'Increased robbery success for 5 minutes!' }
};

function executeUseCommand(args) {
    if (!args) {
        return "Please specify an item to use. Example: /use Basic Fishing Rod";
    }

    const itemName = args;
    const item = items.find(i => i.name.toLowerCase() === itemName.toLowerCase());
    
    if (!item) {
        return "That item doesn't exist!";
    }

    // Check inventory using case-insensitive comparison
    const hasItem = Object.entries(player.inventory).some(([name, amount]) => 
        name.toLowerCase() === item.name.toLowerCase() && amount > 0
    );

    if (!hasItem) {
        return `You don't have a ${item.name} in your inventory.`;
    }

    // Handle equipment items
    if (item.category === 'equipment') {
        const equipmentType = item.type; // 'fishingRod' or 'huntingRifle'
        
        // If already have something equipped, unequip it and return to inventory
        if (player.equipment[equipmentType]) {
            const oldEquipment = player.equipment[equipmentType];
            player.inventory[oldEquipment] = (player.inventory[oldEquipment] || 0) + 1;
        }
        
        // Equip new item
        player.equipment[equipmentType] = item.name;
        player.inventory[item.name]--;
        
        // Remove from inventory if quantity is 0
        if (player.inventory[item.name] <= 0) {
            delete player.inventory[item.name];
        }
        
        savePlayerData();
        return `You equipped the ${item.emoji} ${item.name}!`;
    }

    // Handle consumable items
    const effect = itemEffects[item.name];
    if (effect) {
        player.inventory[item.name]--;
        if (player.inventory[item.name] <= 0) {
            delete player.inventory[item.name];
        }
        
        const now = Date.now();
        player[`${item.name.toLowerCase().replace(' ', '')}Effect`] = now + effect.duration;
        
        savePlayerData();
        return `You used ${item.emoji} ${item.name}. ${effect.effect}`;
    }

    return `${item.name} cannot be used.`;
}

export { executeUseCommand }; 