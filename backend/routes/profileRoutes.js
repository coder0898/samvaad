import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { readData } from "../util/fileUtil.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const USER_FILE = path.join(__dirname, "../data/user.json");

// GET PROFILE
router.get("/", verifyToken, (req, res) => {
  const users = readData(USER_FILE) || [];
  const user = users.find((u) => u.id === req.user.id);

  if (!user) return res.status(404).json({ message: "User not found" });

  res.json({
    user: { id: user.id, username: user.username, email: user.email },
  });
});

export default router;
