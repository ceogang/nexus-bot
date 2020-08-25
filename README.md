# Nexus Bot
[![License](http://img.shields.io/:license-mit-blue.svg)](http://doge.mit-license.org)  
Discord has separation into text and voice channels, with no option to make combined.  
The purpose of this bot is to create text channel, which is visible only to those who are connected to the linked voice channel.  
Each time the last user leaves the voice channel, all non-pinned messages in linked text channel will be deleted. 

## Want to use at your server?
[![Discord Bots](https://top.gg/api/widget/709876107213537351.svg)](https://top.gg/bot/709876107213537351)  
You can use the bot via this [link](https://discord.com/oauth2/authorize?client_id=709876107213537351&permissions=268510224&scope=bot).

## How to use
You don't need to set up anything - once you join a voice channel, a new category with the linked text channel will be created.  
Each time user joins/leaves voice channel, he will get/lose rights to see the linked text channel.  
Feel free to rename categories and text channels as you wish - it will not affect bot.  
All linked text channels are initially created under the specific category, however, you can move them wherever you like, bot still will be able to process it.
Linked channel is not created for the voice channel, marked as AFK.
When the last user leaves the voice channel, messages in the linked text channel will be deleted.  
If you don't want specific messages to be deleted - you can pin them, and they will remain.

## Known issues
- Due to the fact that Discord bots are not allowed to change permissions for admins, server admins will still see all text channels (IMHO, not even an issue, but still worth mentioning).  
- Messages in the channel can be cached in the app, so the user can still see it even when it's cleared on the server. These messages will disappear after Discord app reboot. For now, I didn't see any solution to fix it - if you know any workaround, please post it in issues.

### If you found a bug
If you have any issue with the bot functionality, feel free to post an issue in this repo - for now, I am intended to maintain this app as long as I don't feel it is stable enough.

### Need any adjustments?
If you feel some really cool feature is missing, or you want to make some minor tweaks just for your own quality of life - feel free to either post an issue in the repo or make a fork and adjust it yourself as you see fit.
Please bear in mind: my intentions are to leave this bot single-purpose, meaning I won't add features which are not related to the idea of creating combined voice-text channels.

## Environment setup
1. Install NodeJS
2. Clone repo
3. Fetch all required npm packages using ```npm install```
4. Configure .env (use .env.sample as a reference if needed)
5. After any changes in code, in cmd call ```tsc```
6. Start the app by using ```nodemon build/main.js``` or debug it with your IDE
