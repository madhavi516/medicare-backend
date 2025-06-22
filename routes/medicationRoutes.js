import express from 'express';
import { getDB } from '../models/initDB.js';

const router = express.Router();

router.post('/', (req, res) => {
  const { userId, name, dosage, frequency } = req.body;
  const db = getDB();

  const stmt = db.prepare(
    `INSERT INTO medications (userId, name, dosage, frequency, takenDates) VALUES (?, ?, ?, ?, ?)`
  );
  stmt.run(userId, name, dosage, frequency, JSON.stringify([]));

  res.status(201).json({ message: 'Medication added' });
});

router.get('/:userId', (req, res) => {
  const db = getDB();

  const stmt = db.prepare(`SELECT * FROM medications WHERE userId = ?`);
  const meds = stmt.all(req.params.userId);

  res.json(meds);
});

router.put('/taken/:medId', (req, res) => {
  const { date } = req.body;
  const db = getDB();

  const selectStmt = db.prepare(`SELECT takenDates FROM medications WHERE id = ?`);
  const med = selectStmt.get(req.params.medId);

  let dates = [];
  if (med?.takenDates) {
    dates = JSON.parse(med.takenDates);
  }

  if (!dates.includes(date)) dates.push(date);

  const updateStmt = db.prepare(`UPDATE medications SET takenDates = ? WHERE id = ?`);
  updateStmt.run(JSON.stringify(dates), req.params.medId);

  res.json({ message: 'Marked as taken' });
});

export default router;
