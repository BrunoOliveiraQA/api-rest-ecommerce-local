const { Router } = require('express');

// Importa o nosso "segurança"
const authMiddleware = require('../middlewares/authMiddleware.js');

// Importa os controllers do carrinho
const { getCart, addItem, removeItem } = require('../controllers/CartController.js');

const cartRouter = Router();

// --- Definição das Rotas do Carrinho ---
//
// IMPORTANTE: Todas as rotas definidas aqui vão primeiro
// passar pelo 'authMiddleware' antes de chegar ao controller.
//
// Se o token for inválido, o middleware vai barrar a requisição.

/**
 * @route   GET /cart
 * @desc    Busca o carrinho completo do usuário logado
 * @access  Private (Requer Token JWT)
 */
cartRouter.get('/', authMiddleware, getCart);

/**
 * @route   POST /cart/add
 * @desc    Adiciona ou atualiza um item no carrinho
 * @access  Private (Requer Token JWT)
 * @body    { "productId": Number, "quantidade": Number }
 */
cartRouter.post('/add', authMiddleware, addItem);

/**
 * @route   DELETE /cart/remove/:productId
 * @desc    Remove um item do carrinho pelo ID do produto
 * @access  Private (Requer Token JWT)
 */
cartRouter.delete('/remove/:productId', authMiddleware, removeItem);


// Exporta o roteador
module.exports = cartRouter;