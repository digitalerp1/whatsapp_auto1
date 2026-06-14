const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const express = require('express');

const app = express();
const port = process.env.PORT || 3000;

// Render ke ping checks ke liye basic route
app.get('/', (req, res) => {
    res.send('WhatsApp Bot is Running perfectly via Docker!');
});

app.listen(port, () => {
    console.log(`Web server listening on port ${port}`);
});

// WhatsApp Client configuration with aggressive flags to save RAM on free tier
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
            '--single-process', // RAM optimize karne ke liye
            '--disable-gpu'
        ],
        // Docker image me Chrome isi path par install hota hai
        executablePath: '/usr/bin/google-chrome-stable'
    }
});

// Terminal logs me QR code print karne ke liye
client.on('qr', (qr) => {
    console.log('================================================================');
    console.log('👉 SCAN THIS QR CODE IN YOUR WHATSAPP TO LINK THE BOT 👈');
    console.log('================================================================');
    qrcode.generate(qr, { small: true });
});

client.on('ready', () => {
    console.log('🚀 SUCCESS: WhatsApp Client is ready and connected!');
});

// Basic Auto-Reply logic
client.on('message', async (msg) => {
    if (msg.body.toLowerCase() === 'ping') {
        await msg.reply('pong');
    }
    if (msg.body.toLowerCase() === 'hello') {
        await msg.reply('Hi! Main Render Cloud Server (Docker Env) se bol raha hoon. System online hai!');
    }
});

client.initialize();
