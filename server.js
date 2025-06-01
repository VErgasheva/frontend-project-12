import { createServer } from 'http';
import { createRequire } from 'module';
import path from 'path';
import { fileURLToPath } from 'url';
import serveStatic from 'serve-static';
import finalhandler from 'finalhandler';

const require = createRequire(import.meta.url);
const chatServer = require('@hexlet/chat-server');

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = process.env.PORT || 5001;
chatServer({ port: PORT, frontendPath: path.join(__dirname, 'frontend', 'dist') });
const serve = serveStatic(path.join(__dirname, 'frontend', 'dist'), { index: ['index.html'] });

const server = createServer((req, res) => {
  serve(req, res, finalhandler(req, res));
});

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
