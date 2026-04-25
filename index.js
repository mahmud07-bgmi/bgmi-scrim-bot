require("dotenv").config();

const express = require("express");
const { Client, GatewayIntentBits } = require("discord.js");

const app = express();
const PORT = process.env.PORT || 10000;

app.get("/", (req, res) => {
  res.send("BGMI Scrim Bot Running 🚀");
});

app.listen(PORT, () => {
  console.log("Web server running on port " + PORT);
});

// DISCORD BOT
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

client.once("ready", () => {
  console.log(`✅ Bot Online: ${client.user.tag}`);
});

client.on("messageCreate", (message) => {
  if (message.author.bot) return;

  if (message.content === "!ping") {
    message.channel.send("Pong 🏓");
  }
});

// DEBUG
console.log("TOKEN:", process.env.TOKEN ? "FOUND" : "MISSING");

client.login(process.env.TOKEN)
  .then(() => console.log("✅ Login success"))
  .catch(err => console.log("❌ Login error:", err));