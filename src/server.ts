import express, { Request, Response, NextFunction } from 'express';
import http from 'http';
import { Server as SocketIOServer } from 'socket.io';
import dotenv from 'dotenv';
import chatRouter from './routes/chat';

dotenv.config();

const app = express();
app.use(express.json());

// Créer le serveur HTTP et Socket.io
const server = http.createServer(app);
const io = new SocketIOServer(server, {
  cors: {
    origin: '*', // Pour tester facilement, autorise toutes origines (adapter en prod)
  },
});

// Middleware pour injecter io dans req (utile pour les routes)
app.use(
  (
    req: Request & { io?: SocketIOServer },
    res: Response,
    next: NextFunction
  ) => {
    req.io = io;
    next();
  }
);

// Route racine simple
app.get('/', (req: Request, res: Response) => {
  res.send('Salut');
});

// Route chat (POST /api/chat)
app.use('/api/chat', chatRouter);

// Gestion des routes non trouvées
app.use((req: Request, res: Response) => {
  res.status(404).json({ error: 'Route not found' });
});

const PORT = process.env.PORT || 8000;
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

// Socket.io events (pour gérer les connexions WS)
io.on('connection', (socket) => {
  console.log('Un client est connecté:', socket.id);

  socket.on('disconnect', () => {
    console.log('Client déconnecté:', socket.id);
  });
});
