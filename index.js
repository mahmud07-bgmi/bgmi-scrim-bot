require("dotenv").config();

const express = require("express");
const { Client, GatewayIntentBits, PermissionsBitField } = require("discord.js");

const app = express();
const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.send("BGMI Scrim Bot is running 🚀");
});

app.listen(PORT, () => {
  console.log("Web server running on port " + PORT);
});

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

let slots = Array(25).fill("EMPTY");

client.once("ready", () => {
  console.log(`BGMI Scrim Bot Online: ${client.user.tag}`);
});

client.on("messageCreate", (message) => {
  if (message.author.bot) return;

  const args = message.content.trim().split(" ");
  const command = args[0].toLowerCase();

  if (command === "!help") {
    return message.channel.send("🏆 **BGMI SCRIM BOT**\n`!register TEAM_NAME`\n`!slots`\n`!remove SLOT_NO`\n`!reset`");
  }

  if (command === "!register") {
    const teamName = args.slice(1).join(" ").toUpperCase();
    if (!teamName) return message.channel.send("Team name likho: `!register TEAM XTREME`");

    if (slots.includes(teamName)) return message.channel.send("Ye team already registered hai ✅");

    const emptyIndex = slots.findIndex(slot => slot === "EMPTY");
    if (emptyIndex === -1) return message.channel.send("All slots full ❌");

    slots[emptyIndex] = teamName;
    return message.channel.send(`✅ Registered: **${teamName}**\n🎯 Slot: **${emptyIndex + 1}**`);
  }

  if (command === "!slots") {
    let text = "🏆 **GS ESPORTS PRACTICE SCRIMS**\n\n📋 **SLOT LIST**\n\n";
    slots.forEach((team, i) => {
      text += `SLOT ${i + 1}: ${team}\n`;
    });
    return message.channel.send(text);
  }

  if (command === "!remove") {
    if (!message.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
      return message.channel.send("❌ Sirf admin use kar sakta hai.");
    }

    const slotNo = Number(args[1]);
    if (!slotNo || slotNo < 1 || slotNo > 25) return message.channel.send("Example: `!remove 5`");

    const removed = slots[slotNo - 1];
    slots[slotNo - 1] = "EMPTY";
    return message.channel.send(`🗑️ Slot ${slotNo} removed: **${removed}**`);
  }

  if (command === "!reset") {
    if (!message.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
      return message.channel.send("❌ Sirf admin use kar sakta hai.");
    }

    slots = Array(25).fill("EMPTY");
    return message.channel.send("✅ Sab slots reset ho gaye.");
  }
});

client.login(process.env.TOKEN);