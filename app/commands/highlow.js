import { player, savePlayerData, updatePlayerInfo } from '../script.js';

const minBet = 100;

function executeHighlowCommand(args) {
    // If no arguments provided, return instructions
    if (!args) {
        return "Please use the format: /highlow <amount> <high/low>";
    }

    const [amount, choice] = args.split(' ');
    const parsedAmount = parseInt(amount);

    // Validate amount
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
        return "Please enter a valid positive number for the bet amount.";
    }

    if (parsedAmount < minBet) {
        return `Minimum bet is $${minBet}.`;
    }

    if (parsedAmount > player.cash) {
        return "You don't have that much money to gamble!";
    }

    // Validate choice
    if (!choice || !['high', 'low'].includes(choice.toLowerCase())) {
        return "Please specify either 'high' or 'low' as your choice.";
    }

    // Generate numbers
    const firstNumber = Math.floor(Math.random() * 100) + 1;
    const secondNumber = Math.floor(Math.random() * 100) + 1;

    // Determine if player won
    const isHigh = secondNumber > firstNumber;
    const playerGuessedHigh = choice.toLowerCase() === 'high';
    const playerWon = isHigh === playerGuessedHigh;

    player.stats.gamesPlayed++;
    player.stats.moneyGambled += parsedAmount;

    let response = `First number: ${firstNumber}\nSecond number: ${secondNumber}\n`;

    if (playerWon) {
        const winnings = Math.floor(parsedAmount * 1.8); // 180% return on win
        player.cash += (winnings - parsedAmount);
        player.stats.moneyWon += winnings - parsedAmount;
        response += `You won $${winnings - parsedAmount}! 🎉`;
    } else {
        player.cash -= parsedAmount;
        player.stats.moneyLost += parsedAmount;
        response += `You lost $${parsedAmount}! 😢`;
    }

    savePlayerData();
    updatePlayerInfo();
    return response;
}

export { executeHighlowCommand }; 