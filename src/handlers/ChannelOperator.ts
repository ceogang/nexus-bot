import { VoiceState, TextChannel, GuildMember, Collection, Message, VoiceChannel, Guild, CategoryChannel } from "discord.js";
import { ChannelType } from "../enums/ChannelType"
import { EnvType } from "../enums/EnvType";
import { MongoConnector } from "../db/MongoConnector";
import { TextChannelMap } from "../entities/TextChannelMap";
import { Config } from "../config";
import { Logger } from "./Logger";
import { TextCategoryMap } from "../entities/TextCategoryMap";

export class ChannelOperator {
	private mongoConnector: MongoConnector
	private config: Config
	private logger: Logger

	private readonly onDebug = process.env.NODE_ENV === EnvType.Debug;

	constructor(mongoConnector: MongoConnector, config: Config, logger: Logger) {
		this.mongoConnector = mongoConnector
		this.config = config
		this.logger = logger
	}

	public async handleChannelJoin(newVoiceState: VoiceState) {
		let user = newVoiceState.member
		let guildId = newVoiceState.guild.id
		let channelId = newVoiceState.channelID as string
		if(channelId === newVoiceState.guild.afkChannelID) return
		let textChannelId = await this.mongoConnector.textChannelRepository.getId(guildId, channelId)
		let textChannel = this.resolve(newVoiceState, textChannelId)

		if (textChannel !== null) {
			this.showHideTextChannel(textChannel, user, true)
			if (this.onDebug) textChannel?.send(`${this.resolveUsername(user)} joined channel ${textChannel.name}`) // test purposes only
		}
		else {
			this.createTextChannel(newVoiceState)
		}
	}

	public async handleChannelLeave(oldVoiceState: VoiceState) {
		let user = oldVoiceState.member
		let guildId = oldVoiceState.guild.id
		let channelID = oldVoiceState.channelID as string
		let textChannelId = await this.mongoConnector.textChannelRepository.getId(guildId, channelID)

		if (textChannelId !== undefined) {
			let textChannel = this.resolve(oldVoiceState, textChannelId)
			this.showHideTextChannel(textChannel, user, false)

			if (this.onDebug) textChannel.send(`${this.resolveUsername(user)} has left channel ${textChannel.name}`) // test purposes only

			let voiceChannel = oldVoiceState.channel
			if (voiceChannel?.members.size !== undefined && voiceChannel?.members.size <= 0) {
				this.clearTextChannel(textChannel, voiceChannel)
			}
		}
	}

	private async createTextChannel(newVoiceState: VoiceState) {
		let user = newVoiceState.member
		let voiceChannel = newVoiceState.channel
		let guild = newVoiceState.channel?.guild
		let channelId = newVoiceState.channelID as string
		if (guild !== null && guild !== undefined) {
			let parentId = await this.resolveTextCategory(guild)

			if (voiceChannel !== null) newVoiceState.channel?.guild.channels.create(voiceChannel.name + '-text', {
				permissionOverwrites: [{ id: guild.id, deny: ['VIEW_CHANNEL'] }],
				type: ChannelType.text,
				parent: parentId as string,
				position: voiceChannel.position + 1
			})
				.then(ch => {
					ch.overwritePermissions([
						{
							id: ch.guild.id,
							deny: ['VIEW_CHANNEL'],
						},
						{
							id: user !== null ? user.id : "undefined",
							allow: ['VIEW_CHANNEL'],
						},
					]);
					let textChannelMap: TextChannelMap = { guildId: ch.guild.id, voiceChannelId: channelId, textChannelId: ch.id }
					this.mongoConnector.textChannelRepository.add(textChannelMap)
					this.greet(ch, voiceChannel)


					if (this.onDebug) ch.send(`channel created for ${this.resolveUsername(user)}`); // test purposes only
				});
		}
	}

	private resolve(voiceState: VoiceState, id: string): TextChannel {
		return voiceState.guild.channels.resolve(id) as TextChannel
	}

	private resolveUsername(user: GuildMember | null): string {
		return (user?.nickname !== undefined ? user?.nickname : user?.displayName) as string
	}

	private showHideTextChannel(textChannel: TextChannel, user: GuildMember | null, value: boolean) {
		if (user !== null && textChannel !== null) textChannel.updateOverwrite(user, { VIEW_CHANNEL: value })
	}

	private async clearTextChannel(textChannel: TextChannel, voiceChannel: VoiceChannel) {
		let fetched: Collection<string, Message>;
		do {
			fetched = await textChannel.messages.fetch({ limit: 100 });
			textChannel.bulkDelete(fetched);
		}
		while (fetched.size >= 2)
		if (this.onDebug) textChannel.send("all messages deleted")
		this.greet(textChannel, voiceChannel)
	}

	private async greet(textChannel: TextChannel, voiceChannel: VoiceChannel | null) {
		if (voiceChannel !== null) {
			let intro = await this.mongoConnector.introRepository.get(voiceChannel.guild.id, voiceChannel.id)

			if (this.isNotNullOrEmpty(intro?.Description)) textChannel.send(intro?.Description)
			if (this.isNotNullOrEmpty(intro?.ImageUrl)) textChannel.send(intro?.ImageUrl)
			if (this.isNotNullOrEmpty(intro?.AdditionalUrl)) textChannel.send(intro?.AdditionalUrl)
		}
	}

	private async resolveTextCategory(guild: Guild): Promise<string> {
		let textCategoryId = await this.mongoConnector.textCategoryRepository.getId(guild.id)
		if (textCategoryId === undefined || textCategoryId === null) {
			await this.createCategory(guild)
			textCategoryId = await this.mongoConnector.textCategoryRepository.getId(guild.id)
		}
		return textCategoryId
	}

	private async createCategory(guild: Guild): Promise<CategoryChannel> {
		let channelCreationPromise = guild.channels.create(this.config.categoryName, {
			type: ChannelType.category
		})

		channelCreationPromise
			.then((category) => {
				this.logger.logEvent
				let textCategoryMap: TextCategoryMap = { guildId: category.guild.id, textCategoryId: category.id }
				this.mongoConnector.textCategoryRepository.add(textCategoryMap)
			})
			.catch(this.logger.logError)

		return channelCreationPromise
	}

	private isNotNullOrEmpty(target: string | undefined | null): boolean {
		return target !== undefined && target !== null && target !== ''
	}
}