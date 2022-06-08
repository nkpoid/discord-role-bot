import { Client } from "discord.js";
import ConfigMap from "./config";

const client = new Client({
  intents: ["GUILDS", "GUILD_MESSAGES", "GUILD_MESSAGE_REACTIONS"],
  partials: ["MESSAGE", "CHANNEL", "REACTION", "USER"],
});

client.once("ready", async () => {
  for (const config of ConfigMap) {
    const channel = client.channels.cache.get(config.message_channel_id);
    if (channel?.isText()) {
      const message = await channel.messages.fetch(config.message_id);
      for (const map of config.reaction_role_maps) {
        message.react(map.reaction);
      }
    }
  }

  console.log("ready!");
});

client.on("messageReactionAdd", async ({ message, emoji }, user) => {
  if (user.bot) return;

  for (const config of ConfigMap) {
    if (message.id === config.message_id) {
      const { guild } = message;
      const member = await guild?.members?.fetch(user.id);

      for (const map of config.reaction_role_maps) {
        if (emoji.name === map.reaction || emoji.id === map.reaction) {
          for (const role_id of map.role_ids) {
            await member?.roles.add(role_id);
            console.log(`role added to ${member?.nickname}`);
          }
        }
      }
    }
  }
});

client.on("messageReactionRemove", async ({ message, emoji }, user) => {
  if (user.bot) return;

  for (const config of ConfigMap) {
    if (message.id === config.message_id) {
      const { guild } = message;
      const member = await guild?.members?.fetch(user.id);

      for (const map of config.reaction_role_maps) {
        if (emoji.name === map.reaction || emoji.id === map.reaction) {
          for (const role_id of map.role_ids) {
            await member?.roles.remove(role_id);
            console.log(`role removed from ${member?.nickname}`);
          }
        }
      }
    }
  }
});

client.login(process.env.DISCORD_BOT_TOKEN);
