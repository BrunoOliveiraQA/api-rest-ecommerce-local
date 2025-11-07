const { Router } = require('express');

// Importa os controllers de produto
const { getAllProducts, getProductById } = require('../controllers/ProductController.js');

const productRouter = Router();

// --- Definição das Rotas de Produtos ---

/**
 * @route   GET /products
 * @desc    Lista todos os produtos.
 * @desc    Pode filtrar por categoria: /products?categoria=masculino
 * @access  Public
 */
productRouter.get('/', getAllProducts);

/**
 * @route   GET /products/:id
 * @desc    Busca um produto específico pelo ID.
 * @access  Public
 */
productRouter.get('/:id', getProductById);


// Exporta o roteador
module.exports = productRouter;