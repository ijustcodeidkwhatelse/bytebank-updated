import { player } from '../script.js';

function executeProfileCommand() {
    const stats = player.stats;
    const netWorth = player.cash + player.bank;
    
    return `
**${player.name}'s Profile**
💰 Net Worth: $${netWorth}
    Wallet: $${player.cash}
    Bank: $${player.bank}

📊 Statistics:
    Memes Posted: ${stats.memesPosted}
    Times Worked: ${stats.timesWorked}
    Items Found: ${stats.itemsFound}
    Fish Caught: ${stats.fishCaught}
    Animals Hunted: ${stats.animalsHunted}

🎲 Gambling Stats:
    Games Played: ${stats.gamesPlayed}
    Money Gambled: $${stats.moneyGambled}
    Money Won: $${stats.moneyWon}
    Money Lost: $${stats.moneyLost}

🦹 Crime Stats:
    Successful Robberies: ${stats.robberySuccess}
    Failed Robberies: ${stats.robberyFail}
    `;
}

export { executeProfileCommand }; 