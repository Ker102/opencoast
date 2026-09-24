const origin = process.env.CLOUD_RUN_API_ORIGIN?.replace(/\/$/, '');
if (process.env.VERCEL && (!origin || !origin.startsWith('https://')))
  throw new Error('Set CLOUD_RUN_API_ORIGIN to the HTTPS Cloud Run API origin before deploying');

export const config = {
  buildCommand: 'npm run build -w shared && npm run build -w web',
  installCommand: 'npm ci',
  outputDirectory: 'web/dist',
  rewrites: [
    ...(origin ? [{source:'/api/:path*',destination:`${origin}/:path*`}] : []),
    {source:'/(.*)',destination:'/index.html'},
  ],
};
