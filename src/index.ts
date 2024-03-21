import express from 'express';
import {createServer} from 'http';
import {Server} from 'socket.io';
import {ApplicationConfig, MindspotApplication} from './application';
export * from './application';

export async function main(options: ApplicationConfig = {}) {
  const app = new MindspotApplication(options);
  const ser = express();
  const server = createServer(ser);
  const io = new Server(server);
  io.on('connection', socket => {
    console.log('a user connected');
    socket.on('send-message', data => {
      console.log(data);
    });
    socket.on('disconnect', () => {
      console.log('user disconnected');
    });
  });
  server.listen(3001, () => {
    console.log('server running at http://localhost:3001');
  });
  await app.boot();
  await app.start();

  const url = app.restServer.url;
  console.log(`Server is running at ${url}`);
  console.log(`Try ${url}/ping`);

  return app;
}

if (require.main === module) {
  // Run the application
  const config = {
    rest: {
      port: +(process.env.PORT ?? 3000),
      host: process.env.HOST,
      // The `gracePeriodForClose` provides a graceful close for http/https
      // servers with keep-alive clients. The default value is `Infinity`
      // (don't force-close). If you want to immediately destroy all sockets
      // upon stop, set its value to `0`.
      // See https://www.npmjs.com/package/stoppable
      gracePeriodForClose: 5000, // 5 seconds
      openApiSpec: {
        // useful when used with OpenAPI-to-GraphQL to locate your application
        setServersFromRequest: true,
      },
    },
  };
  main(config).catch(err => {
    console.error('Cannot start the application.', err);
    process.exit(1);
  });
}
