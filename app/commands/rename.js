// rename.js
import { player, savePlayerData, updatePlayerInfo } from '../script.js';

function executeRenameCommand(newName) {
  if (!newName) {
    return "Please provide a new name. Example: /rename Taylor";
  }

  const oldName = player.name;
  player.name = newName;
  savePlayerData();
  updatePlayerInfo(); // Update display with the new name

  return `Your name has been changed from ${oldName} to ${newName}.`;
}

export { executeRenameCommand };