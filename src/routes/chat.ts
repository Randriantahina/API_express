import { Router, Request, Response } from 'express';

const router = Router();

router.post('/', (req: Request & { io?: any }, res: Response) => {
  const { message } = req.body;

  if (!message || typeof message !== 'string') {
    res.status(400).json({ error: 'Message is required and must be a string' });
    return;
  }

  // On émet le message à tous les clients connectés via Socket.io
  req.io?.emit('chat-message', message);

  res.json({ status: 'Message broadcasted', message });
  return;
});

export default router;
