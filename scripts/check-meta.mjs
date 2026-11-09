#!/usr/bin/env node
// Confere, no dist/ de um lab, se metadados e imagens batem com o próprio projeto.
// Pega o erro de copiar a descrição de um lab para outro e prévias pesadas demais.
import assert from 'node:assert/strict';
import { readFileSync, statSync, existsSync } from 'node:fs';
import { basename, resolve } from 'node:path';

const root = process.cwd();
const slug = process.argv[2] ?? basename(root);
const url = `https://victorsodre.github.io/${slug}/`;
const html = readFileSync(resolve(root, 'dist/index.html'), 'utf8');
const meta = (attr, key) => html.match(new RegExp(`<meta ${attr}="${key}" content="([^"]*)"`))?.[1];
const title = html.match(/<title>([^<]*)<\/title>/)?.[1];
const description = meta('name', 'description');
const errors = [];
const check = (ok, message) => { if (!ok) errors.push(message); };

check(html.includes(`rel="canonical" href="${url}"`), `canonical deve ser ${url}`);
check(meta('property', 'og:url') === url, 'og:url diferente do canonical');
check(!!title && meta('property', 'og:title') === title && meta('name', 'twitter:title') === title, 'title, og:title e twitter:title precisam ser iguais');
check(!!description && meta('property', 'og:description') === description && meta('name', 'twitter:description') === description, 'description, og:description e twitter:description precisam ser iguais');

const image = meta('property', 'og:image');
check(image === `${url}share.jpg`, 'og:image deve ser share.jpg do próprio lab');
check(meta('name', 'twitter:image') === image, 'twitter:image deve ser igual a og:image');
check(meta('property', 'og:image:width') === '1200' && meta('property', 'og:image:height') === '630', 'og:image deve declarar 1200x630');
const share = resolve(root, 'dist/share.jpg');
if (existsSync(share)) check(statSync(share).size <= 300_000, `share.jpg tem ${statSync(share).size} B (máx. 300 KB)`);
else check(false, 'dist/share.jpg ausente');
const thumb = resolve(root, 'dist/video-thumbnail.jpg');
if (existsSync(thumb)) check(statSync(thumb).size <= 150_000, `video-thumbnail.jpg tem ${statSync(thumb).size} B (máx. 150 KB)`);

// O vídeo citado no noscript tem de ser o vídeo do próprio lab.
const videoSource = readFileSync(resolve(root, 'src/content/video.ts'), 'utf8');
const ids = [...videoSource.matchAll(/"?id"?:\s*["']([\w-]{11})["']/g)].map(m => m[1]);
const noscript = html.match(/<noscript>([\s\S]*?)<\/noscript>/)?.[1] ?? '';
const linked = [...noscript.matchAll(/watch\?v=([\w-]{11})/g)].map(m => m[1]);
check(noscript.length > 0, 'falta <noscript>');
check(linked.every(id => ids.includes(id)), `noscript aponta para vídeo de outro lab: ${linked.join(', ')}`);

// Nenhum metadado pode citar outro lab da coleção pelo endereço.
const collection = readFileSync(resolve(root, 'src/kit/collection.ts'), 'utf8');
const others = [...collection.matchAll(/slug: '([a-z0-9-]+)'/g)].map(m => m[1]).filter(other => other !== slug);
check(others.length > 0, 'lista da coleção não encontrada em src/kit/collection.ts');
const head = html.slice(0, html.indexOf('</head>'));
for (const other of others) check(!head.includes(`github.io/${other}/`), `metadados citam outro lab: ${other}`);

if (errors.length) { console.error('Metadados do lab com problema:\n- ' + errors.join('\n- ')); process.exit(1); }
console.log(`Metadados de ${slug}: canonical, prévia (${Math.round(statSync(share).size / 1024)} KB) e vídeo conferidos.`);
