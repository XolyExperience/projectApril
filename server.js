import express from 'express';

const app = express();
const PORT = 4000;

app.use(express.json());

app.use(express.static('public'));

app.listen(PORT, () => console.log('I am listening on port', PORT));
