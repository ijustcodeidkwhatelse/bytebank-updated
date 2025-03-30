// commands/sell.js
import { player, savePlayerData, updatePlayerInfo } from '../script.js';
import { items, itemCategories } from '../utils/items.js';

function executeSellCommand(args) {
    try {
        if (!args) {
            // Display sellable items including equipped items
            const sellableItems = Object.entries(player.inventory).map(([itemName, amount]) => {
                const itemDetails = items.find(i => i.name === itemName);
                if (!itemDetails) {
                    console.log('Warning: Item not found:', itemName);
                    return null;
                }

                // Skip advanced equipment if player doesn't have the basic version
                if (itemDetails.upgrade) {
                    const basicVersion = itemDetails.upgrade.from;
                    const hasBasicVersion = player.inventory[basicVersion] || 
                                         player.equipment.fishingRod === basicVersion ||
                                         player.equipment.huntingRifle === basicVersion;
                    if (!hasBasicVersion) {
                        return null;
                    }
                }

                return {
                    id: itemName,
                    name: itemName,
                    amount: amount,
                    value: itemDetails.value,
                    emoji: itemDetails.emoji,
                    description: itemDetails.description,
                    category: itemDetails.category
                };
            }).filter(item => item !== null);

            // Add equipped items if they exist
            if (player.equipment.fishingRod) {
                const rodDetails = items.find(i => i.name === player.equipment.fishingRod);
                if (rodDetails) {
                    // Only show advanced rods if player has basic version
                    if (!rodDetails.upgrade || 
                        (rodDetails.upgrade && 
                         (player.inventory[rodDetails.upgrade.from] || 
                          player.equipment.fishingRod === rodDetails.upgrade.from))) {
                        sellableItems.push({
                            id: rodDetails.name,
                            name: rodDetails.name,
                            amount: 1,
                            value: rodDetails.value,
                            emoji: rodDetails.emoji,
                            description: `${rodDetails.description} (Currently equipped)`,
                            category: rodDetails.category
                        });
                    }
                }
            }

            if (player.equipment.huntingRifle) {
                const rifleDetails = items.find(i => i.name === player.equipment.huntingRifle);
                if (rifleDetails) {
                    // Only show advanced rifles if player has basic version
                    if (!rifleDetails.upgrade || 
                        (rifleDetails.upgrade && 
                         (player.inventory[rifleDetails.upgrade.from] || 
                          player.equipment.huntingRifle === rifleDetails.upgrade.from))) {
                        sellableItems.push({
                            id: rifleDetails.name,
                            name: rifleDetails.name,
                            amount: 1,
                            value: rifleDetails.value,
                            emoji: rifleDetails.emoji,
                            description: `${rifleDetails.description} (Currently equipped)`,
                            category: rifleDetails.category
                        });
                    }
                }
            }

            if (sellableItems.length === 0) {
                return "💰 You don't have any items to sell!";
            }

            let response = "💰 SELLABLE ITEMS\n";
            
            // Group items by category
            const groupedItems = sellableItems.reduce((acc, item) => {
                const category = item.category || 'misc';
                if (!acc[category]) acc[category] = [];
                acc[category].push(item);
                return acc;
            }, {});

            // Display items by category
            Object.entries(groupedItems).forEach(([category, items]) => {
                const categoryName = itemCategories[category] || 'Miscellaneous';
                response += `\n[${categoryName}]\n`;
                items.forEach(item => {
                    response += `${item.emoji} ${item.name} (x${item.amount})\n`;
                    response += `Value: $${item.value} each\n`;
                    if (item.description) {
                        response += `${item.description}\n`;
                    }
                    response += `Total value: $${item.value * item.amount}\n`;
                    response += `<button class="shop-buy-btn discord-button" data-item="${item.name}">Sell</button>\n\n`;
                });
            });

            return response;
        }

        // Handle selling specific item
        const parts = args.split(' ');
        if (parts.length < 2) {
            return "❌ Please specify both item name and amount. Example: /sell Basic Fishing Rod 1";
        }

        const amount = parseInt(parts[parts.length - 1]);
        const itemName = parts.slice(0, -1).join(' ');

        if (!itemName) {
            return "❌ Please specify an item to sell.";
        }

        const item = items.find(i => i.name.toLowerCase() === itemName.toLowerCase());
        if (!item) {
            return "❌ That item doesn't exist!";
        }

        // Check if item is equipped
        const isEquipped = player.equipment.fishingRod === item.name || 
                          player.equipment.huntingRifle === item.name;

        const owned = (player.inventory[item.name] || 0) + (isEquipped ? 1 : 0);
        if (owned === 0) {
            return `❌ You don't have any ${item.name} to sell!`;
        }

        if (!amount || isNaN(amount) || amount <= 0) {
            return `❌ Please specify a valid amount to sell. You have ${owned}x ${item.name}.\nUse: /sell ${item.name} <amount>`;
        }

        if (amount > owned) {
            return `❌ You only have ${owned}x ${item.name}!`;
        }

        let amountToSell = amount;
        const totalValue = item.value * amount;

        // Handle selling equipped items
        if (isEquipped && amountToSell >= 1) {
            if (player.equipment.fishingRod === item.name) {
                player.equipment.fishingRod = null;
            }
            if (player.equipment.huntingRifle === item.name) {
                player.equipment.huntingRifle = null;
            }
            amountToSell--;  // Reduce amount by 1 since we handled the equipped item
        }

        // Handle remaining items from inventory
        if (amountToSell > 0) {
            if (!player.inventory[item.name]) {
                player.inventory[item.name] = 0;
            }
            player.inventory[item.name] -= amountToSell;
            if (player.inventory[item.name] <= 0) {
                delete player.inventory[item.name];
            }
        }

        player.cash += totalValue;
        savePlayerData();
        updatePlayerInfo();

        return `✅ Sale successful!\n${item.emoji} You sold ${amount}x ${item.name} for $${totalValue}!`;
        
    } catch (error) {
        console.error('Error in executeSellCommand:', error);
        throw error; // Let the parent handle the error display
    }
}

export { executeSellCommand };