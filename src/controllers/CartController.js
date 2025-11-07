const {
  findCartByUserId,
  addItemToCart,
  removeItemFromCart,
} = require('../models/CartModel.js');

/**
 * Controller para buscar o carrinho do usuário logado.
 */
const getCart = async (req, res) => {
  try {
    // O ID do usuário não vem do body ou params, vem do token JWT
    // que o authMiddleware validou e anexou em 'req.user'
    const userId = req.user.id; 

    const items = await findCartByUserId(userId);

    // Calcula o total do carrinho
    const total = items.reduce((acc, item) => {
      // Usamos parseFloat para garantir que estamos somando números
      return acc + (parseFloat(item.preco) * item.quantidade);
    }, 0);

    // Retorna os itens e o total formatado
    res.status(200).json({
      items: items,
      total: parseFloat(total.toFixed(2)) // Arredonda para 2 casas decimais
    });

  } catch (error) {
    console.error('[CartController] Erro em getCart:', error);
    res.status(500).json({ message: 'Erro interno do servidor ao buscar carrinho.' });
  }
};

/**
 * Controller para adicionar/atualizar um item no carrinho.
 * O Model (addItemToCart) já lida com a lógica de
 * "inserir ou atualizar se já existir".
 */
const addItem = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId, quantidade } = req.body;

    if (!productId || quantidade == null) {
      return res.status(400).json({ message: 'ProductId e Quantidade são obrigatórios.' });
    }

    if (quantidade <= 0) {
      return res.status(400).json({ message: 'Quantidade deve ser maior que zero.' });
    }

    // Chama o model
    await addItemToCart(userId, productId, quantidade);

    // Responde com o carrinho atualizado
    const updatedCartItems = await findCartByUserId(userId);
    const total = updatedCartItems.reduce((acc, item) => {
      return acc + (parseFloat(item.preco) * item.quantidade);
    }, 0);

    res.status(200).json({
      message: 'Item adicionado/atualizado com sucesso!',
      cart: {
        items: updatedCartItems,
        total: parseFloat(total.toFixed(2))
      }
    });

  } catch (error) {
    // Trata o erro de "Produto não encontrado" que criamos no Model
    if (error.message.includes('Produto não encontrado')) {
      return res.status(404).json({ message: 'Produto não encontrado no catálogo.' });
    }
    console.error('[CartController] Erro em addItem:', error);
    res.status(500).json({ message: 'Erro interno do servidor ao adicionar item.' });
  }
};

/**
 * Controller para remover um item do carrinho.
 */
const removeItem = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId } = req.params; // Pega o ID do produto da URL (ex: /cart/remove/3)

    if (!productId) {
      return res.status(400).json({ message: 'ProductId (na URL) é obrigatório.' });
    }

    const result = await removeItemFromCart(userId, Number(productId));

    // O 'affectedRows' diz se alguma linha foi realmente deletada
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Item não encontrado no carrinho.' });
    }

    res.status(200).json({ message: 'Item removido com sucesso do carrinho.' });

  } catch (error) {
    console.error('[CartController] Erro em removeItem:', error);
    res.status(500).json({ message: 'Erro interno do servidor ao remover item.' });
  }
};

module.exports = {
  getCart,
  addItem,
  removeItem
};