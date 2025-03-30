import { player, savePlayerData, updatePlayerInfo } from '../script.js';
import { items } from '../utils/items.js';

function executeShopCommand(args) {
    if (!args) {
        // Group items by category
        const shopCategories = {
            equipment: items.filter(i => {
                // For basic equipment (tier 1), always show
                if (i.category === 'equipment' && i.tier === 1) return true;
                
                // For higher tier equipment, only show if player has previous tier
                if (i.category === 'equipment' && i.upgrade) {
                    const previousTier = i.upgrade.from;
                    return player.equipment.fishingRod === previousTier || 
                           player.equipment.huntingRifle === previousTier;
                }
                return false;
            }),
            tools: items.filter(i => i.category === 'tool'),
            luck: items.filter(i => i.category === 'luck')
        };

        let shopList = "🏪 WELCOME TO THE SHOP!\n\n";

        // Equipment Section
        shopList += "[Equipment]\n";
        shopCategories.equipment.forEach(item => {
            shopList += `${item.emoji} ${item.name}\n`;
            shopList += `• ${item.description}\n`;
            shopList += `• Price: $${item.upgrade ? item.upgrade.cost : item.value}\n`;
            shopList += `<button class="shop-buy-btn discord-button" data-item="${item.name}">Buy Now</button>\n\n`;
        });

        // Tools Section
        shopList += "[Tools]\n";
        shopCategories.tools.forEach(item => {
            shopList += `${item.emoji} ${item.name}\n`;
            shopList += `• ${item.description}\n`;
            shopList += `• Price: $${item.value}\n`;
            shopList += `<button class="shop-buy-btn discord-button" data-item="${item.name}">Buy Now</button>\n\n`;
        });

        // Luck Items Section
        shopList += "[Luck Items]\n";
        shopCategories.luck.forEach(item => {
            shopList += `${item.emoji} ${item.name}\n`;
            shopList += `• ${item.description}\n`;
            shopList += `• Price: $${item.value}\n`;
            shopList += `<button class="shop-buy-btn discord-button" data-item="${item.name}">Buy Now</button>\n\n`;
        });

        return shopList;
    }

    const [action, ...itemNameParts] = args.split(' ');
    const itemName = itemNameParts.join(' ');

    if (action.toLowerCase() !== 'buy') {
        return "Invalid command. Use '/shop' to view items or '/shop buy <item name>' to purchase.";
    }

    console.log('Attempting to buy:', {
        itemName,
        action,
        itemNameParts,
        currentInventory: player.inventory
    });

    const item = items.find(i => i.name.toLowerCase() === itemName.toLowerCase());
    if (!item) {
        return "That item doesn't exist in the shop!";
    }

    if (player.cash < item.value) {
        return `You don't have enough money to buy ${item.name}. You need $${item.value}.`;
    }

    // Add item to inventory
    if (!player.inventory[item.name]) {
        player.inventory[item.name] = 0;
    }
    player.inventory[item.name]++;

    // Deduct cash and save
    player.cash -= item.value;
    savePlayerData();
    updatePlayerInfo();

    console.log('After purchase:', {
        itemName: item.name,
        newInventory: player.inventory
    });

    return `You bought ${item.emoji} ${item.name} for $${item.value}!`;
}

export { executeShopCommand }; 