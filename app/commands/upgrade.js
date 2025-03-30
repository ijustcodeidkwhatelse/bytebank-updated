import { player, savePlayerData, updatePlayerInfo } from '../script.js';
import { items } from '../utils/items.js';

function executeUpgradeCommand(args) {
    if (!args) {
        return "What equipment would you like to upgrade? Use: /upgrade <equipment name>";
    }

    const itemName = args;
    const item = items.find(i => i.name.toLowerCase() === itemName.toLowerCase());

    if (!item || !item.upgrade) {
        return "That item cannot be upgraded!";
    }

    // Check if player has the prerequisite item equipped
    const requiredItem = item.upgrade.from;
    const equipmentType = item.type;
    
    if (player.equipment[equipmentType] !== requiredItem) {
        return `You need to have a ${requiredItem} equipped to upgrade to ${item.name}!`;
    }

    if (player.cash < item.upgrade.cost) {
        return `You need $${item.upgrade.cost} to upgrade to ${item.name}!`;
    }

    player.cash -= item.upgrade.cost;
    player.equipment[equipmentType] = item.name;
    savePlayerData();
    updatePlayerInfo();

    return `You upgraded your ${requiredItem} to a ${item.name}! 🎉`;
}

export { executeUpgradeCommand }; 