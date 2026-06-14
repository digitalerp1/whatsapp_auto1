const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const express = require('express');

const app = express();
const port = process.env.PORT || 3000;

// Dummy HTTP Server Render ke liye taaki UptimeRobot isko jagakar rakhe
app.get('/', (req, res) => {
    res.send('WhatsApp Bot is Running Nano 24/7!');
});

app.listen(port, () => {
    console.log(`Web server listening on port ${port}`);
});

// WhatsApp Client Setup with Chrome Flags for Render
const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: {
        headless: true,
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage',
            '--disable-accelerated-2d-canvas',
            '--no-first-run',
            '--no-zygote',
            '--single-process', // RAM bachane ke liye
            '--disable-gpu'
        ],
        // Render par Google Chrome ka default path yehi hota hai
        executablePath: process.env.PUPPETEER_EXECUTABLE_PATH || '/usr/bin/google-chrome-stable'
    }
});

// QR Code generation (Render ke Logs me dikhega)
client.on('qr', (qr) => {
    console.log('--- SCAN THIS QR CODE IN YOUR WHATSAPP ---');
    qrcode.generate(qr, { small: true });
});

client.on('ready', () => {
    console.log('WhatsApp Client is ready and connected!');
});

// Ek simple Auto-Reply Command testing ke liye
client.on('message', async (msg) => {
    if (msg.body.toLowerCase() === 'ping') {
        await msg.reply('pong');
    }
    if (msg.body.toLowerCase() === 'hello') {
        await msg.reply('Hi! Main Render Cloud Server se bol raha hoon. Bot successfully active hai! Bot powered by My Zini.');
    }
});

client.initialize();
