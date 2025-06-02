import { createRequire } from 'module';
import path from 'path';
import { fileURLToPath } from 'url';

const require = createRequire(import.meta.url);
const chatServer = require('@hexlet/chat-server');

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = process.env.PORT || 5001;

chatServer({
  port: PORT,
  frontendPath: path.join(__dirname, 'frontend', 'dist'),
});
