const esbuild = require('esbuild');

esbuild.build({
  entryPoints: ['src/index.ts'], // 入口文件
  outfile: 'dist/index.js',      // 改成 index.js
  bundle: true,
  platform: 'node',
  target: 'node18',
  format: 'cjs',
  sourcemap: true,
  tsconfig: './tsconfig.json',
  external: ['express'],
}).then(() => {
  console.log('Build completed successfully!');
}).catch((error) => {
  console.error('Build failed:', error);
  process.exit(1);
});