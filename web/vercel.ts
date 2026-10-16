const origin = process.env.VERCEL_API_ORIGIN?.replace(/\/$/, '');

if (process.env.VERCEL && (!origin || !origin.startsWith('https://')))
  throw new Error('Set VERCEL_API_ORIGIN to the HTTPS URL of the OpenCoast API project');

export const config = {
  installCommand: 'npm ci --prefix ..',
  buildCommand: 'npm --prefix ../shared run build && npm run build',
  outputDirectory: 'dist',
  redirects: [
    {
      source: '/:path*',
      has: [{ type: 'host', value: 'opencoast-web.vercel.app' }],
      destination: 'https://opencoast.kaelux.dev/:path*',
      permanent: true,
    },
  ],
  headers: [
    ...['/receipt/:path*', '/moderation/:path*', '/contribute', '/api/:path*'].map((source) => ({
      source,
      headers: [{ key: 'X-Robots-Tag', value: 'noindex, nofollow, noarchive' }],
    })),
  ],
  rewrites: [
    ...(origin ? [{ source: '/api/:path*', destination: `${origin}/:path*` }] : []),
    ...['about', 'how-it-works', 'evidence'].map((page) => ({
      source: `/${page}`,
      destination: `/${page}.html`,
    })),
    ...['/contribute', '/receipt/:path*', '/moderation/:path*'].map((source) => ({
      source,
      destination: '/index.html',
    })),
  ],
};
