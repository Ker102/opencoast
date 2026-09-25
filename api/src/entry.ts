import Fastify from 'fastify';
import { createApp, fastifyOptions } from './fastify-app.js';
import { config } from './config.js';

const app = createApp(Fastify(fastifyOptions()));
void app.listen({ host: '0.0.0.0', port: config.port }).catch((error: unknown) => {
  app.log.error(error);
  process.exitCode = 1;
});

export default app;
