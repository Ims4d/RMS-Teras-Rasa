import { Router } from 'express';

const router = Router();

router.get('/', (_req, res, _next) => {
    res.render('index', { title: 'RMS Teras Rasa' });
});

export default router;
