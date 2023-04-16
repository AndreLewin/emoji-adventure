// @ts-check
/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation.
 * This is especially useful for Docker builds.
 */
!process.env.SKIP_ENV_VALIDATION && (await import("./src/env/server.mjs"));

/** @type {import("next").NextConfig} */
const config = {
  reactStrictMode: true,
  swcMinify: true,
  experimental: { appDir: true }
};

if (process.env.FOR_ITCH) {
  config.output = 'export';
  // https://github.com/vercel/next.js/issues/2581
  // because itch.io does not want absolute links, assetPrefix will convert those into relative links
  // however, it's deprecated and some of those links won't work.
  // so this should only be used to export a specific adventure (see README.md)
  config.assetPrefix = './';
  // by default, the dir is "out", but we don't want to override it because it is used by Vercel
  config.distDir = 'itchOut';
}

export default config;
