import { player, savePlayerData, updatePlayerInfo } from '../script.js';

const memeTypes = [
    { type: 'Dank', multiplier: 2, chance: 0.2 },
    { type: 'Fresh', multiplier: 1.5, chance: 0.3 },
    { type: 'Repost', multiplier: 1, chance: 0.4 },
    { type: 'Cringe', multiplier: 0.5, chance: 0.1 }
];

const platforms = [
    { name: 'Reddit', baseReward: 50 },
    { name: 'Twitter', baseReward: 40 },
    { name: 'Instagram', baseReward: 45 },
    { name: 'TikTok', baseReward: 60 }
];

const memeCooldown = 40 * 1000; // 40 seconds cooldown

function executePostMemeCommand() {
    const now = Date.now();
    if (player.lastMemeTime && now - player.lastMemeTime < memeCooldown) {
        const remainingTime = (memeCooldown - (now - player.lastMemeTime)) / 1000;
        return `You need to think of a new meme idea. Wait ${remainingTime.toFixed(1)}s.`;
    }

    const platform = platforms[Math.floor(Math.random() * platforms.length)];
    let memeType;
    const random = Math.random();
    let cumulativeChance = 0;

    for (const type of memeTypes) {
        cumulativeChance += type.chance;
        if (random <= cumulativeChance) {
            memeType = type;
            break;
        }
    }

    const reward = Math.floor(platform.baseReward * memeType.multiplier);
    player.cash += reward;
    player.stats.memesPosted++;
    player.lastMemeTime = now;
    savePlayerData();
    updatePlayerInfo();

    return `You posted a ${memeType.type} meme on ${platform.name} and earned $${reward}!`;
}

export { executePostMemeCommand }; 