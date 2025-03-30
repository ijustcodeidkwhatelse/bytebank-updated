// balance.js
import { player } from '../script.js';

function executeBalanceCommand() {
    return `💰 Your Balance:
Wallet: <b>$${player.cash}</b>
Bank: <b>$${player.bank}</b>
Net Worth: <b>$${player.cash + player.bank}</b>`;
}

export { executeBalanceCommand };