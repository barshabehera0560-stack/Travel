import app from './app.js';
import { config } from './config/env.js';
import { prisma } from './config/prisma.js';

// Start server for local dev and standalone node environments
const server = app.listen(config.port, () => {
  console.log(`=========================================`);
  console.log(`  WANDERLY TRAVEL API SERVER RUNNING    `);
  console.log(`  Port: ${config.port} | Mode: ${config.nodeEnv}  `);
  console.log(`  Health: http://localhost:${config.port}/health `);
  console.log(`=========================================`);
});

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('SIGTERM received, closing HTTP server and disconnecting Prisma...');
  server.close(async () => {
    await prisma.$disconnect();
    process.exit(0);
  });
});

export default app;
