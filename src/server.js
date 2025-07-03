// the shitty discord api cuz why not (not rlly an api)

const express = require('express');
require('dotenv').config(); 

const app = express();
const PORT = process.env.PORT || 3000;

// not really an api lol
const DISCORD_TOKEN = process.env.DISCORD_TOKEN;
const DISCORD_API = 'https://discord.com/api/v10';
const LANYARD_API = 'https://api.lanyard.rest/v1/users/';

if (!DISCORD_TOKEN) {
    console.error('missing bot token lil bro');
    process.exit(1);
}

app.use(express.json());


const fetchFromDiscord = async (endpoint) => {
    const res = await fetch(`${DISCORD_API}${endpoint}`, {
        headers: {
            Authorization: `Bot ${DISCORD_TOKEN}`,
            'Content-Type': 'application/json',
        },
    });

    if (!res.ok) {
        const err = await res.text();
        throw new Error(err || 'api error');
    }

    return res.json();
};

app.get('/v0/user/userid=:userId', async (req, res) => {
    const { userId } = req.params;

    try {
        const userData = await fetchFromDiscord(`/users/${userId}`);
        let lanyard = null;

        try {
            const r = await fetch(`${LANYARD_API}${userId}`);
            const j = await r.json();
            lanyard = j?.data || null;
        } catch (_) {

        }
 
        res.json({
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
            // lanyard stuff and pay to have more lanyard stuff
            badges: lanyard?.badges || null,
            premiumSince: lanyard?.premium_since || null,
            mfaEnabled: lanyard?.mfa_enabled || null,
            clan: lanyard?.clan || null,
            lanyard: lanyard || null, 
            accurate: true,
            status: lanyard?.discord_status || 'unknown',
            activities: lanyard?.activities || [],
        });
    } catch (e) {
        res.status(500).json({ error: 'Could not get user', details: e.message });
    }
});

// the bot guilds
app.get('/v0/bot/guilds', async (_, res) => {
    try {
        const data = await fetchFromDiscord('/users/@me/guilds');
        res.json(data);
    } catch (e) {
        res.status(500).json({ error: 'Could not get guilds', details: e.message });
    }
});

// specific details of a guild 
app.get('/v0/guilds/:guildId', async (req, res) => {
    try {
        const data = await fetchFromDiscord(`/guilds/${req.params.guildId}`);
        res.json(data);
    } catch (e) {
        res.status(500).json({ error: 'failed to fetch the guild', details: e.message });
    }
});

// channel info
app.get('/v0/channels/:channelId', async (req, res) => {
    try {
        const data = await fetchFromDiscord(`/channels/${req.params.channelId}`);
        res.json(data);
    } catch (e) {
        res.status(500).json({ error: 'failed to get the channel', details: e.message });
    }
});

// info of a channel messages
app.get('/v0/channels/:channelId/messages', async (req, res) => {
    const { channelId } = req.params;
    const qs = new URLSearchParams(req.query).toString();

    try {
        const data = await fetchFromDiscord(`/channels/${channelId}/messages${qs ? '?' + qs : ''}`);
        res.json(data);
    } catch (e) {
        res.status(500).json({ error: 'get messages failed', details: e.message });
    }
});

// info of a single messgae
app.get('/v0/channels/:channelId/messages/:messageId', async (req, res) => {
    const { channelId, messageId } = req.params;

    try {
        const data = await fetchFromDiscord(`/channels/${channelId}/messages/${messageId}`);
        res.json(data);
    } catch (e) {
        res.status(500).json({ error: 'message couldnt be found', details: e.message });
    }
});

// specific guild member
app.get('/v0/guilds/:guildId/members/:userId', async (req, res) => {
    const { guildId, userId } = req.params;

    try {
        const data = await fetchFromDiscord(`/guilds/${guildId}/members/${userId}`);
        res.json(data);
    } catch (e) {
        res.status(500).json({ error: 'member not found', details: e.message });
    }
});

// member list of a guild plus limits
app.get('/v0/guilds/:guildId/members', async (req, res) => {
    const { guildId } = req.params;
    const qs = new URLSearchParams(req.query).toString();

    try {
        const data = await fetchFromDiscord(`/guilds/${guildId}/members${qs ? '?' + qs : ''}`);
        res.json(data);
    } catch (e) {
        res.status(500).json({ error: 'Member list fetch failed', details: e.message });
    }
});

// specific roles
app.get('/v0/guilds/:guildId/roles', async (req, res) => {
    try {
        const data = await fetchFromDiscord(`/guilds/${req.params.guildId}/roles`);
        res.json(data);
    } catch (e) {
        res.status(500).json({ error: 'cannot get role', details: e.message });
    }
});

// List emojis in a guild
app.get('/v0/guilds/:guildId/emojis', async (req, res) => {
    try {
        const data = await fetchFromDiscord(`/guilds/${req.params.guildId}/emojis`);
        res.json(data);
    } catch (e) {
        res.status(500).json({ error: 'cannot get emojis', details: e.message });
    }
});

// command list for a bot
app.get('/v0/applications/:applicationId/commands', async (req, res) => {
    try {
        const data = await fetchFromDiscord(`/applications/${req.params.applicationId}/commands`);
        res.json(data);
    } catch (e) {
        res.status(500).json({ error: 'cannot get bot commands', details: e.message });
    }
});

// guild specific commands
app.get('/v0/applications/:applicationId/guilds/:guildId/commands', async (req, res) => {
    const { applicationId, guildId } = req.params;

    try {
        const data = await fetchFromDiscord(`/applications/${applicationId}/guilds/${guildId}/commands`);
        res.json(data);
    } catch (e) {
        res.status(500).json({ error: 'cannot get guild commands ', details: e.message });
    }
});

// start the server
app.listen(PORT, () => {
    console.log(`Server listening on http://localhost:${PORT}`);
});
