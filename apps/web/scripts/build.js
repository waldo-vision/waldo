/* eslint-disable @typescript-eslint/no-var-requires */

const { build } = require('esbuild');

build({
  entryPoints: ['server/metrics/tracing.ts'],
  bundle: true,
  // minify: true,
  sourcemap: 'inline',
  platform: 'node', // for CJS
  outfile: 'dist/tracing.js',
  format: 'cjs',
});

console.log('built trace collector');
