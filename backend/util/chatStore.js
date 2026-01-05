import fs, { existsSync, mkdirSync } from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const CHATS_DIR = path.join(__dirname, "../data/chats");

// Ensure the folder exists
if (!existsSync(CHATS_DIR)) mkdirSync(CHATS_DIR, { recursive: true });

const getRoomFile = (roomId) => path.join(CHATS_DIR, `room_${roomId}.json`);

export const readRoomMessages = (roomId) => {
  const file = getRoomFile(roomId);
  if (!existsSync(file)) return [];
  try {
    return JSON.parse(fs.readFileSync(file, "utf8"));
  } catch (err) {
    console.error(`❌ Failed reading chat file for room ${roomId}:`, err);
    return [];
  }
};

export const saveMessage = (roomId, message) => {
  try {
    const messages = readRoomMessages(roomId);
    messages.push(message);
    fs.writeFileSync(
      getRoomFile(roomId),
      JSON.stringify(messages, null, 2),
      "utf8"
    );
  } catch (err) {
    console.error(`❌ Failed saving message for room ${roomId}:`, err);
  }
};

export const clearRoomMessages = (roomId) => {
  const file = getRoomFile(roomId);
  if (existsSync(file)) {
    try {
      fs.unlinkSync(file);
    } catch (err) {
      console.error(`❌ Failed clearing messages for room ${roomId}:`, err);
    }
  }
};

export const getMessages = (roomId) => readRoomMessages(roomId);
