import ProductModel from '../models/Product.js';

function getAllProducts(req, res) {
    const products = ProductModel.findAll();
    res.send({data: products});
}

function getProductById(req, res) {
    const id = req.params.id;
    const product = ProductModel.findById(id);
    if (!product) {
        res.status(404).send({message: 'Product was not found!'}); 
    } else {
        res.status(200).send({data: product});
    }
}



function createProduct(req, res) {
    const body = req.body;
    const products = ProductModel.createProduct(body);
    if (res) {
        res.status(201).json({message: "Product created!"})
    } else {
        res.status(400).json({message: "Product creation failed!"});
    }
}

export default { getAllProducts, getProductById, createProduct }