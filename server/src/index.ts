import dotenv from 'dotenv';
import Server from './server';
dotenv.config({ path: 'env/.env' });
const server = new Server();
server.start();