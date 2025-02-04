import { Router } from 'express';

import recordRouter from '../modules/record/record.routes';

const router = Router();

router.use('/record', recordRouter);

export default router
