const net = require('net');
const { spawn, execSync } = require('child_process');

function getAvailablePort(startPort) {
  return new Promise((resolve, reject) => {
    const tryPort = (port) => {
      const server = net.createServer();

      server.once('error', (error) => {
        if (error.code === 'EADDRINUSE') {
          if (port >= 3000 + 20) {
            reject(new Error('No available port found.'));
            return;
          }
          tryPort(port + 1);
          return;
        }

        reject(error);
      });

      server.once('listening', () => {
        server.close(() => resolve(port));
      });

      server.listen(port, '127.0.0.1');
    };

    tryPort(startPort);
  });
}

function killPortProcesses(port) {
  try {
    const result = execSync(`lsof -ti tcp:${port} || true`, { stdio: ['ignore', 'pipe', 'ignore'] }).toString().trim();
    if (!result) {
      return;
    }

    const pids = result.split('\n').filter(Boolean);
    if (pids.length) {
      execSync(`kill -9 ${pids.join(' ')} || true`, { stdio: 'ignore' });
    }
  } catch (error) {
    // ignore and continue with startup
  }
}

async function main() {
  const preferredPort = Number(process.env.PORT || 3000);
  killPortProcesses(preferredPort);
  const port = await getAvailablePort(preferredPort);
  const command = process.platform === 'win32' ? 'npx.cmd' : 'npx';
  const child = spawn(command, ['next', 'dev', '--hostname', '127.0.0.1', '--port', String(port)], {
    stdio: 'inherit',
    env: { ...process.env, PORT: String(port) },
  });

  child.on('exit', (code) => process.exit(code ?? 0));
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
