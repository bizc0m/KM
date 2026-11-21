#!/usr/bin/env node
// Legacy command now uses the technical-only pipeline; raw note exports are disabled.
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
if (process.argv.includes('--input')) { console.error('Raw note imports are disabled. Use NOTEPLAN_ROOT with the technical pipeline.'); process.exit(2); }
const result = spawnSync(process.execPath, [fileURLToPath(new URL('./km-technical-pipeline.mjs', import.meta.url)), '--noteplan'], { stdio: 'inherit', env: process.env });
process.exit(result.status ?? 1);
