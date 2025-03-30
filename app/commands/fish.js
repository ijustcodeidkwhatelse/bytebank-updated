// fishing.js
import { player, savePlayerData, updatePlayerInfo } from '../script.js';
import { items } from '../utils/items.js';

const fishingCooldown = 30000; // 30 seconds

function executeFishingCommand() {
    // Check if player has a fishing rod equipped
    if (!player.equipment.fishingRod) {
        const hasFishingRod = Object.keys(player.inventory).some(itemName => 
            itemName.toLowerCase().includes('fishing rod') && 
            player.inventory[itemName] > 0
        );
        
        if (hasFishingRod) {
            return "❌ You need to equip your fishing rod first!\nUse '/use Basic Fishing Rod' to equip it.";
        }
        return "❌ You need a fishing rod to fish!\nBuy one from the shop with `/shop`.";
    }

    const now = Date.now();
    if (player.lastFishTime && now - player.lastFishTime < fishingCooldown) {
        const remainingTime = Math.ceil((fishingCooldown - (now - player.lastFishTime)) / 1000);
        return `⏳ Cooldown: ${remainingTime}s remaining`;
    }

    const rod = items.find(i => i.name === player.equipment.fishingRod);
    const catchRate = rod.stats.catchRate;
    const exoticChance = rod.stats.exoticChance;

    // Determine success and rarity
    const success = Math.random() < catchRate;
    if (!success) {
        player.lastFishTime = now;
        savePlayerData();
        return "😔 The fish got away!";
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
        i.name.includes('Fish')
    );

    const drop = possibleDrops[Math.floor(Math.random() * possibleDrops.length)];
    const amount = rarity === 'exotic' ? 1 : Math.floor(Math.random() * 3) + 1;

    // Add to inventory with stacking
    player.inventory[drop.name] = (player.inventory[drop.name] || 0) + amount;
    player.lastFishTime = now;
    player.stats.fishCaught++;
    savePlayerData();

    return `🎣 You caught something!\n${drop.emoji} You caught ${amount}x ${drop.name}!\nRarity: ${rarity}\nValue: $${drop.value * amount}`;
}

export { executeFishingCommand };