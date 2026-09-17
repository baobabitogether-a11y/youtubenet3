import fs from 'fs';
import path from 'path';

/**
 * Script to update README.md repository owner / user name in all links & badge URLs.
 * Usage: node scripts/update-readme.mjs [username]
 */
const targetUser = process.argv[2] || process.env.GITHUB_REPOSITORY_OWNER || process.env.GITHUB_USER || 'mostuf25563';
const readmePath = path.resolve(process.cwd(), 'README.md');

if (!fs.existsSync(readmePath)) {
  console.error('❌ README.md file not found at:', readmePath);
  process.exit(1);
}

let content = fs.readFileSync(readmePath, 'utf8');

// Replace previous username patterns (e.g. mostuf25561) with targetUser
const oldUserRegex = /mostuf\d+/g;
const updatedContent = content.replace(oldUserRegex, targetUser);

fs.writeFileSync(readmePath, updatedContent, 'utf8');
console.log(`✅ README.md successfully updated with repository username: "${targetUser}"`);
