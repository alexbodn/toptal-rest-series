import dotenv from 'dotenv';
const dotenvResult = dotenv.config();
if (dotenvResult.error) { throw dotenvResult.error; }

import express from 'express';
import * as http from 'http';
import * as bodyparser from 'body-parser';
import * as winston from 'winston';
import * as expressWinston from 'express-winston';
import cors from 'cors'
import {CommonRoutesConfig} from './common/common.routes.config';
import {UsersRoutes} from './users/users.routes.config';
import {AuthRoutes} from './auth/auth.routes.config';
import debug from 'debug';
import helmet from 'helmet';

const app: express.Application = express();
const server: http.Server = http.createServer(app);
const port = 3000;
const routes: Array<CommonRoutesConfig> = [];
const debugLog: debug.IDebugger = debug('app');

app.use(bodyparser.json());
app.use(cors());
app.use(helmet());

app.use(expressWinston.logger({
    transports: [
        new winston.transports.Console()
    ],
    format: winston.format.combine(
        winston.format.json(),
        winston.format.prettyPrint(),
        winston.format.colorize({ all: true }),
    ),    
}));

routes.push(new UsersRoutes(app));
routes.push(new AuthRoutes(app));

app.use(expressWinston.errorLogger({
    transports: [
        new winston.transports.Console()
    ],
    format: winston.format.combine(
        winston.format.colorize(),
        winston.format.json()
    )
}));

app.get('/', (req: express.Request, res: express.Response) => {
    res.status(200).send(`Server running at http://localhost:${port}`)
});
export default server.listen(port, () => {
    debugLog(`Server running at http://localhost:${port}`);
    routes.forEach((route: CommonRoutesConfig) => {
        debugLog(`Routes configured for ${route.getName()}`);
    });
});
