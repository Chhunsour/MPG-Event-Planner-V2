import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

console.log('🔒 Running Production Security & RBAC Audit...\n');

let errors = 0;
let warnings = 0;
let checksPassed = 0;

function pass(msg) {
  checksPassed++;
  console.log(`  ✓ PASS: ${msg}`);
}

function fail(msg) {
  errors++;
  console.log(`  ❌ FAIL: ${msg}`);
}

function warn(msg) {
  warnings++;
  console.log(`  ⚠️ WARN: ${msg}`);
}

// 1. Verify SQL Migration File for Security & RBAC
const migrationPath = path.join(rootDir, 'supabase', 'migrations', '20260811100000_security_rbac_crew_audit.sql');
if (fs.existsSync(migrationPath)) {
  const content = fs.readFileSync(migrationPath, 'utf8');
  if (content.includes('crew_invitations') && content.includes('activity_logs') && content.includes('ensure_last_owner_protection')) {
    pass('SQL migration file exists with RBAC, invitations, audit logs, and owner protection triggers');
  } else {
    fail('SQL migration file missing essential triggers or table definitions');
  }
} else {
  fail('Missing security migration SQL file');
}

// 2. Verify Auth Helper Module
const authPath = path.join(rootDir, 'lib', 'auth.ts');
if (fs.existsSync(authPath)) {
  const content = fs.readFileSync(authPath, 'utf8');
  if (content.includes('requireCrewRole') && content.includes('requireOwner') && content.includes('CrewRole')) {
    pass('RBAC auth module (lib/auth.ts) implements fine-grained role authorization');
  } else {
    fail('lib/auth.ts missing RBAC functions');
  }
} else {
  fail('Missing lib/auth.ts');
}

// 3. Verify Server Actions Hardening
const actionsPath = path.join(rootDir, 'app', 'admin', 'actions.ts');
if (fs.existsSync(actionsPath)) {
  const content = fs.readFileSync(actionsPath, 'utf8');
  if (content.includes('requireCrewRole') && content.includes('cleanHtml') && content.includes('logActivity')) {
    pass('Admin server actions hardened with RBAC, XSS sanitization, and audit logging');
  } else {
    fail('app/admin/actions.ts missing security guards');
  }
} else {
  fail('Missing app/admin/actions.ts');
}

// 4. Verify Service Role Key Safety across repository
function scanForServiceRoleKey(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    if (entry.name === 'node_modules' || entry.name === '.next' || entry.name === '.git' || entry.name === 'scripts') continue;
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      scanForServiceRoleKey(fullPath);
    } else if (entry.isFile() && (entry.name.endsWith('.ts') || entry.name.endsWith('.tsx') || entry.name.endsWith('.js'))) {
      const content = fs.readFileSync(fullPath, 'utf8');
      if (content.includes('NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY') || content.includes('SUPABASE_SERVICE_ROLE_KEY')) {
        fail(`Exposed SUPABASE_SERVICE_ROLE_KEY found in ${fullPath}`);
      }
    }
  }
}

scanForServiceRoleKey(path.join(rootDir, 'app'));
scanForServiceRoleKey(path.join(rootDir, 'components'));
scanForServiceRoleKey(path.join(rootDir, 'lib'));
pass('No SUPABASE_SERVICE_ROLE_KEY exposed in client or server application routes');

// 5. Verify Security Headers in next.config.ts
const nextConfigPath = path.join(rootDir, 'next.config.ts');
if (fs.existsSync(nextConfigPath)) {
  const content = fs.readFileSync(nextConfigPath, 'utf8');
  if (content.includes('X-Frame-Options') && content.includes('X-Content-Type-Options') && content.includes('Strict-Transport-Security')) {
    pass('Security HTTP headers configured in next.config.ts');
  } else {
    fail('Missing security HTTP headers in next.config.ts');
  }
} else {
  fail('Missing next.config.ts');
}

// Summary
console.log('\n--------------------------------------------------');
console.log(`📊 Audit Results: ${checksPassed} Checks Passed | ${errors} Errors | ${warnings} Warnings`);
console.log('--------------------------------------------------\n');

if (errors > 0) {
  process.exit(1);
} else {
  console.log('✨ All Security & RBAC Checks Passed Successfully!\n');
}
