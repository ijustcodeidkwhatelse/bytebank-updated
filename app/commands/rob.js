import { player, savePlayerData, updatePlayerInfo } from '../script.js';

const robCooldown = 300000; // 5 minutes
const baseSuccessRate = 0.4; // 40% base success rate
const minRobAmount = 100;
const maxRobAmount = 1000;
const failureFine = 500;

function executeRobCommand() {
    const now = Date.now();
    if (player.lastRobTime && now - player.lastRobTime < robCooldown) {
        const remainingTime = Math.ceil((robCooldown - (now - player.lastRobTime)) / 1000);
        const minutes = Math.floor(remainingTime / 60);
        const seconds = remainingTime % 60;
        return `You need to lay low for ${minutes}m ${seconds}s before robbing again.`;
    }

    // Check if player has enough money to pay fine if caught
    if (player.cash < failureFine) {
        return `You need at least $${failureFine} in your wallet to attempt a robbery (in case you get caught).`;
    }

    // Calculate success rate with items boost
    let successRate = baseSuccessRate;
    if (player.thieftoolsEffect && player.thieftoolsEffect > now) {
        successRate += 0.2; // +20% success rate with tools
    }

    const success = Math.random() < successRate;
    player.lastRobTime = now;

    if (success) {
        const amount = Math.floor(Math.random() * (maxRobAmount - minRobAmount + 1)) + minRobAmount;
        player.cash += amount;
        player.stats.robberySuccess++;
        savePlayerData();
        updatePlayerInfo();
        return `You successfully robbed someone and got away with $${amount}! 💰`;
    } else {
        player.cash -= failureFine;
        player.stats.robberyFail++;
        savePlayerData();
        updatePlayerInfo();
        return `You got caught and had to pay a fine of $${failureFine}! 👮`;
    }
}

export { executeRobCommand }; 