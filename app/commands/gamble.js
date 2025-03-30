import { player, savePlayerData, updatePlayerInfo } from '../script.js';

const minBet = 100;

function executeGambleCommand(amount) {
    if (!amount) {
        return "Please specify an amount to gamble. Example: /gamble 100";
    }

    amount = parseInt(amount);
    if (isNaN(amount) || amount <= 0) {
        return "Please enter a valid positive number.";
    }

    if (amount < minBet) {
        return `Minimum bet is $${minBet}.`;
    }

    if (amount > player.cash) {
        return "You don't have that much money to gamble!";
    }

    // Roll dice (1-12)
    const playerRoll = Math.floor(Math.random() * 12) + 1;
    const botRoll = Math.floor(Math.random() * 12) + 1;

    player.stats.gamesPlayed++;
    player.stats.moneyGambled += amount;

    if (playerRoll > botRoll) {
        const winnings = Math.floor(amount * 1.8); // 180% return on win
        player.cash += (winnings - amount);
        player.stats.moneyWon += winnings - amount;
        savePlayerData();
        updatePlayerInfo();
        return `You rolled ${playerRoll}, Bot rolled ${botRoll}\nYou won $${winnings - amount}! 🎉`;
    } else if (playerRoll < botRoll) {
        player.cash -= amount;
        player.stats.moneyLost += amount;
        savePlayerData();
        updatePlayerInfo();
        return `You rolled ${playerRoll}, Bot rolled ${botRoll}\nYou lost $${amount}! 😢`;
    } else {
        return `You rolled ${playerRoll}, Bot rolled ${botRoll}\nIt's a tie! Your money has been returned.`;
    }
}

export { executeGambleCommand }; 