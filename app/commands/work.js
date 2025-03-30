// commands/work.js
import { savePlayerData, updatePlayerInfo, player } from '../script.js';

const workResponses = [
    { text: "You worked a long shift and earned", amount: 50, coin: 1, chance: 0.6 },
    { text: "You did some freelance work and earned", amount: 30, coin: 1, chance: 0.3 },
    { text: "You found a part-time job and earned", amount: 70, coin: 2, chance: 0.1 }
];

const workCommandCooldown = 60 * 1000; // 60 seconds cooldown

function executeWorkCommand() {
    const now = Date.now();
    if (player.lastWorkCommandTime && now - player.lastWorkCommandTime < workCommandCooldown) {
        const remainingTime = (workCommandCooldown - (now - player.lastWorkCommandTime)) / 1000;
        return `You can't work yet. Cooldown: ${remainingTime.toFixed(1)}s`;
    }

    let cumulativeChance = 0;
    const randomValue = Math.random();

    for (const response of workResponses) {
        cumulativeChance += response.chance;
        if (randomValue < cumulativeChance) {
            player.cash += response.amount;
            player.inventory['Gold Coin'] = (player.inventory['Gold Coin'] || 0) + response.coin;
            player.lastWorkCommandTime = now;
            savePlayerData();
            updatePlayerInfo();
            return `✅ Work completed!\n${response.text}:\nCash: $${response.amount}\nGold Coins: ${response.coin}`;
        }
    }
    return "Something went wrong! No response was selected."; // Fallback in case of error.
}

export { executeWorkCommand };