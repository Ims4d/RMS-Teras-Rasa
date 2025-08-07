import { Router } from 'express';

const router = Router();

router.get('/', (_req, res, _next) => {
    res.render('dashboard/admin', { title: 'Dashboard Admin' });
});

export default router;
