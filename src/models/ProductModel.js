const pool = require('../config/db.js');

/**
 * Model para buscar TODOS os produtos do catálogo.
 */
const findAllProducts = async () => {
  try {
    // Note que não selecionamos todas as colunas (*), mas apenas as que
    // o frontend realmente precisa. É uma boa prática.
    const [rows] = await pool.query(
      'SELECT id, nome, descricao, preco, categoria, imagem_url FROM products'
    );
    return rows;

  } catch (error) {
    console.error('[ProductModel] Erro ao buscar todos os produtos:', error);
    throw new Error('Erro no banco de dados ao buscar produtos.');
  }
};

/**
 * Model para buscar UM produto pelo seu ID.
 */
const findProductById = async (id) => {
  try {
    const [rows] = await pool.query(
      'SELECT id, nome, descricao, preco, categoria, imagem_url FROM products WHERE id = ?',
      [id]
    );
    
    // Retorna o primeiro (e único) produto encontrado, ou undefined
    return rows[0];

  } catch (error) {
    console.error('[ProductModel] Erro ao buscar produto por ID:', error);
    throw new Error('Erro no banco de dados ao buscar produto.');
  }
};

/**
 * Model para buscar produtos por CATEGORIA.
 */
const findProductsByCategory = async (categoria) => {
  try {
    const [rows] = await pool.query(
      'SELECT id, nome, descricao, preco, categoria, imagem_url FROM products WHERE categoria = ?',
      [categoria]
    );
    return rows;

  } catch (error) {
    console.error('[ProductModel] Erro ao buscar produtos por categoria:', error);
    throw new Error('Erro no banco de dados ao buscar produtos.');
  }
};

/**
 * Model para CRIAR um novo produto no banco.
 * (Ação de Admin)
 */
const createProduct = async (productData) => {
  const { nome, descricao, preco, categoria, imagem_url } = productData;
  
  // Validação básica (embora o controller deva fazer isso)
  if (!nome || !preco || !categoria) {
    throw new Error('Nome, preço e categoria são obrigatórios.');
  }

  try {
    const [result] = await pool.query(
      'INSERT INTO products (nome, descricao, preco, categoria, imagem_url) VALUES (?, ?, ?, ?, ?)',
      [nome, descricao, preco, categoria, imagem_url]
    );
    
    // Retorna o ID do produto recém-criado
    return result.insertId;

  } catch (error) {
    console.error('[ProductModel] Erro ao criar produto:', error);
    throw new Error('Erro no banco de dados ao criar produto.');
  }
};

/**
 * Model para ATUALIZAR um produto existente pelo ID.
 * (Ação de Admin)
 */
const updateProduct = async (id, productData) => {
  const { nome, descricao, preco, categoria, imagem_url } = productData;

  try {
    // Esta query é mais complexa: ela só atualiza os campos que foram enviados.
    // Usamos 'COALESCE(?, nome)' que significa: "Use o novo valor (?), 
    // mas se for NULO, use o valor que já existe (nome)".
    const [result] = await pool.query(
      `UPDATE products SET 
         nome = COALESCE(?, nome),
         descricao = COALESCE(?, descricao),
         preco = COALESCE(?, preco),
         categoria = COALESCE(?, categoria),
         imagem_url = COALESCE(?, imagem_url)
       WHERE id = ?`,
      [nome, descricao, preco, categoria, imagem_url, id]
    );

    // 'affectedRows' diz se algum produto foi realmente atualizado
    return result.affectedRows;

  } catch (error) {
    console.error('[ProductModel] Erro ao atualizar produto:', error);
    throw new Error('Erro no banco de dados ao atualizar produto.');
  }
};

/**
 * Model para DELETAR um produto pelo ID.
 * (Ação de Admin)
 */
const deleteProduct = async (id) => {
  try {
    const [result] = await pool.query(
      'DELETE FROM products WHERE id = ?',
      [id]
    );
    
    // 'affectedRows' diz se algum produto foi deletado
    return result.affectedRows;

  } catch (error) {
    // Se o produto estiver em um carrinho, o DB vai dar um erro de Foreign Key
    // (a menos que tenhamos configurado ON DELETE CASCADE, o que fizemos!)
    // Graças ao 'ON DELETE CASCADE' na tabela 'cart_items',
    // o produto será removido dos carrinhos automaticamente.
    console.error('[ProductModel] Erro ao deletar produto:', error);
    throw new Error('Erro no banco de dados ao deletar produto.');
  }
};

module.exports = {
  findAllProducts,
  findProductById,
  findProductsByCategory,
  createProduct,
  updateProduct,
  deleteProduct
};