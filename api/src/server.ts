import { createApp } from './app.js';
import { config } from './config.js';

const app = await createApp();
await app.listen({ host: '0.0.0.0', port: config.port });
