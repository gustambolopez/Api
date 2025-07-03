## The bread discord api
ts not really an api but idc
why i made it? idk
## can you use it?
yeah but give credit also the status thingy only works if youre on lanyard server (noooooooooooooo)
## Monkey see monkey do
so if you wanna use it this an example

```js
https://thebreadapi.vercel.app/v0/user/userid=958708562035638362
```
or for the guilds the bot is in (no guilds idk why i even included that)
```js
https://thebreadapi.vercel.app/v0/bot/guilds
```
i added way more stuff but im to lazy to put an example so you will have to look on api endpoints
## hosting in local
use 
```bash
git clone https://github.com/gustambolopez/Api.git
```
then
```bash
npm install
node serverjs
```
The bread api should be listening in port 3000
## Credits
- [s16dih](https://github.com/gustambolopez)
## API endpoints
This api endpoints are available:
/v0/user/userid=:userId
/v0/bot/guilds
/v0/guilds/:guildId
/v0/channels/:channelId
/v0/channels/:channelId/messages
/v0/channels/:channelId/messages/:messageId
/v0/guilds/:guildId/members/:userId
/v0/guilds/:guildId/members
/v0/guilds/:guildId/roles
/v0/guilds/:guildId/emojis
/v0/applications/:applicationId/commands
/v0/applications/:applicationId/guilds/:guildId/commands

## why not?
why dont you make your own api like lanyard? i can but i would need all the users to join the server for it to work 
