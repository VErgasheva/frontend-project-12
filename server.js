import { createRequire } from 'module';
import path from 'path';
import { fileURLToPath } from 'url';
import express from 'express';

const require = createRequire(import.meta.url);
const chatServer = require('@hexlet/chat-server');

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = process.env.PORT || 5001;
const frontendDist = path.join(__dirname, 'frontend', 'dist');

const app = express();

chatServer({
  app,
  port: PORT,
  frontendPath: frontendDist,
});

app.use(express.static(frontendDist));

app.get('*', (req, res) => {
  if (req.path.startsWith('/api')) {
    res.status(404).json({ error: 'API route not found' });
    return;
  }
  res.sendFile(path.join(frontendDist, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
