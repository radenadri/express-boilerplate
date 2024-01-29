import bodyParser from 'body-parser';
import cookies from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';

import { ORIGIN } from './config';
import errorHandler from './middlewares/error-handler';
import { rateLimiter } from './middlewares/rate-limiter';
import routes from './routes';

const app = express();
const API_VERSION = 'v1';

/* Library Middlewares */
app.use(morgan('dev'));
app.use(helmet());
app.use(express.json());
app.use(cookies());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
    cors({
        credentials: true,
        origin: ORIGIN,
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    }),
);

/* App Middlewares */
app.use(errorHandler);
app.use(rateLimiter);

/* Routing */
app.get('/', (_req, res) => res.send('Welcome to the API!'));
app.use(`/api/${API_VERSION}`, routes);

export default app;
