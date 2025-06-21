index.js:

javascript
const { default: makeWASocket, useSingleFileAuthState } = require('@whiskeysockets/baileys');
const { Boom } = require('@hapi/boom');
const fs = require('fs');
const { join } = require('path');

const { state, saveState } = useSingleFileAuthState(join(__dirname, 'auth_info.json'));

async function startBot() {
  const sock = makeWASocket({
    auth: state,
    printQRInTerminal: true
  });

  sock.ev.on('creds.update', saveState);

  sock.ev.on('messages.upsert', async ({ messages, type }) => {
    const msg = messages[0];
    if (!msg.message || msg.key.fromMe) return;

    const text = msg.message.conversation || msg.message.extendedTextMessage?.text || '';

    if (text.toLowerCase() === 'hi') {
      await sock.sendMessage(msg.key.remoteJid, { text: 'Hello! I am your bot.' });
    }
  });
}

startBot();
