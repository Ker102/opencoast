const origin = process.env.VERCEL_API_ORIGIN?.replace(/\/$/, '');

if (process.env.VERCEL && (!origin || !origin.startsWith('https://')))
  throw new Error('Set VERCEL_API_ORIGIN to the HTTPS URL of the OpenCoast API project');

export const config = {
  installCommand: 'npm ci --prefix ..',
  buildCommand: 'npm --prefix ../shared run build && npm run build',
  outputDirectory: 'dist',
  rewrites: [
    ...(origin ? [{ source: '/api/:path*', destination: `${origin}/:path*` }] : []),
    { source: '/(.*)', destination: '/index.html' },
  ],
};
