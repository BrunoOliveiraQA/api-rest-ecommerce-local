// Importa os models que vamos usar
const { 
  findAllProducts, 
  findProductById, 
  findProductsByCategory 
} = require('../models/ProductModel.js');

/**
 * Controller para listar TODOS os produtos.
 */
const getAllProducts = async (req, res) => {
  try {
    // 1. Tenta buscar os produtos pela categoria (query param)
    const { categoria } = req.query; // Ex: /products?categoria=masculino

    let products;

    if (categoria) {
      // Se uma categoria foi fornecida, filtra por ela
      products = await findProductsByCategory(categoria);
    } else {
      // Se não, busca todos
      products = await findAllProducts();
    }

    // 2. Retorna a lista de produtos
    res.status(200).json(products);

  } catch (error) {
    console.error('[ProductController] Erro em getAllProducts:', error);
    res.status(500).json({ message: 'Erro interno do servidor ao buscar produtos.' });
  }
};

/**
 * Controller para buscar UM produto pelo ID.
 */
const getProductById = async (req, res) => {
  try {
    // 1. Pega o ID dos parâmetros da rota (ex: /products/3)
    const { id } = req.params;

    // 2. Chama o model para buscar no banco
    const product = await findProductById(id);

    // 3. Verifica se o produto foi encontrado
    if (!product) {
      return res.status(404).json({ message: 'Produto não encontrado.' });
    }

    // 4. Retorna o produto
    res.status(200).json(product);

  } catch (error) {
    console.error('[ProductController] Erro em getProductById:', error);
    res.status(500).json({ message: 'Erro interno do servidor ao buscar produto.' });
  }
};

module.exports = {
  getAllProducts,
  getProductById
};