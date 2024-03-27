import { IAnimeInfo } from '../types/IAnimeInfo';
import { throwError } from '../utils/throwError';

export const animeInfoSearch = async (title: string): Promise<IAnimeInfo | undefined> => {
   try {
      // Laziness to typed all that
      const result = await fetch(`https://kitsu.io/api/edge/anime?filter[text]=${title}`);
      const searchData = await result.json();
      return searchData.data.length > 0 ? searchData.data[0].attributes : undefined;
   } catch (err) {
      throwError(err);
   }
};
