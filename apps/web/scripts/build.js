/* eslint-disable @typescript-eslint/no-var-requires */

const { build } = require('esbuild');

console.log('Building opentelemetry server...');

build({
  entryPoints: ['server/telemetry/tracing.ts'],
  bundle: true,
  // minify: true,
  sourcemap: 'inline',
  platform: 'node', // for CJS
  outfile: 'dist/tracing.js',
  format: 'cjs',
});

console.log('Built opentelemetry server');
