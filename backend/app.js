const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const { errors } = require('celebrate');
const { createUser, login } = require('./controllers/users');
const auth = require('./middlewares/auth');
const { signUp, signIn } = require('./middlewares/validation');
const NotFoundError = require('./errors/NotFoundError');
const handlerErrors = require('./middlewares/handleError');
const { requestLogger, errorLogger } = require('./middlewares/logger');

const { PORT = 3000 } = process.env;
const app = express();
mongoose.connect('mongodb://localhost:27017/mestodb ');

app.use(express.json());

app.use(helmet());
app.use(requestLogger);

app.post('/signin', signIn, login);
app.post('/signup', signUp, createUser);
app.use(auth);

app.use('/', require('./routes/users'));
app.use('/', require('./routes/cards'));

app.use('*', (req, res, next) => {
  next(new NotFoundError('Страница не найдена'));
});
app.use(errorLogger);
app.use(errors());
app.use(handlerErrors);

app.listen(PORT);
