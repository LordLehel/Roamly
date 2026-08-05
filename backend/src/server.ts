import express, { Request, Response } from 'express';
import userRoutes from './routes/users.routes'

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.use('/api/users', userRoutes);

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
