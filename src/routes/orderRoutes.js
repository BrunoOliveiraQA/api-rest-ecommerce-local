const { Router } = require('express');

// Importa o nosso "segurança"
const authMiddleware = require('../middlewares/authMiddleware.js');

// Importa o controller da ordem
const { createWhatsappOrder } = require('../controllers/OrderController.js');

const orderRouter = Router();

/**
 * @route   POST /order/checkout
 * @desc    Processa o carrinho e retorna uma URL de WhatsApp
 * @access  Private (Requer Token JWT)
 */
orderRouter.post('/checkout', authMiddleware, createWhatsappOrder);

// Exporta o roteador
module.exports = orderRouter;