import express, { Request, Response } from 'express';
import path from 'path';

const port = 8000;
const app = express();

// КОНФИГУРАЦИЯ ПРИЛОЖЕНИЯ
// ==================================================
// сообщаем Node где лежат ресурсы сайта
app.use(express.static(path.join(__dirname, '../public')));

// устанавливаем движок EJS для представления
app.set('view engine', 'ejs');

app.get('/login', function (req, res) {
	res.render('pages/login');
});

app.get('/register', function (req, res) {
	res.render('pages/register');
});

app.get('/input', function (req, res) {
	res.render('pages/input');
});

app.post('/report', function (req, res) {
	res.render('pages/report');
});

app.listen(port, () => {
	console.log(`Server started on http://localhost:${port}/login`);
});
