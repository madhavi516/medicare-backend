import express from 'express';
import { getDB } from '../models/initDB.js';

const router = express.Router();

router.post('/', async (req, res) => {
  const { userId, name, dosage, frequency } = req.body;
  const db = getDB();
  await db.run(
    `INSERT INTO medications (userId, name, dosage, frequency, takenDates) VALUES (?, ?, ?, ?, ?)`,
    [userId, name, dosage, frequency, JSON.stringify([])]
  );
  res.status(201).json({ message: 'Medication added' });
});

router.get('/:userId', async (req, res) => {
  const db = getDB();
  const meds = await db.all(`SELECT * FROM medications WHERE userId = ?`, [req.params.userId]);
  res.json(meds);
});

router.put('/taken/:medId', async (req, res) => {
  const { date } = req.body;
  const db = getDB();
  const med = await db.get(`SELECT takenDates FROM medications WHERE id = ?`, [req.params.medId]);
  let dates = JSON.parse(med.takenDates);
  if (!dates.includes(date)) dates.push(date);

  await db.run(`UPDATE medications SET takenDates = ? WHERE id = ?`, [JSON.stringify(dates), req.params.medId]);
  res.json({ message: 'Marked as taken' });
});

export default router;