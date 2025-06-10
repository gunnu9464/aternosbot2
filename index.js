require('dotenv').config();
const mineflayer = require('mineflayer');
const express = require('express');

const app = express();
const PORT = process.env.PORT || 3000;

// Web endpoint for UptimeRobot/Render
app.get('/', (_req, res) => {
  res.send('Aternos Bot is running!');
});
app.listen(PORT, () => {
  console.log(`Web server running on port ${PORT}`);
});

// Bot config
const bot = mineflayer.createBot({
  host: process.env.SERVER_HOST, // e.g., Nerddddsmp.aternos.me
  port: parseInt(process.env.SERVER_PORT) || 25565,
  username: process.env.MC_EMAIL, // e.g., itssteve
  auth: process.env.AUTH || 'offline', // 'offline' for cracked servers
  version: process.env.MC_VERSION || false // auto
});

// Movement logic
function randomMovement() {
  const actions = ['forward', 'back', 'left', 'right', 'jump', 'sneak', 'stop'];
  const action = actions[Math.floor(Math.random() * actions.length)];

  // Reset movement
  bot.setControlState('forward', false);
  bot.setControlState('back', false);
  bot.setControlState('left', false);
  bot.setControlState('right', false);
  bot.setControlState('jump', false);
  bot.setControlState('sneak', false);

  switch (action) {
    case 'forward':
    case 'back':
    case 'left':
    case 'right':
      bot.setControlState(action, true);
      break;
    case 'jump':
      bot.setControlState('jump', true);
      setTimeout(() => bot.setControlState('jump', false), 500);
      break;
    case 'sneak':
      bot.setControlState('sneak', true);
      setTimeout(() => bot.setControlState('sneak', false), 2000);
      break;
    case 'stop':
    default:
      // all movement reset above
      break;
  }
}

// Random move every 4-8 seconds
bot.on('spawn', () => {
  setInterval(randomMovement, 4000 + Math.random() * 4000);
  bot.chat('Hello! itssteve is online to keep the server alive.');
});

bot.on('error', err => console.error('Bot error:', err));
bot.on('end', () => {
  console.log('Bot disconnected, retrying in 10s...');
  setTimeout(() => bot.connect(), 10000);
});
