const { Client } = require('discord.js');
const fs = require('fs');
require('dotenv').config();

const client = new Client({ intents: [] }); // Initialize client without intents as we won't be listening to events

const amount = 2000; // Fixed amount
const filePath = './used_once.json'; // Path to track if the script has been run

client.once('ready', async () => {
    // Ensure the command is only run once
    if (fs.existsSync(filePath)) {
        const data = JSON.parse(fs.readFileSync(filePath));
        if (data.used) {
            console.log("This script has already been run.");
            process.exit(); // Exit the script
        }
    }

    // Access the guild and iterate over all members
    const guild = client.guilds.cache.get('YOUR_GUILD_ID'); // Replace with your guild ID

    if (!guild) {
        console.error('Guild not found.');
        process.exit(); // Exit the script
    }

    try {
        // Iterate over all members and set their money
        guild.members.cache.forEach(async member => {
            if (!member.user.bot) {
                await client.eco.setMoney(member.user.id, amount);
            }
        });

        // Mark the script as run
        fs.writeFileSync(filePath, JSON.stringify({ used: true }));

        console.log(`All members have been given $${amount}.`);
    } catch (error) {
        console.error('An error occurred:', error);
    } finally {
        client.destroy(); // Destroy the client to close the connection
    }
});

// Login to Discord
client.login(process.env.BOT_TOKEN);
