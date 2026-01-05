import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import path from "path";
import { fileURLToPath } from "url";
import { readData, writeData } from "../util/fileUtil.js";

const router = express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const USER_FILE = path.join(__dirname, "../data/user.json");

// Ensure file exists
if (!readData(USER_FILE)) writeData(USER_FILE, []);

// SIGNUP
router.post("/signup", async (req, res) => {
  try {
    let { username, email, password } = req.body;

    if (!username || !email || !password)
      return res.status(400).json({ message: "All fields required" });

    username = username.trim();
    email = email.trim().toLowerCase();

    const users = readData(USER_FILE);

    if (
      users.some(
        (u) =>
          u.username.toLowerCase() === username.toLowerCase() ||
          u.email === email
      )
    ) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = {
      id: users.length ? Math.max(...users.map((u) => u.id)) + 1 : 1,
      username,
      email,
      password: hashedPassword,
    };

    users.push(newUser);
    writeData(USER_FILE, users);

    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    console.error("Signup error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// LOGIN
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password)
      return res.status(400).json({ message: "Username & password required" });

    const users = readData(USER_FILE);
    const user = users.find(
      (u) => u.username.toLowerCase() === username.toLowerCase()
    );

    if (!user) return res.status(401).json({ message: "Invalid credentials" });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      { id: user.id, username: user.username, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({
      token,
      user: { id: user.id, username: user.username, email: user.email },
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
