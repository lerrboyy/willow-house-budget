// Willow House — a household budget site, handed in by this program.
//
// The site lives in app/ beside this file: plain static files (index.html,
// style.css and small ES modules) that any static server can serve, with no
// build step and no network request. This program copies app/ and
// screenshots/ into the hand-in directory and writes the dossier the judge
// reads, using the kit's vendored make.fun library.
//
// Run it outside the grader with:
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
//
// The output directory itself is never removed: only the files this program
// copied in before are cleared out of it, so a grader mount point stays put.

import { cpSync, existsSync, mkdirSync, readFileSync, readdirSync, rmSync, statSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDossier } from './vendor/makefun-frontend.ts';

const here = fileURLToPath(new URL('.', import.meta.url));
const out = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

// Clear the previous hand-in's contents, never the directory itself.
mkdirSync(out, { recursive: true });
for (const name of readdirSync(out)) {
  const target = join(out, name);
  rmSync(target, { recursive: true, force: true });
}

mkdirSync(join(out, 'app'), { recursive: true });
cpSync(join(here, 'app'), join(out, 'app'), { recursive: true });

const shots = join(here, 'screenshots');
if (existsSync(shots)) {
  mkdirSync(join(out, 'screenshots'), { recursive: true });
  cpSync(shots, join(out, 'screenshots'), { recursive: true });
}

const dossier = buildDossier(out, {
  text_max_bytes: 163840,
  screenshots: { max: 4, max_bytes: 262144 },
  app_max_files: 993,
  app_max_bytes: 16777216,
});
writeFileSync(join(out, 'dossier.json'), dossier);

// A short human-readable summary of what was handed in.
const appFiles = readdirSync(join(out, 'app'));
const shotFiles = existsSync(join(out, 'screenshots')) ? readdirSync(join(out, 'screenshots')) : [];
const dossierBytes = statSync(join(out, 'dossier.json')).size;
const lines = [
  'Willow House — household budget site',
  `app files: ${appFiles.join(', ')}`,
  `screenshots: ${shotFiles.join(', ') || 'none'}`,
  `dossier.json: ${dossierBytes} bytes`,
  `dossier preview: ${readFileSync(join(out, 'dossier.json'), 'utf8').slice(0, 120).replace(/\n/g, ' ')}`,
];
console.log(lines.join('\n'));
