import { Message, MessageEmbed } from "discord.js";
import { Config } from "../config";
import { BotCommand } from "../enums/BotCommand";

export class InfoHandlers {
    private config: Config

    constructor(config: Config) {
        this.config = config
    }

    public handleHelpCall(message: Message) {
        if (message.content === this.config.prefix + BotCommand.Help) {
            this.giveHelp(message)
            return
        }
    }

    private giveHelp(message: Message) {
        let embed = new MessageEmbed()
            .setTitle("Nexus Bot")
            .setDescription(`Discord bot to link text channel to each voice channel.`)
            .setColor("#0099ff")
            .setAuthor('Nexus', this.config.img, 'https://github.com/andretkachenko/nexus-bot')
            .setThumbnail(this.config.img)
            .addField("**How to use**",
            `You don't' need to set up anything - once you join a voice channel, a new category with the linked text channel will be created.
            Each time user joins/leaves voice channel, he will get/lose rights to see the linked text channel.
            Feel free to rename categories and text channels as you wish - it will not affect bot.`)
            .addField("**Want to use it on your server?**", "Follow this link: https://github.com/andretkachenko/nexus-bot#want-to-use-at-your-server")
            .addField("**Any issues or missing feature?**", "You can suggest it via https://github.com/andretkachenko/nexus-bot/issues")
            .setFooter(`Nexus bot`);
        message.channel.send(embed)
    }
}