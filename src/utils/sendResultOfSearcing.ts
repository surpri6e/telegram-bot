import TelegramBot from 'node-telegram-bot-api';
import { IAnimeInfo } from '../types/IAnimeInfo';
import { throwError } from './throwError';

export const sendResultOfSearching = async (bot: TelegramBot, chatId: number, res: IAnimeInfo) => {
   bot.sendMessage(chatId, res.posterImage ? res.posterImage.small : '')
      .then(() => {
         bot.sendMessage(
            chatId,

            // Message with result
            `
<b>Title: ${res.canonicalTitle}</b>
          
Episodes 🔷: <b>${res.episodeCount}</b>
Length of episode ⏰: <b>${res.episodeLength} mins.</b>
Rating ✨: <b>${res.averageRating}</b>
          
${res.description}
            `,

            { parse_mode: 'HTML' },
         );
      })
      .catch((err) => {
         throwError(err);
      });
};
