const pool = require('../config/db.js');

/**
 * Helper: Encontra ou cria o cart_id de um usuário.
 * A maioria das nossas funções de carrinho vai precisar disso.
 */
const getCartIdByUserId = async (userId) => {
  try {
    // Primeiro tenta encontrar um carrinho existente
    const [rows] = await pool.query(
      'SELECT id FROM carts WHERE user_id = ?',
      [userId]
    );

    if (rows.length > 0) {
      return rows[0].id; // Retorna o ID do carrinho existente
    }

    // Se não encontrou, cria um novo carrinho para o usuário
    console.log(`[CartModel] Criando novo carrinho para usuário ${userId}`);
    const [result] = await pool.query(
      'INSERT INTO carts (user_id) VALUES (?)',
      [userId]
    );

    return result.insertId; // Retorna o ID do novo carrinho

  } catch (error) {
    console.error('[CartModel] Erro ao buscar/criar cart_id:', error);
    // Se o erro for o "não encontrado" que nós mesmos criamos, apenas o relance
    if (error.message.includes('Carrinho não encontrado')) {
      throw error;
    }
    // Para outros erros (ex: falha no banco), lance um erro genérico
    throw new Error('Erro no banco de dados ao buscar carrinho.');
  }
};

/**
 * Model para buscar o conteúdo completo do carrinho de um usuário.
 * Esta query é a mais importante:
 * 1. Junta 'cart_items' com 'products'
 * 2. Filtra pelo 'cart_id' (que encontramos usando o 'user_id')
 * 3. Retorna os detalhes de CADA produto no carrinho.
 */
const findCartByUserId = async (userId) => {
  try {
    const cartId = await getCartIdByUserId(userId);

    const [items] = await pool.query(
      `SELECT 
         ci.product_id, 
         ci.quantidade,
         p.nome,
         p.preco,
         p.imagem_url,
         (ci.quantidade * p.preco) AS subtotal
       FROM cart_items ci
       JOIN products p ON ci.product_id = p.id
       WHERE ci.cart_id = ?`,
      [cartId]
    );

    // Retorna a lista de itens. O Controller vai calcular o total.
    return items;

  } catch (error) {
    console.error('[CartModel] Erro ao buscar carrinho completo:', error);
    throw new Error('Erro no banco de dados ao buscar itens do carrinho.');
  }
};

/**
 * Model para adicionar ou ATUALIZAR um item no carrinho.
 * Usamos a sintaxe "INSERT ... ON DUPLICATE KEY UPDATE", que é perfeita para carrinhos:
 * - Se o produto NÃO existe no carrinho, ele INSERE.
 * - Se o produto JÁ existe, ele ATUALIZA a quantidade.
 */
const addItemToCart = async (userId, productId, quantidade) => {
  try {
    const cartId = await getCartIdByUserId(userId);

    // A query 'cart_product_UNIQUE' que criamos no SQL (Passo 4)
    // é o que permite o ON DUPLICATE KEY funcionar.
    const [result] = await pool.query(
      `INSERT INTO cart_items (cart_id, product_id, quantidade) 
       VALUES (?, ?, ?)
       ON DUPLICATE KEY UPDATE quantidade = quantidade + VALUES(quantidade)`,
      [cartId, productId, quantidade, quantidade] // Passamos a quantidade 2x
    );

    return result;

  } catch (error) {
    console.error('[CartModel] Erro ao adicionar/atualizar item:', error);
    // Verifica se o erro é por causa de um produto que não existe (foreign key constraint)
    if (error.code === 'ER_NO_REFERENCED_ROW_2') {
      throw new Error('Produto não encontrado no catálogo.');
    }
    throw new Error('Erro no banco de dados ao adicionar item ao carrinho.');
  }
};

/**
 * Model para remover um item do carrinho.
 * (Poderíamos usar a função acima com quantidade 0, mas
 * um DELETE explícito é mais limpo).
 */
const removeItemFromCart = async (userId, productId) => {
  try {
    const cartId = await getCartIdByUserId(userId);

    const [result] = await pool.query(
      'DELETE FROM cart_items WHERE cart_id = ? AND product_id = ?',
      [cartId, productId]
    );

    return result;

  } catch (error) {
    console.error('[CartModel] Erro ao remover item:', error);
    throw new Error('Erro no banco de dados ao remover item do carrinho.');
  }
};

/**
 * Model para LIMPAR o carrinho (remover todos os itens).
 * Usado após o "checkout".
 */
const clearCart = async (userId) => {
  try {
    const cartId = await getCartIdByUserId(userId);

    const [result] = await pool.query(
      'DELETE FROM cart_items WHERE cart_id = ?',
      [cartId]
    );

    return result;

  } catch (error) {
    console.error('[CartModel] Erro ao limpar o carrinho:', error);
    throw new Error('Erro no banco de dados ao limpar o carrinho.');
  }
};

module.exports = {
  findCartByUserId,
  addItemToCart,
  removeItemFromCart,
  clearCart
};