import { player, savePlayerData, updatePlayerInfo } from '../script.js';

function executeDepositCommand(amount) {
    if (!amount) {
        return "Please specify an amount to deposit. Example: /deposit 1000";
    }

    amount = parseInt(amount);
    if (isNaN(amount) || amount <= 0) {
        return "Please enter a valid positive number.";
    }

    if (amount > player.cash) {
        return "You don't have that much money in your wallet!";
    }

    player.cash -= amount;
    player.bank += amount;
    savePlayerData();
    updatePlayerInfo();

    return `Successfully deposited $${amount} into your bank account.\nWallet: $${player.cash}\nBank: $${player.bank}`;
}

function executeWithdrawCommand(amount) {
    if (!amount) {
        return "Please specify an amount to withdraw. Example: /withdraw 1000";
    }

    amount = parseInt(amount);
    if (isNaN(amount) || amount <= 0) {
        return "Please enter a valid positive number.";
    }

    if (amount > player.bank) {
        return "You don't have that much money in your bank!";
    }

    player.bank -= amount;
    player.cash += amount;
    savePlayerData();
    updatePlayerInfo();

    return `Successfully withdrew $${amount} from your bank account.\nWallet: $${player.cash}\nBank: $${player.bank}`;
}

export { executeDepositCommand, executeWithdrawCommand }; 