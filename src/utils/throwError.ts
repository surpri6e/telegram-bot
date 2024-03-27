/** Automaticly check on error */
export const throwError = (err: unknown) => {
   if (err && typeof err === 'string') {
      throw new Error(err);
   }
};
