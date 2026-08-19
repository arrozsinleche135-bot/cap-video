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

const admin = createClient(env.VITE_SUPABASE_URL, env.SUPABASE_SECRET_KEY);
const { data, error } = await admin.from('organizations').select('id, content_revision').limit(5);
console.log('DATA', data);
console.log('ERROR', error);
process.exit(0);
