import TelegramBot from "node-telegram-bot-api";
import { TOKEN } from "./cfg.js";

import dotenv from "dotenv";
dotenv.config();

const bot = new TelegramBot(TOKEN, { polling: true });
bot.on("polling_error", (err) => {
  console.log(err.message);
  throw new Error(err.message);
});

enum EBotCommands {
  start = "/start",
  search = '/search',
}

interface IBotCommandInfo {
  command: string;
  description: string;
}

const Commands: IBotCommandInfo[] = [
  {
    command: EBotCommands.start,
    description: "Start the bot.",
  },
  {
    command: EBotCommands.search,
    description: "Search anime and info about it.",
  },
];

bot.setMyCommands(Commands);



bot.onText(new RegExp(EBotCommands.start), async (msg) => {
  const chatId = msg.chat.id;
  try {
    await bot.sendMessage(chatId, "Bot is started to work.");
  } catch (err: unknown) {
    console.log(err);
    if (err && typeof err === "string") {
      throw new Error(err);
    }
  }
});

bot.onText(new RegExp(EBotCommands.search), async (msg) => {
    const chatId = msg.chat.id;
    await bot.sendMessage(chatId, msg.text ? msg.text : '');
})

