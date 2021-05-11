import express from 'express';
import bodyParser from 'body-parser';

const app = express();
const PORT = 4000;

app.use(bodyParser.json());

app.use(express.static('public'));

app.listen(PORT, () => console.log('I am listening on port', PORT));
