// inventory.js
import { player, savePlayerData } from '../script.js';
import { items, itemCategories } from '../utils/items.js';

const maxInventorySize = 50;

function displayInventory() {
    let inventoryList = "**Your Inventory:**\n\n";

    if (Object.keys(player.inventory).length === 0) {
        inventoryList += "Your inventory is empty.\n";
    } else {
        // Group items by category
        const groupedItems = {};
        Object.entries(player.inventory).forEach(([itemName, amount]) => {
            const item = items.find(i => i.name === itemName);
            if (item) {
                if (!groupedItems[item.category]) {
                    groupedItems[item.category] = [];
                }
                groupedItems[item.category].push({
                    name: itemName,
                    amount: amount,
                    value: item.value,
                    emoji: item.emoji
                });
            }
        });

        // Display items by category
        Object.entries(groupedItems).forEach(([category, categoryItems]) => {
            inventoryList += `\n**${itemCategories[category] || category}**\n`;
            categoryItems.forEach(item => {
                inventoryList += `${item.emoji} ${item.name} (${item.amount}x) - $${item.value} each\n`;
            });
        });
    }

    return inventoryList;
}

function getRandomItem() {
  const possibleItems = [];
  items.forEach((item) => {
    if (Math.random() < item.chance) {
      possibleItems.push(item);
    }
  });

  if (possibleItems.length === 0) {
    return null; // Return null if no items were selected
  }

  const randomIndex = Math.floor(Math.random() * possibleItems.length);
  return possibleItems[randomIndex];
}

function addItemToInventory(itemName) {
    const totalItems = Object.values(player.inventory).reduce((sum, amount) => sum + amount, 0);
    if (totalItems >= maxInventorySize) {
        return "Inventory is full. Please upgrade inventory.";
    }

    player.inventory[itemName] = (player.inventory[itemName] || 0) + 1;
    savePlayerData();
    return null;
}

function executeInventoryCommand() {
    const inventoryItems = Object.entries(player.inventory);
    
    if (inventoryItems.length === 0) {
        return "📦 Your inventory is empty!";
    }

    let response = "📦 YOUR INVENTORY\n";
    
    // Group items by category
    const groupedItems = {};
    inventoryItems.forEach(([itemName, amount]) => {
        const itemDetails = items.find(i => i.name === itemName);
        if (itemDetails) {
            const category = itemDetails.category || 'misc';
            if (!groupedItems[category]) groupedItems[category] = [];
            groupedItems[category].push({
                ...itemDetails,
                amount
            });
        }
    });

    // Display items by category
    Object.entries(groupedItems).forEach(([category, categoryItems]) => {
        response += `\n[${itemCategories[category] || 'Miscellaneous'}]\n`;
        categoryItems.forEach(item => {
            response += `${item.emoji} ${item.name} (x${item.amount})\n`;
            response += `Value: $${item.value} each\n`;
            if (item.description) {
                response += `${item.description}\n`;
            }
            response += `Total value: $${item.value * item.amount}\n\n`;
        });
    });

    // Show equipped items
    if (player.equipment.fishingRod || player.equipment.huntingRifle) {
        response += `\n[Equipped Items]\n`;
        if (player.equipment.fishingRod) {
            const rod = items.find(i => i.name === player.equipment.fishingRod);
            if (rod) {
                response += `🎣 ${rod.name}\n${rod.description}\n\n`;
            }
        }
        if (player.equipment.huntingRifle) {
            const rifle = items.find(i => i.name === player.equipment.huntingRifle);
            if (rifle) {
                response += `🔫 ${rifle.name}\n${rifle.description}\n\n`;
            }
        }
    }

    return response;
}

function getRarityColor(rarity) {
    switch (rarity) {
        case 'common': return 'gray';
        case 'uncommon': return 'green';
        case 'rare': return 'blue';
        case 'exotic': return 'purple';
        default: return 'white';
    }
}

export { executeInventoryCommand, displayInventory, addItemToInventory };