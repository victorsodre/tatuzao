import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';

const expected = 'https://victorsodre.github.io/tatuzao/';
const html = readFileSync('dist/index.html', 'utf8');
assert.ok(html.includes(`rel="canonical" href="${expected}"`), 'Canonical must match the project URL');
assert.ok(html.includes(`content="${expected}share.jpg"`), 'Share image must use the public URL');
for (const match of html.matchAll(/(?:src|href)="([^"#]+)"/g)) {
  const value = match[1];
  if (/^https?:/.test(value)) continue;
  assert.ok(!value.startsWith('/'), `Root-relative asset breaks project Pages: ${value}`);
  assert.ok(existsSync(resolve('dist', value.split(/[?#]/)[0])), `Missing asset: ${value}`);
}
for (const file of ['404.html', 'share.jpg', 'sitemap.xml', 'icon.svg']) {
  assert.ok(existsSync(`dist/${file}`), `Missing public file: ${file}`);
}
assert.ok(readFileSync('dist/404.html', 'utf8').includes(`href="${expected}"`), '404 must return to the project root');
assert.ok(html.includes('<noscript>'), 'Keep an accessible no-JavaScript fallback');
// Search: the question of the video in the title, indexable text outside JS and a VideoObject for the lab's video.
assert.match(html.match(/<title>([^<]*)<\/title>/)?.[1] ?? '', /tatuzão/i, 'Title must carry the search term');
const article = html.match(/<article id="como-funciona"[\s\S]*?<\/article>/)?.[0] ?? '';
for (const term of ['câmara', 'rosca', 'argamassa', 'Linha 6']) assert.ok(article.includes(term), `Static explanation must mention ${term}`);
const ld = JSON.parse(html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)?.[1] ?? 'null');
const videoId = readFileSync('src/content/video.ts', 'utf8').match(/"id":\s*"([\w-]{11})"/)?.[1];
assert.equal(ld?.['@type'], 'VideoObject', 'JSON-LD must describe the video');
assert.ok(videoId && ld.embedUrl.endsWith(videoId) && ld.url.endsWith(videoId), 'JSON-LD must point to the lab video');
for (const key of ['name', 'description', 'thumbnailUrl', 'uploadDate', 'duration']) assert.ok(ld[key], `JSON-LD missing ${key}`);
console.log('Pages: caminhos em subpasta, metadados e arquivos públicos conferidos.');
