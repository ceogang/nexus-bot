# Nexus Bot
[![License](http://img.shields.io/:license-mit-blue.svg)](http://doge.mit-license.org)  [![Discord Bots](https://top.gg/api/widget/status/709876107213537351.svg?noavatar=true)](https://top.gg/bot/709876107213537351)  
Discord has separation into text and voice channels, with no option to make combined.  
The purpose of this bot is to create text channel, which is visible only to those who are connected to the linked voice channel.  
Each time the last user leaves the voice channel, all non-pinned messages in linked text channel will be deleted. 

## Want to use at your server?
[![Invite bot to your server](https://i.imgur.com/MgQZMpT.jpg)](https://discord.com/api/oauth2/authorize?client_id=709876107213537351&permissions=53955783696&scope=bot%20applications.commands)

## How to use
You don't need to set up anything - once you join a voice channel (excluding inactive channel), a new category with the linked text channel will be created.  
Each time user joins/leaves voice channel, he will get/lose rights to see the linked text channel.  
Feel free to rename/move categories and text channels as you wish - it will not affect bot.
When the last user leaves the voice channel, messages in the linked text channel will be deleted (excluding pinned messages).

For existing commands either check [wiki](https://github.com/andretkachenko/nexus-bot/wiki/Existing-commands) or use bot's slash commands on your server.

## If you found a bug
If you have any issue with the bot functionality, feel free to post an issue in this repo ([check known issues first](https://github.com/andretkachenko/nexus-bot/wiki/Known-issues)) - for now, I am intended to maintain this app as long as I don't feel it is stable enough.

## Need any adjustments?
If you feel some cool feature is missing, or you want to make some minor tweaks just for your quality of life - feel free to either post an issue in the repo or make a fork and adjust it yourself as you see fit.  
Please bear in mind: I intend to leave this bot single-purpose, meaning I won't add features which are not related to the idea of creating combined voice-text channels.

## Step-by-step guide (self-host)
For this setup, the only requirements you need are `docker` and `docker-compose`.
### Clone the repo
Clone this repository

### Build and run the containers
```bash
docker-compose up --build -d
```

### Setup mongo user
Inside the mongo container, which should be running:
```bash
docker exec -it nexus-bot_mongo_1 mongo
```
Create the user, and store the `PASSWORD` somewhere.
```javascript
use admin
db.createUser({ user: "admin" , pwd: <<PASSWORD>>, roles: ["readWriteAnyDatabase"]})
```

### Complete the bot configuration file
#### Take info from discord developer portal
- Create an application on discord developers portal [here](https://discord.com/developers/applications) and get the `application id` and the the `client_id`
- Create an associated bot and generate and save the `token`
#### Create the `.env` file from the sample
```bash
cp .env.sample .env
```
You should then change the values of these keys: `APPLICATION_ID`, `TOKEN`,`'NODE_ENV` (from `DEBUG` to `PRODUCTION`), `MONGO_PWD` (with the `PASSWORD` defined above)
#### Prepare a link to import the bot
This is the template of the link
https://discord.com/api/oauth2/authorize?client_id={YOUR_CLIENT_ID}&permissions=53955783696&scope=bot%20applications.commands

https://discord.com/api/oauth2/authorize?client_id=980522901528784940&permissions=53955783696&scope=bot%20applications.commands
### Redeploy
```bash
docker-compose up --build -d
```
