import TelegramBot from 'node-telegram-bot-api';
import { TOKEN } from './config.js';

import { IBotCommandInfo } from './types/IBotCommandInfo.js';
import { EBotCommands } from './types/EBotCommands.js';
import { animeInfoSearch } from './api/animeInfoSearch.js';
import { sendStartMessage } from './utils/sendStartMessage.js';
import { throwError } from './utils/throwError.js';
import { sendResultOfSearching } from './utils/sendResultOfSearcing.js';

const bot = new TelegramBot(TOKEN, { polling: true });

bot.on('polling_error', (err) => {
   throwError(err.message);
});

// Commands of bot
const Commands: IBotCommandInfo[] = [
   {
      command: EBotCommands.start,
      description: 'Start the bot.',
   },
   {
      command: EBotCommands.search,
      description: 'Search anime and info about it.',
   },
];

// Set commands
bot.setMyCommands(Commands);

const start = async (msg: TelegramBot.Message) => {
   const chatId = msg.chat.id;
   sendStartMessage(bot, chatId);
};

const messageHandler = async (title: string, id: number) => {
   const chatId = id;

   try {
      animeInfoSearch(title)
         .then((res) => {
            if (res === undefined) {
               bot.sendMessage(chatId, 'Write title on english language!');
               return;
            }

            sendResultOfSearching(bot, chatId, res);
         })
         .catch((err) => {
            throwError(err);
         });
   } catch (err) {
      throwError(err);
   }
};

bot.onText(new RegExp(EBotCommands.search), (msg) => {
   const chatId = msg.chat.id;

   // Take all in message expect "/search"
   messageHandler(msg.text?.split('/search ')[1] ? msg.text?.split('/search ')[1] : 'naruto', chatId);
});

bot.on('message', async (msg) => {
   if (msg.text === EBotCommands.start) await start(msg);
});
