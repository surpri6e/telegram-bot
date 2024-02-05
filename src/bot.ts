import TelegramBot from "node-telegram-bot-api";
import { TOKEN } from "./cfg.js";

import dotenv from "dotenv";
import { IAnimeInfo } from "./types.js";
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

const animeInfoSearch = async (title: string) => {
  try {
    const result = await fetch(`https://kitsu.io/api/edge/anime?filter[text]=${title}`);
    const searchData = await result.json();
    return searchData.data[0].attributes; //! Check here 
  } catch (err: unknown) {
    console.log(err);
    if (err && typeof err === "string") {
      throw new Error(err);
    }
  }
}

const start = async (msg: TelegramBot.Message) => {
  const chatId = msg.chat.id;
  try {
    await bot.sendMessage(chatId, "Bot is started to work.");
  } catch (err: unknown) {
    console.log(err);
    if (err && typeof err === "string") {
      throw new Error(err);
    }
  }
}

const search = async (title: string, id: number) => {
  const chatId = id;
  try {
    animeInfoSearch(title)
    .then((res: IAnimeInfo | undefined) => {
      if(res === undefined) {
        bot.sendMessage(chatId, "Write title on english language!");
        return;
      }
      bot.sendMessage(chatId, res.posterImage.medium)
      bot.sendMessage(chatId, `
<b>Title: ${res.canonicalTitle}</b>

Episodes 🔷: <b>${res.episodeCount}</b>
Length of episode ⏰: <b>${res.episodeLength} mins.</b>
Rating ✨: <b>${res.averageRating}</b>

${res.description}
      `, {
        parse_mode: 'HTML'
      });
    })
    .catch((err: unknown) => {
      console.log(err);
      if (err && typeof err === "string") {
        throw new Error(err);
      }
    })
  } catch (err: unknown) {
    console.log(err);
    if (err && typeof err === "string") {
      throw new Error(err);
    }
  }
}

bot.onText(new RegExp(EBotCommands.search), (msg) => {
  const chatId = msg.chat.id;
  search(msg.text?.split(' ')[1] ? msg.text?.split(' ')[1] : '', chatId)
});

bot.on("message", async (msg) => {
  const chatId = msg.chat.id;
  
  if(msg.text === EBotCommands.start) await start(msg)
  //else if(msg.text != EBotCommands.start && msg.text != EBotCommands.search) bot.sendMessage(chatId, `It's not a command.`)
});
