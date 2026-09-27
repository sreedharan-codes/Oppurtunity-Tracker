import { execSync } from 'child_process';

const message = process.argv.slice(2).join(' ') || `update: ${new Date().toISOString()}`;

try {
  console.log(`[Sync] Staging all files...`);
  execSync('git add -A', { stdio: 'inherit' });

  // Check if there are changes to commit
  const status = execSync('git status --porcelain').toString().trim();
  if (!status) {
    console.log('[Sync] No changes detected to commit.');
  } else {
    console.log(`[Sync] Committing with message: "${message}"`);
    execSync(`git commit -m "${message}"`, { stdio: 'inherit' });
  }

  console.log(`[Sync] Pushing to GitHub (origin main)...`);
  execSync('git push origin main', { stdio: 'inherit' });
  console.log('✅ Successfully pushed to GitHub!');
} catch (err) {
  console.error('[Sync Error]:', err.message);
  process.exit(1);
}
