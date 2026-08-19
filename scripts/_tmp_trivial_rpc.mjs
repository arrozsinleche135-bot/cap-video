import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'node:fs';

const env = Object.fromEntries(
  readFileSync(new URL('../.env', import.meta.url), 'utf8')
    .split('\n')
    .filter((l) => l.includes('='))
    .map((l) => {
      const idx = l.indexOf('=');
      return [l.slice(0, idx).trim(), l.slice(idx + 1).trim()];
    }),
);

const SCRATCH = 'C:/Users/ferna/AppData/Local/Temp/claude/c--Users-ferna-OneDrive-Documentos-WEB-VIDEOS/56aa1d8c-c980-42ed-bcee-cfa761588e07/scratchpad';
const session = JSON.parse(readFileSync(`${SCRATCH}/admin_session.json`, 'utf8'));

const client = createClient(env.VITE_SUPABASE_URL, env.VITE_SUPABASE_PUBLISHABLE_KEY, {
  auth: { autoRefreshToken: false, detectSessionInUrl: false, persistSession: false },
  global: { headers: { Authorization: `Bearer ${session.access_token}` } },
});

console.log('START', Date.now());
const t0 = Date.now();
const { data, error } = await client.rpc('get_my_access_context');
console.log('DONE', Date.now(), 'MS', Date.now() - t0);
console.log('DATA', data);
console.log('ERROR', error);
process.exit(0);
