import { createClient } from '@supabase/supabase-js';
import { readFileSync, writeFileSync } from 'node:fs';

const env = Object.fromEntries(
  readFileSync(new URL('../.env', import.meta.url), 'utf8')
    .split('\n')
    .filter((l) => l.includes('='))
    .map((l) => {
      const idx = l.indexOf('=');
      return [l.slice(0, idx).trim(), l.slice(idx + 1).trim()];
    }),
);

const username = process.env.VH_USER;
const password = process.env.VH_PASS;
const outFile = process.env.VH_OUT;

const admin = createClient(env.VITE_SUPABASE_URL, env.SUPABASE_SECRET_KEY);
const { data: profile } = await admin.from('profiles').select('user_id').eq('username', username).maybeSingle();
const { data: authUserData } = await admin.auth.admin.getUserById(profile.user_id);
const email = authUserData.user.email;

const publicClient = createClient(env.VITE_SUPABASE_URL, env.VITE_SUPABASE_PUBLISHABLE_KEY);
const { data: authData, error } = await publicClient.auth.signInWithPassword({ email, password });
if (error) { console.error('SIGNIN_FAILED', error.message); process.exit(1); }
writeFileSync(outFile, JSON.stringify(authData.session));
console.log('OK');
