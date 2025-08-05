import createError from 'http-errors';
import express from 'express';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import session from 'express-session';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

import indexRouter from './routes/index.js';
import loginRouter from './routes/login.js';

import dashboardKokiRouter from './routes/dashboard/koki.js';
import dashboardPelayanRouter from './routes/dashboard/pelayan.js';
import dashboardKasirRouter from './routes/dashboard/kasir.js';

import pemesananRouter from './routes/pemesanan.js';

// Konversi __dirname untuk ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

app.set('views', join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(join(__dirname, 'public')));

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 24 * 60 * 60 * 1000 }
}));

app.use('/', indexRouter);
app.use('/login', loginRouter);

app.use('/dashboard/koki', dashboardKokiRouter);
app.use('/dashboard/pelayan', dashboardPelayanRouter);
app.use('/dashboard/kasir', dashboardKasirRouter);

app.use('/pemesanan', pemesananRouter);

// catch 404 and forward to error handler
app.use((_req, _res, next) => next(createError(404)));

// error handler
app.use((err, res, _next) => {
    res.locals.message = err.message;
    res.status(err.status || 500);
    res.render('error');
});

export default app;
