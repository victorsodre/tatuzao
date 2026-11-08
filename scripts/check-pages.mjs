import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';

const expected = 'https://victorsodre.github.io/tatuzao/';
const html = readFileSync('dist/index.html', 'utf8');
assert.ok(html.includes(`rel="canonical" href="${expected}"`), 'Canonical must match the project URL');
assert.ok(html.includes(`content="${expected}share.png"`), 'Share image must use the public URL');
for (const match of html.matchAll(/(?:src|href)="([^"#]+)"/g)) {
  const value = match[1];
  if (/^https?:/.test(value)) continue;
  assert.ok(!value.startsWith('/'), `Root-relative asset breaks project Pages: ${value}`);
  assert.ok(existsSync(resolve('dist', value.split(/[?#]/)[0])), `Missing asset: ${value}`);
}
for (const file of ['404.html', 'share.png', 'sitemap.xml', 'icon.svg']) {
  assert.ok(existsSync(`dist/${file}`), `Missing public file: ${file}`);
}
assert.ok(readFileSync('dist/404.html', 'utf8').includes(`href="${expected}"`), '404 must return to the project root');
assert.ok(html.includes('<noscript>'), 'Keep an accessible no-JavaScript fallback');
console.log('Pages: caminhos em subpasta, metadados e arquivos públicos conferidos.');
