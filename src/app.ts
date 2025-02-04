import express from 'express';
import morgan from 'morgan';
import helmet from 'helmet';
import cors from 'cors';
import path from 'path';

import router from './routes';

import { errorHandler } from './middlewares/errorHandler';
import { notFoundHandler } from './middlewares/notFoundHandler';
import MessageResponse from './types/messageResponse.type';
import { Code } from './types/code';

require('dotenv').config();

const app = express();

app.use(morgan('dev'));
app.use(helmet());
app.use(cors());
app.use(express.json());

app.get<{}, MessageResponse>('/', (req, res) => {
  res.json({
    code: Code.SUCCESS,
    message: '🦄🌈✨👋🌎🌍🌏✨🌈🦄',
    data: null
  });
});

app.use("/o", express.static(path.join(__dirname, "../uploads")));

app.use('/api', router);

app.use(notFoundHandler);
app.use(errorHandler);

export default app;
