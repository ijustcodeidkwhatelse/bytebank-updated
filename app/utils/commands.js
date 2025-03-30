import { executeInventoryCommand } from '../commands/inventory.js';
import { executeSellCommand } from '../commands/sell.js';
import { executeWorkCommand } from '../commands/work.js';
import { executeBegCommand } from '../commands/beg.js';
import { executeFishingCommand } from '../commands/fish.js';
import { executeDailyCommand } from '../commands/daily.js';
import { executeBalanceCommand } from '../commands/balance.js';
import { executeRenameCommand } from '../commands/rename.js';
import { executeProfileCommand } from '../commands/profile.js';
import { executeShopCommand } from '../commands/shop.js';
import { executeUseCommand } from '../commands/use.js';
import { executeSearchCommand } from '../commands/search.js';
import { executeDepositCommand, executeWithdrawCommand } from '../commands/bank.js';
import { executeHuntCommand } from '../commands/hunt.js';
import { executePostMemeCommand } from '../commands/postmeme.js';
import { executeGambleCommand } from '../commands/gamble.js';
import { executeGiftCommand } from '../commands/gift.js';
import { executeRobCommand } from '../commands/rob.js';
import { executeHighlowCommand } from '../commands/highlow.js';

// Add command shortcuts
export const commandAliases = {
    'bal': 'balance',
    'dep': 'deposit',
    'with': 'withdraw',
    'wd': 'withdraw',
    'inv': 'inventory',
    'daily': 'daily',
    'work': 'work',
    'beg': 'beg',
    'search': 'search',
    'hunt': 'hunt',
    'fish': 'fish',
    'pm': 'postmeme',
    'meme': 'postmeme',
    'shop': 'shop',
    'sell': 'sell',
    'use': 'use',
    'gift': 'gift',
    'gamble': 'gamble',
    'g': 'gamble',
    'hl': 'highlow',
    'high': 'highlow',
    'prof': 'profile',
    'p': 'profile',
    'rename': 'rename',
    'rob': 'rob'
};

// Update the commands export to handle aliases
export const commands = {
    balance: executeBalanceCommand,
    bal: executeBalanceCommand,
    deposit: executeDepositCommand,
    dep: executeDepositCommand,
    withdraw: executeWithdrawCommand,
    with: executeWithdrawCommand,
    wd: executeWithdrawCommand,
    daily: executeDailyCommand,
    work: executeWorkCommand,
    beg: executeBegCommand,
    search: executeSearchCommand,
    hunt: executeHuntCommand,
    fish: executeFishingCommand,
    postmeme: executePostMemeCommand,
    pm: executePostMemeCommand,
    meme: executePostMemeCommand,
    inventory: executeInventoryCommand,
    inv: executeInventoryCommand,
    shop: executeShopCommand,
    sell: executeSellCommand,
    use: executeUseCommand,
    gift: executeGiftCommand,
    gamble: executeGambleCommand,
    g: executeGambleCommand,
    highlow: executeHighlowCommand,
    hl: executeHighlowCommand,
    high: executeHighlowCommand,
    profile: executeProfileCommand,
    prof: executeProfileCommand,
    p: executeProfileCommand,
    rename: executeRenameCommand,
    rob: executeRobCommand
};

export const commandDescriptions = [
    { name: 'balance (bal)', description: 'Check your wallet and bank balance' },
    { name: 'deposit (dep)', description: 'Deposit money into your bank' },
    { name: 'withdraw (with, wd)', description: 'Withdraw money from your bank' },
    { name: 'daily', description: 'Claim your daily reward' },
    { name: 'work', description: 'Work for money' },
    { name: 'beg', description: 'Beg for money' },
    { name: 'search', description: 'Search for money in different locations' },
    { name: 'hunt', description: 'Hunt for animals and items' },
    { name: 'fish', description: 'Go fishing for items' },
    { name: 'postmeme (pm, meme)', description: 'Post a meme to earn money' },
    { name: 'inventory (inv)', description: 'View your inventory' },
    { name: 'shop', description: 'Browse the shop for items' },
    { name: 'sell', description: 'Sell items from your inventory' },
    { name: 'use', description: 'Use an item from your inventory' },
    { name: 'gift', description: 'Gift items to other players' },
    { name: 'gamble (g)', description: 'Gamble your money' },
    { name: 'highlow (hl, high)', description: 'Guess if the next number is higher or lower' },
    { name: 'profile (prof, p)', description: 'View your profile stats' },
    { name: 'rename', description: 'Change your display name' },
    { name: 'rob', description: 'Attempt to rob another player' }
];