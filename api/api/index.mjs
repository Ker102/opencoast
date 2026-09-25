import Fastify from 'fastify';
import { createApp, fastifyOptions } from '../dist/fastify-app.js';

const app = createApp(Fastify(fastifyOptions()));
const ready = app.ready();

export default async function handler(request, response) {
  await ready;
  await new Promise((resolve, reject) => {
    response.once('finish', resolve);
    response.once('close', resolve);
    response.once('error', reject);
    try {
      app.routing(request, response);
    } catch (error) {
      reject(error);
    }
  });
}
