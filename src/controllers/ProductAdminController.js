// Importa os novos models que acabamos de criar
const {
  createProduct,
  updateProduct,
  deleteProduct,
  findProductById
} = require('../models/ProductModel.js');

/**
 * Controller para CRIAR um novo produto.
 * (Rota: POST /admin/products)
 */
const adminCreateProduct = async (req, res) => {
  try {
    const productData = req.body;

    // Validação simples de campos obrigatórios
    if (!productData.nome || !productData.preco || !productData.categoria) {
      return res.status(400).json({ message: 'Nome, preço e categoria são obrigatórios.' });
    }

    // Validação de preço numérico e positivo
    const preco = parseFloat(productData.preco);
    if (isNaN(preco) || preco <= 0) {
      return res.status(400).json({ message: 'Preço deve ser um número positivo.' });
    }

    // Validação de categoria válida
    const categoriasValidas = ['feminino', 'masculino', 'unissex'];
    if (!categoriasValidas.includes(productData.categoria.toLowerCase())) {
      return res.status(400).json({ 
        message: 'Categoria inválida. Use: ' + categoriasValidas.join(', ') 
      });
    }

    // Normaliza dados antes de salvar
    const dadosLimpos = {
      ...productData,
      preco: preco,
      categoria: productData.categoria.toLowerCase()
    };
    
    const newProductId = await createProduct(dadosLimpos);

    res.status(201).json({
      message: 'Produto criado com sucesso!',
      productId: newProductId
    });

  } catch (error) {
    console.error('[AdminController] Erro ao criar produto:', error);
    res.status(500).json({ message: 'Erro interno do servidor.' });
  }
};

/**
 * Controller para ATUALIZAR um produto.
 * (Rota: PUT /admin/products/:id)
 */
const adminUpdateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const productData = req.body;

    // 1. Verifica se há dados para atualizar
    if (Object.keys(productData).length === 0) {
      return res.status(400).json({ message: 'Nenhum dado fornecido para atualização.' });
    }

    // 2. Validação de preço se fornecido
    if (productData.preco !== undefined) {
      const preco = parseFloat(productData.preco);
      if (isNaN(preco) || preco <= 0) {
        return res.status(400).json({ message: 'Preço deve ser um número positivo.' });
      }
      productData.preco = preco;
    }

    // 3. Validação de categoria se fornecida
    if (productData.categoria !== undefined) {
      const categoriasValidas = ['feminino', 'masculino', 'infantil', 'unissex'];
      if (!categoriasValidas.includes(productData.categoria.toLowerCase())) {
        return res.status(400).json({ 
          message: 'Categoria inválida. Use: ' + categoriasValidas.join(', ') 
        });
      }
      productData.categoria = productData.categoria.toLowerCase();
    }

    // 4. Tenta atualizar
    const affectedRows = await updateProduct(id, productData);

    // 5. Verifica se o produto existia
    if (affectedRows === 0) {
      return res.status(404).json({ message: 'Produto não encontrado ou nenhum dado foi alterado.' });
    }

    res.status(200).json({
      message: 'Produto atualizado com sucesso!',
      productId: id
    });

  } catch (error) {
    console.error('[AdminController] Erro ao atualizar produto:', error);
    res.status(500).json({ message: 'Erro interno do servidor.' });
  }
};

/**
 * Controller para DELETAR um produto.
 * (Rota: DELETE /admin/products/:id)
 */
const adminDeleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    
    // 1. (Opcional, mas bom) Verifica se o produto existe
    const product = await findProductById(id);
    if (!product) {
      return res.status(404).json({ message: 'Produto não encontrado.' });
    }

    // 2. Tenta deletar
    await deleteProduct(id);

    res.status(200).json({
      message: 'Produto deletado com sucesso.',
      deletedProduct: product
    });

  } catch (error) {
    console.error('[AdminController] Erro ao deletar produto:', error);
    res.status(500).json({ message: 'Erro interno do servidor.' });
  }
};

module.exports = {
  adminCreateProduct,
  adminUpdateProduct,
  adminDeleteProduct
};