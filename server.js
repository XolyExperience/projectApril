import express from 'express';
import fs from 'fs';

const app = express();
const PORT = 3000;

let products = JSON.parse(fs.readFileSync('./data/products.json', 'UTF-8'));

// @route GET /api/products
app.get('/api/products', (req, res) => {
    res.send({data: products});
});

// @route GET /api/products/:id
app.get('/api/products/:id', (req, res) => {
    const product = products.filter(p => p.id === req.params.id);
    if (!product.length) {
        res.status(404).send({message: "Product was not found!"}); 
    } else {
        res.status(200).send({data: product});
    }
});

app.listen(PORT, () => console.log('I am listening on port', PORT));
