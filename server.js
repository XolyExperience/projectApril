import express from 'express';
import ProductController from './controllers/Product.js'
import bodyParser from'body-parser';

const app = express();
const PORT = 3000;

app.use(bodyParser.json());

// @route GET /api/products
app.get('/api/products', ProductController.getAllProducts);

// @route GET /api/products/:id
app.get('/api/products/:id', ProductController.getProductById);

// @route PUT /api/products/:id         // Update a product by id

// @route DELETE /api/products/:id      // Delete a product by id

// @route POST /api/products            // Create a product
app.post('/api/products', ProductController.createProduct);

app.listen(PORT, () => console.log('I am listening on port', PORT));
