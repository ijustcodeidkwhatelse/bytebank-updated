// Imports must be at the top level
import { onLoad } from './page/load.js';
import { items, itemCategories } from './utils/items.js';
import { commands, commandDescriptions, commandAliases } from './utils/commands.js';

// Player Data
export let player = {
    name: localStorage.getItem('playerName') || 'New Player',
    cash: parseInt(localStorage.getItem('playerCash')) || 0,
    bank: parseInt(localStorage.getItem('playerBank')) || 0,
    lastWorkTime: parseInt(localStorage.getItem('lastWorkTime')) || 0,
    lastWorkCommandTime: parseInt(localStorage.getItem('lastWorkCommandTime')) || 0,
    lastBegCommandTime: parseInt(localStorage.getItem('lastBegCommandTime')) || 0,
    lastSearchTime: parseInt(localStorage.getItem('lastSearchTime')) || 0,
    lastHuntTime: parseInt(localStorage.getItem('lastHuntTime')) || 0,
    lastRobTime: parseInt(localStorage.getItem('lastRobTime')) || 0,
    inventory: JSON.parse(localStorage.getItem('playerInventory')) || {},
    equipment: JSON.parse(localStorage.getItem('playerEquipment')) || {
        fishingRod: null,
        huntingRifle: null
    },
    lastDailyTime: parseInt(localStorage.getItem('lastDailyTime')) || 0,
    stats: JSON.parse(localStorage.getItem('playerStats')) || {
        memesPosted: 0,
        timesWorked: 0,
        itemsFound: 0,
        robberySuccess: 0,
        robberyFail: 0,
        fishCaught: 0,
        animalsHunted: 0,
        gamesPlayed: 0,
        moneyGambled: 0,
        moneyWon: 0,
        moneyLost: 0
    }
};
// Export these functions so they can be imported by other modules
export function savePlayerData() {
    localStorage.setItem('playerName', player.name);
    localStorage.setItem('playerCash', player.cash);
    localStorage.setItem('playerBank', player.bank);
    localStorage.setItem('lastWorkTime', player.lastWorkTime);
    localStorage.setItem('lastWorkCommandTime', player.lastWorkCommandTime);
    localStorage.setItem('lastBegCommandTime', player.lastBegCommandTime);
    localStorage.setItem('lastSearchTime', player.lastSearchTime);
    localStorage.setItem('lastHuntTime', player.lastHuntTime);
    localStorage.setItem('lastRobTime', player.lastRobTime);
    localStorage.setItem('playerInventory', JSON.stringify(player.inventory));
    localStorage.setItem('playerEquipment', JSON.stringify(player.equipment));
    localStorage.setItem('lastDailyTime', player.lastDailyTime);
    localStorage.setItem('playerStats', JSON.stringify(player.stats));
}

export function updatePlayerInfo() {
    const cashDisplay = document.getElementById('player-cash-display');
    if (cashDisplay) {
        cashDisplay.textContent = `$${player.cash}`;
    }
}

// Error handling for script execution
window.addEventListener('error', function(e) {
    console.error('Script error:', e);
});

// Add this function near the top of script.js, after the imports
function isItemUsable(itemName) {
    const item = items.find(i => i.name === itemName);
    return item && (item.category === 'equipment' || itemEffects[item.name]);
}

// Initialize application
document.addEventListener('DOMContentLoaded', () => {
    try {
        console.log('Initializing application...');
        
        // Call onLoad to initialize the application
        onLoad();
        
        // Chat functionality
        const chatLog = document.getElementById('chat-log');
        const chatInput = document.getElementById('chat-input');
        const sendButton = document.getElementById('send-button');
        const commandSuggestions = document.getElementById('command-suggestions');

        function botSays(message) {
            const messageDiv = document.createElement('div');
            messageDiv.className = 'message bot-message';
            
            const messageHeader = document.createElement('div');
            messageHeader.className = 'message-header';
            messageHeader.innerHTML = `
                <img class="bot-avatar" src="https://dankmemer.lol/img/memer.webp" alt="ByteBot">
                <span class="message-name">ByteBot</span>
                <span class="message-timestamp">${new Date().toLocaleTimeString()}</span>
            `;
            
            const messageContent = document.createElement('div');
            messageContent.className = 'message-content';
            messageContent.innerHTML = message;
            
            messageDiv.appendChild(messageHeader);
            messageDiv.appendChild(messageContent);
            chatLog.appendChild(messageDiv);
            chatLog.scrollTop = chatLog.scrollHeight;
        }

        sendButton.addEventListener('click', sendMessage);

        chatInput.addEventListener('keydown', (event) => {
            if (event.key === 'Enter' && !event.shiftKey && commandSuggestions.style.display !== 'block') {
                event.preventDefault(); // Prevent default Enter behavior (form submission)
                sendMessage();
            }
        });

        function handleCommand(commandName, args) {
            try {
                // Check if command is an alias and get the main command name
                const mainCommandName = commandAliases[commandName] || commandName;
                
                if (commands[mainCommandName]) {
                    let response;
                    
                    // Execute the command and get response
                    response = commands[mainCommandName](args);
                    
                    // Only show response if it's not null or undefined
                    if (response !== null && response !== undefined) {
                        botSays(response);
                        
                        // Only hide suggestions if it was a successful sale
                        if (mainCommandName === 'sell' && response.includes('✅ Sale successful')) {
                            commandSuggestions.style.display = 'none';
                        }
                    }
                } else {
                    botSays("That command doesn't exist.");
                }
            } catch (error) {
                console.error('Error executing command:', error);
                botSays("❌ There was an error executing that command.");
            }
        }

        const randomResponses = [
            'OMG PLAY THE GAME!',
            'Hurry up and play..',
            'Play the game egg.',
            'Silly play the game.',
        ];

        function generateResponse(message) {
            const randomIndex = Math.floor(Math.random() * randomResponses.length);
            return randomResponses[randomIndex];
        }

        function sendMessage() {
            console.log('Sending message:', chatInput.value);
            commandSuggestions.style.display = 'none';
            const message = chatInput.value;
            if (message) {
                const formattedMessage = message.replace(/\n/g, '<br>');
                chatLog.innerHTML += `
                    <div class="message player-message">
                        <span class="message-name">${player.name}</span>
                        ${formattedMessage}
                    </div>
                `;
                chatInput.value = '';
                chatLog.scrollTop = chatLog.scrollHeight;

                if (message.startsWith('/')) {
                    console.log('Processing command:', message);
                    const parts = message.slice(1).trim().split(' ');
                    const commandName = parts[0];
                    const args = parts.slice(1).join(' ');
                    handleCommand(commandName, args);
                } else {
                    console.log('Generating random response');
                    botSays(generateResponse(message));
                }
            }
        }

        let selectedSuggestionIndex = -1; // Track the selected suggestion

        function displayCommands(input) {
            const commandNames = Object.keys(commands);
            commandSuggestions.innerHTML = '<div class="suggestion-header">COMMANDS</div>';
            selectedSuggestionIndex = -1;

            // Add handling for use command
            if (input.startsWith('use')) {
                // Display usable items as suggestions
                const usableItems = Object.entries(player.inventory).filter(([itemName, item]) => {
                    return isItemUsable(itemName); // You would need to implement this function
                });

                if (usableItems.length > 0) {
                    commandSuggestions.innerHTML = '<div class="suggestion-header">USABLE ITEMS</div>';
                    usableItems.forEach(([itemName, item], index) => {
                        const suggestionItem = document.createElement('div');
                        suggestionItem.classList.add('command-suggestion-item');
                        suggestionItem.innerHTML = `🎁 ${itemName}`;
                        suggestionItem.addEventListener('click', () => {
                            chatInput.value = `/use ${itemName}`;
                            commandSuggestions.style.display = 'none';
                            chatInput.focus();
                            sendMessage();
                        });
                        commandSuggestions.appendChild(suggestionItem);
                    });
                    commandSuggestions.style.display = 'block';
                } else {
                    commandSuggestions.innerHTML = '<div class="suggestion-header">USABLE ITEMS</div><div class="command-suggestion-item">No items in inventory</div>';
                    commandSuggestions.style.display = 'block';
                }
                return;
            }

            // Replace the sell command handling section in displayCommands function
            if (input.startsWith('sell')) {
                // Display sellable items as suggestions
                const sellableItems = [];
                
                // Add inventory items
                Object.entries(player.inventory).forEach(([itemName, amount]) => {
                    const itemDetails = items.find(i => i.name === itemName);
                    if (itemDetails) {
                        sellableItems.push({
                            id: itemName,
                            name: itemName,
                            amount: amount,
                            value: itemDetails.value,
                            emoji: itemDetails.emoji,
                            description: itemDetails.description,
                            category: itemDetails.category
                        });
                    }
                });

                // Add equipped items
                if (player.equipment.fishingRod) {
                    const rodDetails = items.find(i => i.name === player.equipment.fishingRod);
                    if (rodDetails) {
                        sellableItems.push({
                            id: rodDetails.name,
                            name: rodDetails.name,
                            amount: 1,
                            value: rodDetails.value,
                            emoji: rodDetails.emoji,
                            description: `${rodDetails.description} (Equipped)`,
                            category: rodDetails.category
                        });
                    }
                }

                if (player.equipment.huntingRifle) {
                    const rifleDetails = items.find(i => i.name === player.equipment.huntingRifle);
                    if (rifleDetails) {
                        sellableItems.push({
                            id: rifleDetails.name,
                            name: rifleDetails.name,
                            amount: 1,
                            value: rifleDetails.value,
                            emoji: rifleDetails.emoji,
                            description: `${rifleDetails.description} (Equipped)`,
                            category: rifleDetails.category
                        });
                    }
                }

                if (sellableItems.length > 0) {
                    commandSuggestions.innerHTML = '<div class="suggestion-header">SELLABLE ITEMS</div>';
                    
                    // Group items by category
                    const groupedItems = sellableItems.reduce((acc, item) => {
                        const category = item.category || 'misc';
                        if (!acc[category]) acc[category] = [];
                        acc[category].push(item);
                        return acc;
                    }, {});

                    // Display items by category
                    Object.entries(groupedItems).forEach(([category, items]) => {
                        const categoryHeader = document.createElement('div');
                        categoryHeader.className = 'suggestion-category-header';
                        categoryHeader.textContent = itemCategories[category] || 'Miscellaneous';
                        commandSuggestions.appendChild(categoryHeader);

                        items.forEach((item) => {
                            const suggestionItem = document.createElement('div');
                            suggestionItem.classList.add('command-suggestion-item');
                            suggestionItem.innerHTML = `
                                ${item.emoji} ${item.name} 
                                <span class="item-amount">(x${item.amount})</span>
                                <span class="item-value">$${item.value} each</span>
                            `;
                            suggestionItem.addEventListener('click', () => {
                                chatInput.value = `/sell ${item.name} ${item.amount}`;
                                commandSuggestions.style.display = 'none';
                                chatInput.focus();
                                sendMessage();
                            });
                            commandSuggestions.appendChild(suggestionItem);
                        });
                    });
                    commandSuggestions.style.display = 'block';
                } else {
                    commandSuggestions.innerHTML = '<div class="suggestion-header">SELLABLE ITEMS</div><div class="command-suggestion-item">No items to sell</div>';
                    commandSuggestions.style.display = 'block';
                }
                return;
            }

            // Default command suggestion logic
            let suggestionsToShow = [];
            
            if (!input) {
                suggestionsToShow = commandDescriptions;
            } else {
                const searchTerm = input.toLowerCase();
                suggestionsToShow = commandDescriptions.filter(cmd => 
                    cmd.name.toLowerCase().startsWith(searchTerm)
                );
            }

            if (suggestionsToShow.length > 0) {
                suggestionsToShow.forEach((cmd) => {
                    const suggestionItem = document.createElement('div');
                    suggestionItem.classList.add('command-suggestion-item');
                    suggestionItem.innerHTML = `<b>/${cmd.name}</b> - ${cmd.description}`;
                    suggestionItem.addEventListener('click', () => {
                        chatInput.value = `/${cmd.name} `;
                        commandSuggestions.style.display = 'none';
                        chatInput.focus();
                    });
                    commandSuggestions.appendChild(suggestionItem);
                });
                commandSuggestions.style.display = 'block';
            } else {
                commandSuggestions.style.display = 'none';
            }
        }

        function handleCommandInput(input) {
            const parts = input.slice(1).trim().split(/\s+/);
            const commandName = parts[0].toLowerCase();
            
            if (commandName === 'gamble') {
                botSays("Enter the amount you want to gamble:");
                showInputSuggestion((amount) => {
                    chatInput.value = `/gamble ${amount}`;
                    sendMessage();
                });
                return true;
            }
            
            if (commandName === 'highlow' && parts.length === 1) {
                botSays("Enter the amount you want to bet:");
                showInputSuggestion((amount) => {
                    chatInput.value = `/highlow ${amount}`;
                    sendMessage();
                    setTimeout(() => {
                        showChoiceSuggestion("Choose high or low:", ['high', 'low'], (choice) => {
                            chatInput.value = `/highlow ${amount} ${choice}`;
                            sendMessage();
                        });
                    }, 100);
                });
                return true;
            }
            
            return false;
        }

        function showInputSuggestion(callback, command) {
            const messageDiv = document.createElement('div');
            messageDiv.className = 'message bot-message input-message';
            messageDiv.innerHTML = `
                <div class="input-suggestion">
                    <input type="number" class="suggestion-input" placeholder="Enter amount...">
                </div>
            `;

            chatLog.appendChild(messageDiv);
            chatLog.scrollTop = chatLog.scrollHeight;

            const input = messageDiv.querySelector('.suggestion-input');
            input.focus();

            input.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    const value = input.value;
                    if (value && !isNaN(value) && value > 0) {
                        // Check if player has enough money for relevant commands
                        if (['gamble', 'highlow'].includes(command) && parseInt(value) > player.cash) {
                            botSays("You don't have that much money!");
                            messageDiv.remove();
                            return;
                        }
                        if (command === 'withdraw' && parseInt(value) > player.bank) {
                            botSays("You don't have that much money in your bank!");
                            messageDiv.remove();
                            return;
                        }
                        if (command === 'deposit' && parseInt(value) > player.cash) {
                            botSays("You don't have that much money in your wallet!");
                            messageDiv.remove();
                            return;
                        }
                        
                        // Check minimum bet for gambling commands
                        if (['gamble', 'highlow'].includes(command) && parseInt(value) < 100) {
                            botSays("Minimum bet is $100.");
                            messageDiv.remove();
                            return;
                        }
                        
                        messageDiv.remove();
                        if (command === 'highlow') {
                            // Show high/low choice buttons
                            botSays("Choose high or low:");
                            showChoiceSuggestion(['high', 'low'], (choice) => {
                                handleCommand('highlow', `${value} ${choice}`);
                            });
                        } else {
                            handleCommand(command, value);
                        }
                    }
                } else if (e.key === 'Escape') {
                    messageDiv.remove();
                    chatInput.focus();
                }
            });
        }

        function showChoiceSuggestion(choices, callback) {
            const messageDiv = document.createElement('div');
            messageDiv.className = 'message bot-message choice-message';
            messageDiv.innerHTML = `
                <div class="choice-buttons">
                    ${choices.map(choice => `
                        <button class="choice-btn">${choice}</button>
                    `).join('')}
                </div>
            `;

            chatLog.appendChild(messageDiv);
            chatLog.scrollTop = chatLog.scrollHeight;

            const buttons = messageDiv.querySelectorAll('.choice-btn');
            buttons.forEach(button => {
                button.addEventListener('click', () => {
                    messageDiv.remove();
                    callback(button.textContent.toLowerCase());
                });
            });
        }

        function showSellSuggestion(items) {
            const messageDiv = document.createElement('div');
            messageDiv.className = 'message bot-message choice-message';
            
            // Group items by category
            const groupedItems = items.reduce((acc, item) => {
                const itemDetails = window.items.find(i => i.name === item.name);
                const category = itemDetails?.category || 'misc';
                if (!acc[category]) acc[category] = [];
                acc[category].push({...item, ...itemDetails});
                return acc;
            }, {});

            let html = '<div class="sell-container">';
            
            // Add category headers and items
            Object.entries(groupedItems).forEach(([category, categoryItems]) => {
                html += `
                    <div class="sell-category">
                        <div class="category-header">${itemCategories[category] || '📦 Miscellaneous'}</div>
                        <div class="sell-buttons">
                            ${categoryItems.map(item => `
                                <button class="sell-btn" data-id="${item.id}">
                                    <span class="item-emoji">${item.emoji}</span>
                                    <span class="item-name">${item.name}</span>
                                    <span class="item-price">$${item.value}</span>
                                    <span class="item-description">${item.description}</span>
                                </button>
                            `).join('')}
                        </div>
                    </div>
                `;
            });
            
            html += '</div>';
            messageDiv.innerHTML = html;

            chatLog.appendChild(messageDiv);
            chatLog.scrollTop = chatLog.scrollHeight;

            const buttons = messageDiv.querySelectorAll('.sell-btn');
            buttons.forEach(button => {
                button.addEventListener('click', () => {
                    messageDiv.remove();
                    handleCommand('sell', button.dataset.id);
                });
            });
        }

        function showSellConfirmation(item, callback) {
            const messageDiv = document.createElement('div');
            messageDiv.className = 'message bot-message choice-message';
            messageDiv.innerHTML = `
                <div class="confirmation-dialog">
                    <div class="confirmation-message">
                        Are you sure you want to sell ${item.emoji} ${item.name} for $${item.value}?
                    </div>
                    <div class="confirmation-buttons">
                        <button class="confirm-btn confirm-yes">Yes, sell it</button>
                        <button class="confirm-btn confirm-no">No, keep it</button>
                    </div>
                </div>
            `;

            chatLog.appendChild(messageDiv);
            chatLog.scrollTop = chatLog.scrollHeight;

            const yesBtn = messageDiv.querySelector('.confirm-yes');
            const noBtn = messageDiv.querySelector('.confirm-no');

            yesBtn.addEventListener('click', () => {
                messageDiv.remove();
                callback(true);
            });

            noBtn.addEventListener('click', () => {
                messageDiv.remove();
                callback(false);
            });
        }

        // Modify the existing chatInput event listener
        chatInput.addEventListener('input', (event) => {
            const input = event.target.value;
            if (input.startsWith('/')) {
                displayCommands(input.slice(1));
            } else {
                commandSuggestions.style.display = 'none';
            }
        });

        // Modify the existing chatInput keydown event listener
        chatInput.addEventListener('keydown', (event) => {
            if (event.key === 'Enter' && !event.shiftKey) {
                event.preventDefault();
                
                // Remove any existing input or choice messages
                document.querySelectorAll('.input-message, .choice-message').forEach(el => el.remove());
                
                // Hide command suggestions
                commandSuggestions.style.display = 'none';
                
                sendMessage();
            }
        });

        // Add this at the top of script.js after imports
        console.log('Script.js loaded successfully');
        document.addEventListener('DOMContentLoaded', () => {
            console.log('DOM fully loaded');
            // You can test DOM elements here
            console.log('Chat log element:', document.getElementById('chat-log'));
            console.log('Chat input element:', document.getElementById('chat-input'));
        });

        // Export player and functions that other modules need
        window.player = player;
        window.savePlayerData = savePlayerData;
        window.updatePlayerInfo = updatePlayerInfo;

        // Add at the top after imports
        console.log('Modules loaded:', {
            onLoad: typeof onLoad,
            items: typeof items,
            commands: typeof commands,
            commandDescriptions: typeof commandDescriptions
        });

        // Channel switching functionality
        const channels = document.querySelectorAll('.channel-item');
        const headerChannelName = document.querySelector('.header-channel-name');
        
        channels.forEach(channel => {
            channel.addEventListener('click', () => {
                // Remove active class from all channels
                channels.forEach(ch => ch.classList.remove('active'));
                
                // Add active class to clicked channel
                channel.classList.add('active');
                
                // Update header
                const channelName = channel.getAttribute('data-channel');
                headerChannelName.textContent = channelName;
                
                // Clear chat log for new channel
                const chatLog = document.getElementById('chat-log');
                chatLog.innerHTML = '';
                
                // Show channel-specific welcome message
                switch(channelName) {
                    case 'welcome':
                        botSays("👋 Welcome to ByteBank! This is your one-stop shop for all your virtual economy needs!");
                        break;
                    case 'rules':
                        botSays(`📜 Server Rules:
1. Be respectful to others
2. No spamming commands
3. Don't exploit bugs
4. Have fun!`);
                        break;
                    case 'commands':
                        const commandList = commandDescriptions.map(cmd => 
                            `/${cmd.name} - ${cmd.description}`
                        ).join('\n');
                        botSays(`🤖 Available Commands:\n${commandList}`);
                        break;
                    case 'help':
                        botSays(`📚 Need help? Here are some tips:
• Use /balance to check your money
• Use /work to earn money
• Use /shop to buy items
• Use /inventory to check your items
• Use /help <command> for specific command help`);
                        break;
                    default:
                        botSays("💬 Welcome to the general chat! Use /help to see available commands.");
                }
            });
        });

        // Category collapse/expand functionality
        const categories = document.querySelectorAll('.category-header');
        categories.forEach(category => {
            category.addEventListener('click', () => {
                const arrow = category.querySelector('.category-arrow');
                const channels = category.parentElement.querySelectorAll('.channel-item');
                
                if (arrow.textContent === '▼') {
                    arrow.textContent = '▶';
                    channels.forEach(channel => channel.style.display = 'none');
                } else {
                    arrow.textContent = '▼';
                    channels.forEach(channel => channel.style.display = 'flex');
                }
            });
        });

    } catch (error) {
        console.error('Failed to initialize application:', error);
    }
});