import express from "express";
import jwt from "jsonwebtoken";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


const usersPath = path.resolve(__dirname, "../data/users.json");
const users = JSON.parse(fs.readFileSync(usersPath, "utf-8"));

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || "secret";

router.post("/login", (req, res) => {
  const { username, password } = req.body;


  if (!username || !password) {
    return res.status(400).json({ error: "Username and password required" });
  }


  const user = users.find((u) => u.username === username);
  if (!user) {
    return res.status(401).json({ error: "Invalid credentials" });
  }


  if (user._password !== password) {
    return res.status(401).json({ error: "Invalid credentials" });
  }


  const token = jwt.sign(
    { id: user.id, username: user.username, role: user.role },
    JWT_SECRET,
    { expiresIn: "1h" }
  );

  return res.status(200).json({ token });
});

export default router;
