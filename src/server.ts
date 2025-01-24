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
      console.log(`server running on *::${port}`);
    }),
  )
  .catch((err) => {
    console.log(err);
    process.exit(1);
  });
