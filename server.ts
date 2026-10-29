import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json());

const DATA_DIR = path.join(__dirname, 'data');
const WISHES_FILE = path.join(DATA_DIR, 'wishes.json');

const DEFAULT_WISHES: any[] = [];

function loadWishes() {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (!fs.existsSync(WISHES_FILE)) {
      fs.writeFileSync(WISHES_FILE, JSON.stringify([], null, 2), 'utf-8');
      return [];
    }
    const raw = fs.readFileSync(WISHES_FILE, 'utf-8');
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return parsed;
    }
    return [];
  } catch (err) {
    console.error('Error reading wishes file:', err);
    return [];
  }
}

function saveWishes(wishes: any[]) {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(WISHES_FILE, JSON.stringify(wishes, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error writing wishes file:', err);
  }
}

// Format friendly date in Spanish
function getFormattedDate(): string {
  const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
  const now = new Date();
  const day = now.getDate();
  const month = months[now.getMonth()];
  return `Hoy, ${day} ${month}`;
}

// === API ROUTES FOR DEDICATIONS ===

// GET all wishes
app.get('/api/wishes', (req, res) => {
  try {
    const wishes = loadWishes();
    res.json({ wishes, count: wishes.length });
  } catch (error) {
    console.error('GET /api/wishes error:', error);
    res.status(500).json({ error: 'Error al obtener dedicatorias' });
  }
});

// POST a new wish
app.post('/api/wishes', (req, res) => {
  try {
    const { author, relation, message, icon, fromRsvp, attendance } = req.body;

    if (!author || typeof author !== 'string' || !author.trim()) {
      return res.status(400).json({ error: 'El nombre es obligatorio' });
    }
    if (!message || typeof message !== 'string' || !message.trim()) {
      return res.status(400).json({ error: 'El mensaje de dedicatoria es obligatorio' });
    }

    const cleanAuthor = author.trim().slice(0, 100);
    const cleanRelation = (relation && typeof relation === 'string' && relation.trim())
      ? relation.trim().slice(0, 50)
      : 'Invitado(a)';
    const cleanMessage = message.trim().slice(0, 1000);
    const cleanIcon = (icon && typeof icon === 'string' && icon.trim())
      ? icon.trim().slice(0, 8)
      : '💖';

    const newWish = {
      id: Date.now().toString() + '-' + Math.random().toString(36).substring(2, 6),
      author: cleanAuthor,
      relation: cleanRelation,
      message: cleanMessage,
      date: getFormattedDate(),
      timestamp: Date.now(),
      icon: cleanIcon,
      likes: 1,
      fromRsvp: Boolean(fromRsvp),
      attendance: attendance || undefined,
    };

    const wishes = loadWishes();
    // Add to front of the array so newest messages appear first
    wishes.unshift(newWish);
    saveWishes(wishes);

    res.status(201).json({
      success: true,
      wish: newWish,
      wishes,
      message: 'Dedicatoria guardada con éxito en la invitación'
    });
  } catch (error) {
    console.error('POST /api/wishes error:', error);
    res.status(500).json({ error: 'Error al guardar la dedicatoria' });
  }
});

// POST like for a wish
app.post('/api/wishes/:id/like', (req, res) => {
  try {
    const { id } = req.params;
    const wishes = loadWishes();
    const wish = wishes.find(w => w.id === id);
    if (!wish) {
      return res.status(404).json({ error: 'Dedicatoria no encontrada' });
    }
    wish.likes = (Number(wish.likes) || 0) + 1;
    saveWishes(wishes);
    res.json({ success: true, likes: wish.likes });
  } catch (error) {
    console.error('POST /api/wishes/:id/like error:', error);
    res.status(500).json({ error: 'Error al registrar me gusta' });
  }
});

// START SERVER WITH VITE (DEV) OR STATIC (PROD)
async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        host: '0.0.0.0',
        port: PORT,
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`✨ Servidor XV Años Lirio Quetzalli corriendo en http://0.0.0.0:${PORT}`);
  });
}

startServer().catch(err => {
  console.error('Error starting server:', err);
  process.exit(1);
});
