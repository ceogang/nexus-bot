import { MongoClient } from "mongodb"
import { TextChannelMap } from "../entities"
import { Logger } from "../Logger"
import { Repository } from "./Repository"

export class TextChannelMapsRepository extends Repository<TextChannelMap> {
    constructor(logger: Logger, client: MongoClient, dbName: string) {
        super(logger, client, dbName)
    }

    public async getTextChannelMap(guildId: string, channelId: string): Promise<TextChannelMap> {
        return super.getFirst({ guildId: guildId, voiceChannelId: channelId })
    }

    public async delete(guildId: string, voiceChannelId: string): Promise<boolean> {
        return super.deleteOne({ guildId: guildId, voiceChannelId: voiceChannelId })
    }

    public async setPreserveOption(textChannelMap: TextChannelMap): Promise<boolean> {
        return super.update({
            guildId: textChannelMap.guildId,
            voiceChannelId: textChannelMap.voiceChannelId
        }, {
            $set: {
                preserve: textChannelMap.preserve
            }
        })
    }
}