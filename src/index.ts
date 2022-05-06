import { Client } from "discord.js";
import { configMap } from "./config";

const client = new Client({
  intents: ["GUILDS", "GUILD_MESSAGES", "GUILD_MESSAGE_REACTIONS"],
  partials: ["MESSAGE", "CHANNEL", "REACTION", "USER"],
});

client.once("ready", async () => {
  for (const config of configMap) {
    const channel = client.channels.cache.get(config.message_channel_id);
    if (channel?.isText()) {
      const message = await channel.messages.fetch(config.message_id);
      message.react(config.reaction_id);
      console.log(
        `reacted Emoji<${config.reaction_id}> for Message<${config.message_id}>`
      );
    }
  }

  console.log("ready!");
});

client.on("messageReactionAdd", async ({ message, emoji }, user) => {
  if (user.bot) return;

  for (const config of configMap) {
    if (message.id === config.message_id && emoji.id === config.reaction_id) {
      const { guild } = message;
      const member = await guild?.members?.fetch(user.id);

      await member?.roles.add(config.role_id);
      console.log(`role added to ${member?.nickname}`);
    }
  }
});

client.on("messageReactionRemove", async ({ message, emoji }, user) => {
  for (const config of configMap) {
    if (message.id === config.message_id && emoji.id === config.reaction_id) {
      const { guild } = message;
      const member = await guild?.members?.fetch(user.id);

      await member?.roles.remove(config.role_id);
      console.log(`role removed from ${member?.nickname}`);
    }
  }
});

client.login(process.env.DISCORD_BOT_TOKEN);
