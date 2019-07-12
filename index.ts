import {startBot} from './bot';
import {startServer} from './server/express';
import {startPing} from './server/ping';

startPing();
startServer();

startBot();
