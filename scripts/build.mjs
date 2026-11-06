import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import { createConfig } from '../src/adapter.mjs';

const target = fileURLToPath(new URL('../ocs-openai.json', import.meta.url));
fs.writeFileSync(target, JSON.stringify(createConfig(), null, 2) + '\n');
console.log('Built ocs-openai.json with a placeholder key only.');
