require("dotenv").config();

const { Client, GatewayIntentBits } = require("discord.js");

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

  const msg = message.content.trim();
  const args = msg.split(" ");
  const command = args[0].toLowerCase();

  // HELP
  if (command === "!help") {
    message.channel.send(`
🏆 **GS ESPORTS BGMI SCRIM BOT**

Commands:
\`!register TEAM_NAME\` - team register
\`!slots\` - slot list show
\`!reset\` - all slots empty
\`!remove SLOT_NO\` - slot remove

Example:
\`!register TEAM XTREME\`
`);
  }

  // REGISTER
  if (command === "!register") {
    const teamName = args.slice(1).join(" ");

    if (!teamName) {
      return message.channel.send("Team name likho. Example: `!register TEAM XTREME`");
    }

    if (slots.includes(teamName.toUpperCase())) {
      return message.channel.send("Ye team already registered hai ✅");
    }

    const emptyIndex = slots.findIndex(slot => slot === "EMPTY");

    if (emptyIndex === -1) {
      return message.channel.send("All slots full ho gaye ❌");
    }

    slots[emptyIndex] = teamName.toUpperCase();

    message.channel.send(`✅ Registered: **${teamName.toUpperCase()}**\n🎯 Slot: **${emptyIndex + 1}**`);
  }

  // SLOT LIST
  if (command === "!slots") {
    let text = `🏆 **GS ESPORTS PRACTICE SCRIMS**\n\n📋 **SLOT LIST**\n\n`;

    slots.forEach((team, index) => {
      text += `SLOT ${index + 1}: ${team}\n`;
    });

    message.channel.send(text);
  }

  // REMOVE SLOT
  if (command === "!remove") {
    const slotNo = Number(args[1]);

    if (!slotNo || slotNo < 1 || slotNo > 25) {
      return message.channel.send("Valid slot number do. Example: `!remove 5`");
    }

    const removedTeam = slots[slotNo - 1];
    slots[slotNo - 1] = "EMPTY";

    message.channel.send(`🗑️ Slot ${slotNo} removed: **${removedTeam}**`);
  }

  // RESET
  if (command === "!reset") {
    slots = Array(25).fill("EMPTY");
    message.channel.send("✅ Sab slots reset ho gaye.");
  }
});

client.login(process.env.TOKEN);