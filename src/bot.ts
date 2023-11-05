import TelegramBot from "node-telegram-bot-api";
import { FIREBASE_CONFIG, TOKEN } from "./cfg.js";
import { initializeApp } from "firebase/app";
import {
  getFirestore,
  doc,
  setDoc,
  collection,
  getDocs,
} from "firebase/firestore";
import dotenv from "dotenv";
dotenv.config();

interface IData {
  note: string;
}

let isCreatedCommandOfNote: boolean = true;
// let isDeletedCommandOfNote: boolean = true;

const app = initializeApp(FIREBASE_CONFIG);
const db = getFirestore(app);

const bot = new TelegramBot(TOKEN, { polling: true });
bot.on("polling_error", (err) => {
  console.log(err.message);
  throw new Error(err.message);
});

enum EBotCommands {
  start = "/start",
  create = "/create",
  delete = "/delete",
  show = "/show",
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
    command: EBotCommands.create,
    description: "Create the note. The next message is your note.",
  },
  {
    command: EBotCommands.delete,
    description: "Delete the note. The next message is number of your note.",
  },
  {
    command: EBotCommands.show,
    description: "Show all my notes.",
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

bot.onText(new RegExp(EBotCommands.create), () => {
    isCreatedCommandOfNote = true;
});

bot.onText(new RegExp(EBotCommands.show), async (msg) => {
    const chatId = msg.chat.id;
    const querySnapshot = await getDocs(collection(db, chatId.toString()));
    let answer: string = `Your notes: \n`
    let number = 1;
    querySnapshot.forEach((doc) => {
        const note= doc.data() as IData;
        answer += `${number}) ${note.note}\n`;
        number++;
    });
    await bot.sendMessage(chatId, answer);
})

bot.on("message", async (msg) => {
  const chatId = msg.chat.id;

  if (isCreatedCommandOfNote 
    && msg.text != EBotCommands.create
    && msg.text != EBotCommands.start
    && msg.text != EBotCommands.delete
    && msg.text != EBotCommands.show) {
    try {
      await setDoc(doc(db, chatId.toString(), msg.date.toString()), {
        note: msg.text,
      } as IData);
      await bot.sendMessage(chatId, `Bot is created your note - ${msg.text}`);
      isCreatedCommandOfNote = false;
    } catch (err: unknown) {
      console.log(err);
      if (err && typeof err === "string") {
        throw new Error(err);
      }
    }
  }
});
