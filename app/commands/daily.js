// daily.js
import { player, savePlayerData, updatePlayerInfo } from '../script.js';

const dailyCommandCooldown = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

function executeDailyCommand() {
    const now = Date.now();
    const lastDailyTime = player.lastDailyTime || 0;

    if (now - lastDailyTime < dailyCommandCooldown) {
        const remainingTime = dailyCommandCooldown - (now - lastDailyTime);
        const hours = Math.floor(remainingTime / (60 * 60 * 1000));
        const minutes = Math.floor((remainingTime % (60 * 60 * 1000)) / (60 * 1000));
        const seconds = Math.floor((remainingTime % (60 * 1000)) / 1000);
        return `You've already claimed your daily reward. \n Come back in <b>${hours}h ${minutes}m ${seconds}s.</b>`;
    }

    const dailyAmount = Math.floor(Math.random() * 1000) + 500; // Random amount between 500 and $1000
    player.cash += dailyAmount;
    player.lastDailyTime = now;
    savePlayerData();
    updatePlayerInfo();

    return `You claimed your daily reward of <b>$${dailyAmount}.</b>`;
}

export { executeDailyCommand };