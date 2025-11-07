require('dotenv').config();
// Precisamos de models de Usuário e Carrinho
const { findUserById } = require('../models/UserModel.js');
const { findCartByUserId, clearCart } = require('../models/CartModel.js');

/**
 * Controller para "finalizar" a compra.
 * 1. Pega o carrinho do usuário.
 * 2. Pega os dados do usuário.
 * 3. Formata uma mensagem de texto com o pedido.
 * 4. Limpa o carrinho do usuário.
 * 5. Retorna a URL "wa.me" para o frontend redirecionar.
 */
const createWhatsappOrder = async (req, res) => {
  try {
    const userId = req.user.id; // ID do usuário logado (via authMiddleware)

    // 1. Buscar o usuário e o carrinho simultaneamente (melhor performance)
    const [user, items] = await Promise.all([
      findUserById(userId),
      findCartByUserId(userId)
    ]);

    // 2. Validações
    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado.' });
    }
    if (!items || items.length === 0) {
      return res.status(400).json({ message: 'Seu carrinho está vazio.' });
    }

    // 3. Formatar a Mensagem do Pedido
    let messageText = 'Olá! 👋 Gostaria de fazer o seguinte pedido:\n\n';
    let total = 0;

    items.forEach(item => {
      const subtotal = parseFloat(item.preco) * item.quantidade;
      total += subtotal;
      messageText += `*${item.quantidade}x* - ${item.nome} (R$ ${parseFloat(item.preco).toFixed(2)})\n`;
      messageText += `   Subtotal: R$ ${subtotal.toFixed(2)}\n\n`;
    });

    messageText += `----------------------------------\n`;
    messageText += `*VALOR TOTAL: R$ ${total.toFixed(2)}*\n\n`;
    messageText += `----------------------------------\n`;
    messageText += `*Meus Dados para Entrega:*\n`;
    messageText += `Nome: ${user.nome}\n`;
    messageText += `Email: ${user.email}\n`;
    messageText += `WhatsApp: ${user.whatsapp}\n`;

    // 4. Limpar o carrinho do usuário (pois o pedido foi "concluído")
    // Fazemos isso ANTES de enviar a resposta, para garantir a transação.
    await clearCart(userId);

    // 5. Montar a URL final do WhatsApp
    // Pegamos o número do VENDEDOR do .env
    const sellerWhatsapp = process.env.SELLER_WHATSAPP;
    
    // Codificamos a mensagem para que ela possa ser usada em uma URL
    const encodedMessage = encodeURIComponent(messageText);
    
    const whatsappUrl = `https://wa.me/${sellerWhatsapp}?text=${encodedMessage}`;

    // 6. Retornar a URL para o frontend
    res.status(200).json({
      message: 'Pedido pronto para ser enviado via WhatsApp!',
      whatsappUrl: whatsappUrl
    });

  } catch (error) {
    console.error('[OrderController] Erro em createWhatsappOrder:', error);
    res.status(500).json({ message: 'Erro interno do servidor ao processar o pedido.' });
  }
};

module.exports = {
  createWhatsappOrder
};