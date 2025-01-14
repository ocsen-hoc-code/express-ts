import { Request, Response, Router } from 'express';

const router = Router();

const testRouter = (req: Request, res: Response) => {
    res.send({
        local_time: new Date().toISOString(),
    });
};

router.get('/', testRouter);

export default router;