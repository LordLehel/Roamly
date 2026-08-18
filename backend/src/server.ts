import express, { Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rootRouter from './api/routes';
import { errorHandler } from './middlewares/error.middleware';
import path from 'path';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// enabling cross origin resources in helmet so the frontend can show files originating from the backend
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
  }),
);

app.use(
  cors({
    origin: 'http://localhost:5000',
    credentials: true,
  }),
);

app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

app.use('/api', rootRouter);

app.get('/api/health', (req: Request, res: Response) => {
  res.status(200).json({
    status: 'success',
    message: 'Hello World!',
    timestamp: new Date().toISOString(),
  });
});

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`server listening on port ${PORT}`);
});
