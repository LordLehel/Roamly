import express, { Request, Response } from 'express';
import rootRouter from './api/routes';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.use('/api', rootRouter);

app.get('/api/health', (req: Request, res: Response) => {
  res.status(200).json({
    status: 'success',
    message: 'Hello World!',
    timestamp: new Date().toISOString(),
  });
});

app.listen(PORT, () => {
  console.log(`server listening on port ${PORT}`);
});
