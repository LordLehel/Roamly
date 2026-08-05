import express, { Request, Response } from 'express';
import prisma from './prisma'

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get('/api/health', (req: Request, res: Response) => {
  res.status(200).json({
    status: 'success',
    message: 'Hello World!',
    timestamp: new Date().toISOString(),
  });
});

app.get('/api/users', async (req: Request, res: Response) => {
  try {
    const users = await prisma.users.findMany();

    res.status(200).json({
      status: 'success',
      count: URLSearchParams.length,
      data: users,
    });
  } catch (error) {
    console.error('Hiba a felhasznalok lekerdezesekor: ', error);
    res.status(500).json({
      status: 'error',
      message: 'Hiba a szerverrel felhasznalok lekerdezesekor!',
    });
  }
 });

app.listen(PORT, () => {
  console.log(`server listening on port ${PORT}`);
});
