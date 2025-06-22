import express from 'express';
import cors from 'cors';
import authRoutes from './routes/authRoutes.js';
import medicationRoutes from './routes/medicationRoutes.js';
import { initDB } from './models/initDB.js';
import fileUpload from './routes/uploadRoutes.js';

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

initDB();

app.use('/api/auth', authRoutes);
app.use('/api/medications', medicationRoutes);
app.use('/api/upload', fileUpload);

app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});
