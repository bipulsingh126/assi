import Product from '../models/Product.js';

//   Get all products
//   GET /api/products

export const getProducts = async (req, res) => {
    try {
        // Only get products for the current user
        const products = await Product.find({ user: req.user.id });

        res.status(200).json({
            success: true,
            count: products.length,
            data: products,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
}


//   GET /api/products/:id

export const getProduct = async (req, res) => {
    try {
        const product = await Product.findOne({
            _id: req.params.id,
            user: req.user.id
        });

        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found',
            });
        }

        res.status(200).json({
            success: true,
            data: product,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
}

//    Create new product
//    POST /api/products

export const createProduct = async (req, res) => {
    try {
        // Add user to request body
        req.body.user = req.user.id;

        const product = await Product.create(req.body);

        res.status(201).json({
            success: true,
            data: product,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
}

//   Update product
//   PUT /api/products/:id

export const updateProduct = async (req, res) => {
    try {
        let product = await Product.findOne({
            _id: req.params.id,
            user: req.user.id
        });

        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found or not authorized',
            });
        }

        product = await Product.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });

        res.status(200).json({
            success: true,
            data: product,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
}

//   Delete product
//   DELETE /api/products/:id
//   Private
export const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findOne({
            _id: req.params.id,
            user: req.user.id
        });

        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found or not authorized',
            });
        }

        await product.deleteOne();

        res.status(200).json({
            success: true,
            data: {},
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
} 