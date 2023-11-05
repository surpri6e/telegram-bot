export const TOKEN: string = process.env.TOKEN ? process.env.TOKEN : '';
export const FIREBASE_CONFIG = {
  apiKey: process.env.apiKey ? process.env.apiKey : '',
  authDomain: process.env.authDomain ? process.env.authDomain : '',
  projectId: process.env.projectId ? process.env.projectId : '',
  storageBucket: process.env.storageBucket ? process.env.storageBucket : '',
  messagingSenderId: process.env.messagingSenderId ? process.env.messagingSenderId : '',
  appId: process.env.appId ? process.env.appId : '',
};

