import { createServer } from 'http';
import app from './app';
import { config } from './config/env';
import { connectDB } from './config/database';

const { LOCAL_PORT, PORT } = config;
const port = PORT || LOCAL_PORT;

const server = createServer(app);

connectDB()
  .then(() =>
    server.listen(port, () => {
      process.stdout.write(`[server] listening on port ${port}\n`);
    }),
  )
  .catch((err) => {
    process.stderr.write(`[server] startup failed: ${err}\n`);
    process.exit(1);
  });
