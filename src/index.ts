import { Server } from './server';


const server = new Server();

server.app.listen(process.env.PORT || 8080, () => {
  console.log('working...');
});