import 'dotenv/config';
import { spawn } from 'node:child_process';

const dbUrl = process.env.SUPABASE_DB_URL;
if (!dbUrl) {
  console.error('Missing SUPABASE_DB_URL in .env');
  process.exit(1);
}

const args = ['db', 'push', '--db-url', dbUrl, '--include-all', '--yes'];
const child = spawn('supabase', args, { stdio: 'inherit' });
child.on('exit', (code) => process.exit(code ?? 1));

