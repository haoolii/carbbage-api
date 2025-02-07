import express from 'express';
import morgan from 'morgan';
import helmet from 'helmet';
import cors from 'cors';
import path from 'path';
import cookieParser from 'cookie-parser';
import { verify } from 'jsonwebtoken';

import router from './routes';

import { errorHandler } from './middlewares/errorHandler';
import { notFoundHandler } from './middlewares/notFoundHandler';

// types
import MessageResponse from './types/messageResponse.type';
import { Code } from './types/code';

// core
import { PUBLIC_KEY } from './core/auth';

require('dotenv').config();

const app = express();

app.use(morgan('dev'));
app.use(helmet());
app.use(cookieParser());
app.use(cors());
app.use(express.json());

app.get<{}, MessageResponse>('/', (req, res) => {
  res.json({
    code: Code.SUCCESS,
    message: '🦄🌈✨👋🌎🌍🌏✨🌈🦄',
    data: null
  });
});

app.use('/o/:filename', async (req, res, next) => {
  const authHeader = req.cookies.Authorization || req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return next("Unauthorized")
  }
  try {
    const token = authHeader.split(" ")[1];
    const payload = verify(token, PUBLIC_KEY, { algorithms: ["RS256"] });
    // TODO: Filter
    next();
  } catch (err) {
    return next(err);
  }
})

app.use("/o", express.static(path.join(__dirname, "../uploads")));

app.use('/api', router);

app.use(notFoundHandler);
app.use(errorHandler);

export default app;
