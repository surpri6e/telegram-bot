export interface IAnimeInfo {
   description: string;
   canonicalTitle: string;
   averageRating: string;
   episodeCount: number;
   episodeLength: number;
   posterImage: {
      small: string;
   } | null;
}
