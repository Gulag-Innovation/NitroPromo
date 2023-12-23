const { Client, GatewayIntentBits } = require('discord.js');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const axios = require('axios');
const { promisify } = require('util');
require('dotenv').config();

const headers = {
    'authority': 'api.discord.gx.games',
    'accept': '/',
    'accept-language': 'en-GB,en-US;q=0.9,en;q=0.8',
    'content-type': 'application/json',
    'origin': 'https://www.opera.com/',
    'referer': 'https://www.opera.com/',
    'sec-ch-ua': '"Opera GX";v="105", "Chromium";v="119", "Not?A_Brand";v="24"',
    'sec-ch-ua-mobile': '?0',
    'sec-ch-ua-platform': '"Windows"',
    'sec-fetch-dest': 'empty',
    'sec-fetch-mode': 'cors',
    'sec-fetch-site': 'cross-site',
    'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36 OPR/105.0.0.0',
};

const jsonData = {
    'partnerUserId': process.env.PARTNER_USER_ID,
};

const sleep = promisify(setTimeout);

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers,
    ],
});

const commands = [
    {
        name: 'gen',
        description: 'Generates A Discord Nitro Promotional Code',
    },
];

const rest = new REST({ version: '9' }).setToken(process.env.BOT_TOKEN);

(async () => {
    try {
        console.log('[Action Log] Bot Started | Refreshing Application (/) Command(s)');

        await rest.put(
            Routes.applicationCommands(process.env.CLIENT_ID),
            { body: commands },
        );

        for (const guild of client.guilds.cache.values()) {
            await rest.put(
                Routes.applicationGuildCommands(process.env.CLIENT_ID, guild.id),
                { body: commands },
            );
        }

        console.log('[Action Log] Successfully Reloaded Application (/) Command(s)');
    } catch (error) {
        console.error(error);
    }
})();

client.on('interactionCreate', async (interaction) => {
    if (!interaction.isCommand()) return;

    const { commandName } = interaction;

    if (commandName === 'gen') {
        try {
            const response = await axios.post('https://api.discord.gx.games/v1/direct-fulfillment', jsonData, { headers });
            const data = response.data;

            await interaction.reply({
                embeds: [{
                    title: ' 🎉🥳 Discord Nitro Promo Code Successfully Generated! 🥳🎉',
                    description: `https://discord.com/billing/partner-promotions/1180231712274387115/${data.token}`,
                    color: 0x3498db,
                }],
                ephemeral: true,
            });
        } catch (error) {
            console.error('[Action Log] An Error Has Occurred: ', error.message);
            await interaction.reply({
                embeds: [{
                    title: '[Action Log] An Error Has Occurred: ',
                    description: error.message,
                    color: 0xff0000,
                }],
                ephemeral: true,
            });
        }
    }
});

client.login(process.env.BOT_TOKEN);
