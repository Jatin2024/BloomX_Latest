const { spawn } = require('child_process');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');

const client = spawn('npm', ['run', 'dev', '--prefix', 'client'], {
  cwd: rootDir,
  stdio: 'inherit',
  shell: true
});

const server = spawn('npm', ['run', 'dev', '--prefix', 'server'], {
  cwd: rootDir,
  stdio: 'inherit',
  shell: true
});

client.on('exit', (code) => {
  server.kill();
  process.exit(code || 0);
});

server.on('exit', (code) => {
  client.kill();
  process.exit(code || 0);
});
