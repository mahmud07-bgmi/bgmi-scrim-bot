require("dotenv").config();

const express = require("express");
const { Client, GatewayIntentBits, PermissionsBitField } = require("discord.js");

const app = express();
const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.send("BGMI Scrim Bot is running 🚀");
});

app.listen(PORT, () => {
  console.log(`Web server running on port ${PORT}`);
});

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

let slots = Array(25).fill("EMPTY");

const matchInfo = {
  title: "GS ESPORTS PRACTICE SCRIMS 🇮🇳",
  time: "7:00 PM - 9:00 PM",
  maps: [
    "Erangel — IDP 6:50 PM | START 7:00 PM",
    "Miramar — IDP 7:40 PM | START 7:50 PM",
    "Sanhok — IDP 8:25 PM | START 8:35 PM"
  ]
};

client.once("ready", () => {
  console.log(`BGMI Scrim Bot Online: ${client.user.tag}`);
});

function isAdmin(message) {
  return message.member.permissions.has(PermissionsBitField.Flags.Administrator);
}

client.on("messageCreate", (message) => {
  if (message.author.bot) return;

  const msg = message.content.trim();
  const args = msg.split(" ");
  const command = args[0].toLowerCase();

  if (command === "!help") {
    return message.channel.send(`
🏆 **GS ESPORTS BGMI SCRIM BOT**

Commands:
\`!register TEAM_NAME\` - Team register
\`!slots\` - Slot list show
\`!match\` - Match timing + maps
\`!remove SLOT_NO\` - Admin only
\`!reset\` - Admin only
`);
  }

  if (command === "!match") {
    let text = `🏆 **${matchInfo.title}**\n\n`;
    text += `⏰ **TIME:** ${matchInfo.time}\n\n`;
    text += `🗺️ **MAP SCHEDULE:**\n`;

    matchInfo.maps.forEach((map, i) => {
      text += `MATCH ${i + 1}: ${map}\n`;
    });

    return message.channel.send(text);
  }

  if (command === "!register") {
    const teamName = args.slice(1).join(" ").trim().toUpperCase();

    if (!teamName) {
      return message.channel.send("Team name likho. Example: `!register TEAM XTREME`");
    }

    if (slots.includes(teamName)) {
      return message.channel.send("Ye team already registered hai ✅");
    }

    const emptyIndex = slots.findIndex(slot => slot === "EMPTY");

    if (emptyIndex === -1) {
      return message.channel.send("All slots full ho gaye ❌");
    }

    slots[emptyIndex] = teamName;

    return message.channel.send(`✅ Registered: **${teamName}**\n🎯 Slot: **${emptyIndex + 1}**`);
  }

  if (command === "!slots") {
    let text = `🏆 ${matchInfo.title}\n`;
    text += `⏰ TIME: ${matchInfo.time}\n\n`;
    text += `📋 SLOT LIST\n\n`;

    slots.forEach((team, index) => {
      text += `SLOT ${index + 1}: ${team}\n`;
    });

    text += `\n✅ Register command: !register TEAM_NAME`;

    return message.channel.send(text);
  }

  if (command === "!remove") {
    if (!isAdmin(message)) {
      return message.channel.send("❌ Ye command sirf admin use kar sakta hai.");
    }

    const slotNo = Number(args[1]);

    if (!slotNo || slotNo < 1 || slotNo > 25) {
      return message.channel.send("Valid slot number do. Example: `!remove 5`");
    }

    const removedTeam = slots[slotNo - 1];
    slots[slotNo - 1] = "EMPTY";

    return message.channel.send(`🗑️ Slot ${slotNo} removed: **${removedTeam}**`);
  }

  if (command === "!reset") {
    if (!isAdmin(message)) {
      return message.channel.send("❌ Ye command sirf admin use kar sakta hai.");
    }

    slots = Array(25).fill("EMPTY");
    return message.channel.send("✅ Sab slots reset ho gaye.");
  }
});

client.login(process.env.TOKEN);