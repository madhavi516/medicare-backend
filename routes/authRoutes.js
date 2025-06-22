import express from 'express';
import bcrypt from 'bcryptjs';
import { getDB } from '../models/initDB.js';

const router = express.Router();

router.post('/signup', async (req, res) => {
  const { name, email, password, role } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  const db = getDB();

  try {
    await db.run(
      `INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)`,
      [name, email, hashedPassword, role]
    );
    res.status(201).json({ message: 'Signup successful' });
  } catch (err) {
    res.status(400).json({ error: 'Email already exists' });
  }
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const db = getDB();
  const user = await db.get(`SELECT * FROM users WHERE email = ?`, [email]);

  if (!user) return res.status(400).json({ error: 'User not found' });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(400).json({ error: 'Invalid credentials' });

  res.status(200).json({ message: 'Login successful', user: { id: user.id, name: user.name, role: user.role } });
});

export default router;
