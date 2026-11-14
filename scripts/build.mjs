/*
 * Static build: copies the site (HTML, CSS, JS, images, README)
 * into dist/ exactly as-is, preserving the plain <script> setup.
 */
import { cpSync, mkdirSync, rmSync } from 'fs';

rmSync('dist', { recursive: true, force: true });
mkdirSync('dist', { recursive: true });

const items = [
  'index.html',
  'pages',
  'css',
  'js',
  'images',
  'photoshop',
  'README.txt',
];

for (const item of items) {
  cpSync(item, `dist/${item}`, { recursive: true });
}

console.log('Static build complete → dist/');
