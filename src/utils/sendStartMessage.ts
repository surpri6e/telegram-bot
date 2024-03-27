import TelegramBot from 'node-telegram-bot-api';
import { throwError } from './throwError';

export const sendStartMessage = async (bot: TelegramBot, chatId: number) => {
   try {
      await bot.sendMessage(
         chatId,

         // Start message
         `
<b>Bot is started to work.</b>
Only 2 commands:
  
<b>/start</b> - start bot.
<b>/search</b> [title of anime] - search anime and full info about it.
  
<b><i>Example: /search naruto</i></b>
         `,

         { parse_mode: 'HTML' },
      );
   } catch (err) {
      throwError(err);
   }
};
