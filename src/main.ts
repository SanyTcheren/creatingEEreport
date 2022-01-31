import express, { Request, Response } from 'express';

const port = 8000;
const app = express();

app.get('/hello', (req: Request, res: Response) => {
	res.send('Hello from Sany!\n');
});

app.listen(port, () => {
	console.log(`Server started on http://localhost:${port}/hello`);
});
