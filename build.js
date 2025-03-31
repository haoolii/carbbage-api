const esbuild = require('esbuild');
const path = require('path');
const fs = require('fs');

// 動態取得 /src/scripts/ 資料夾下所有 .ts 文件
const scriptFiles = fs.readdirSync('./src/scripts')
  .filter(file => file.endsWith('.ts'))
  .map(file => `./src/scripts/${file}`);

esbuild.build({
  entryPoints: ['src/index.ts', ...scriptFiles], // 入口文件
  outdir: 'dist',                        // 改成 outdir
  bundle: true,
  platform: 'node',
  target: 'node18',
  format: 'cjs',
  sourcemap: false,
  tsconfig: './tsconfig.json',
  external: ['express'],
}).then(() => {
  console.log('Build completed successfully!');
}).catch((error) => {
  console.error('Build failed:', error);
  process.exit(1);
});