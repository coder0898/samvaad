import fs, { existsSync, mkdirSync } from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const CHATS_DIR = path.join(__dirname, "../data/chats");

// Ensure folder
if (!existsSync(CHATS_DIR)) mkdirSync(CHATS_DIR, { recursive: true });

const getRoomFile = (roomId) => path.join(CHATS_DIR, `room_${roomId}.json`);

export const readRoomMessages = (roomId) => {
  const file = getRoomFile(roomId);
  if (!existsSync(file)) return [];
  try {
    return JSON.parse(fs.readFileSync(file, "utf8"));
  } catch (err) {
    console.error(`❌ Failed reading chat file for room ${roomId}`, err);
    return [];
  }
};

export const saveMessage = (roomId, message) => {
  try {
    const messages = readRoomMessages(roomId);
    messages.push(message);

    fs.writeFileSync(getRoomFile(roomId), JSON.stringify(messages, null, 2));
  } catch (err) {
    console.error("❌ Failed saving message:", err);
  }
};

export const clearRoomMessages = (roomId) => {
  const file = getRoomFile(roomId);
  if (existsSync(file)) fs.unlinkSync(file);
};

export const getMessages = (roomId) => readRoomMessages(roomId);
