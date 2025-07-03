// the shitty discord api cuz why not (not rlly an api)

const express = require('express');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// not really an api lol
const DISCORD_BOT_TOKEN = process.env.DISCORD_TOKEN;
const DISCORD_API_BASE_URL = 'https://discord.com/api/v10';
const LANYARD_API_BASE_URL = 'https://api.lanyard.rest/v1/users/';

if (!DISCORD_BOT_TOKEN) {
    console.error('missing bot token lil bro');
    process.exit(1);
}

/**
 * @param {string} endpoint - API endpoint
 * @returns {Promise<Object>} - Parsed JSON
 */
async function fetchFromDiscord(endpoint) {
    try {
        const response = await fetch(`${DISCORD_API_BASE_URL}${endpoint}`, {
            headers: {
                'Authorization': `Bot ${DISCORD_BOT_TOKEN}`,
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Discord API Error ${response.status}: ${errorText}`);
        }

        return await response.json();
    } catch (err) {
        console.error(`Error fetching from Discord API (${endpoint}):`, err.message);
        throw err;
    }
}

/**
 * @route GET /v0/user/userid=:userId
 * @desc userdata 
 */
app.get('/v0/user/userid=:userId', async (req, res) => {
    const { userId } = req.params;

    try {
        const userData = await fetchFromDiscord(`/users/${userId}`);

        let lanyardData = null;
        try {
            const response = await fetch(`${LANYARD_API_BASE_URL}${userId}`);
            if (response.ok) {
                const json = await response.json();
                if (json.success) {
                    lanyardData = json.data;
                }
            }
        } catch (err) {
            console.warn(`Lanyard fetch failed for ${userId}:`, err.message);
        }

        const userProfile = {
            userId: userData.id,
            username: userData.username,
            discriminator: userData.discriminator,
            globalName: userData.global_name || null,
            avatarUrl: userData.avatar ? `https://cdn.discordapp.com/avatars/${userData.id}/${userData.avatar}.png` : null,
            bannerUrl: userData.banner ? `https://cdn.discordapp.com/banners/${userData.id}/${userData.banner}.png` : null,
            pronouns: userData.pronouns || null,
            bio: userData.bio || null,
            accentColor: userData.accent_color || null,
            flags: userData.flags || null,
            publicFlags: userData.public_flags || null,
            premiumType: userData.premium_type || null,
            avatarDecorationData: userData.avatar_decoration_data || null,
            system: userData.system || null,
            bot: userData.bot || null,
            // lanyard stuff
            badges: lanyardData?.badges || null,
            premiumSince: lanyardData?.premium_since || null,
            mfaEnabled: lanyardData?.mfa_enabled || null,
            clan: lanyardData?.clan || null,
            lanyard: lanyardData || null,
            accurate: true,
        };

        res.json(userProfile);
    } catch (err) {
        console.error('Error getting user data:', err.message);
        res.status(500).json({ error: 'Failed to retrieve user information (lmao, i need to fix ts).' });
    }
});

/**
 * @route GET /v0/bot/guilds
 * @desc gets the guilds where the bot is 
 */
app.get('/v0/bot/guilds', async (req, res) => {
    try {
        const guilds = await fetchFromDiscord('/users/@me/guilds');
        res.json(guilds);
    } catch (err) {
        console.error('Error fetching guilds:', err.message);
        res.status(500).json({ error: 'Failed to retrieve bot guilds (lmao).' });
    }
});

// starts the server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
    console.log(`Try: GET /v0/user/userid=<user_id>`);
    console.log(`     GET /v0/bot/guilds`);
});
