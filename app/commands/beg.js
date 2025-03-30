// commands/beg.js
import { savePlayerData, updatePlayerInfo, player } from '../script.js';

const begResponses = [
    { text: 'Someone gave you $10.', amount: 10, chance: 0.5 },
    { text: 'You found $5 on the ground.', amount: 5, chance: 0.3 },
    { text: 'No one had anything to give.', amount: 0, chance: 0.2 }, 
    { text: 'You found a rare valuable item worth $10000', amount: 10000, chance: 0.0001}
];

const begCommandCooldown = 30 * 1000; // 30 seconds cooldown

function executeBegCommand() {
    const now = Date.now();
    if (player.lastBegCommandTime && now - player.lastBegCommandTime < begCommandCooldown) {
        const remainingTime = (begCommandCooldown - (now - player.lastBegCommandTime)) / 1000;
        return `You can't beg yet. Cooldown: ${remainingTime.toFixed(1)}s`;
    }

    let cumulativeChance = 0;
    const randomValue = Math.random();

    for (const response of begResponses) {
        cumulativeChance += response.chance;
        if (randomValue < cumulativeChance) {
            player.cash += response.amount;
            player.lastBegCommandTime = now;
            savePlayerData();
            updatePlayerInfo();
            return response.text;
        }
    }
    return "Something went wrong! No response was selected."; // Fallback in case of error.
}

export { executeBegCommand };