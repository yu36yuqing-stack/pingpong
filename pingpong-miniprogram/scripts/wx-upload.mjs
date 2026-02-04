import ci from 'miniprogram-ci';
import fs from 'node:fs';
import path from 'node:path';

// Usage:
//   WECHAT_PRIVATE_KEY_PATH=/abs/path/to/private.key npm run upload
//   (optional)
//   VERSION=1.0.0 DESC="demo" npm run upload
//
// Notes:
// - The private key is the one you download from WeChat Mini Program后台 (miniprogram-ci upload key).
// - DO NOT commit the key to git.

const projectPath = path.resolve(process.cwd(), 'miniprogram');
const projectConfigPath = path.resolve(process.cwd(), 'project.config.json');

if (!fs.existsSync(projectConfigPath)) {
  throw new Error(`Missing ${projectConfigPath}`);
}

const cfg = JSON.parse(fs.readFileSync(projectConfigPath, 'utf-8'));
const appid = cfg.appid;
if (!appid) throw new Error('Missing appid in project.config.json');

const privateKeyPath = process.env.WECHAT_PRIVATE_KEY_PATH;
if (!privateKeyPath) {
  throw new Error('Missing env WECHAT_PRIVATE_KEY_PATH (abs path to upload private key)');
}
if (!fs.existsSync(privateKeyPath)) {
  throw new Error(`WECHAT_PRIVATE_KEY_PATH not found: ${privateKeyPath}`);
}

const version = process.env.VERSION || '0.0.1';
const desc = process.env.DESC || `auto upload ${new Date().toISOString()}`;

const project = new ci.Project({
  appid,
  type: 'miniProgram',
  projectPath,
  privateKeyPath,
  ignores: ['node_modules/**/*'],
});

console.log('Uploading...');
console.log('  appid:', appid);
console.log('  projectPath:', projectPath);
console.log('  version:', version);
console.log('  desc:', desc);

await ci.upload({
  project,
  version,
  desc,
  setting: {
    es6: true,
    minify: true,
    autoPrefixWXSS: true,
  },
});

console.log('Upload done.');
