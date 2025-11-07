// Importa o pool de conexões com o banco de dados
const pool = require('../config/db.js');

/**
 * Model para criar um novo usuário no banco de dados.
 * IMPORTANTE: Esta função usa uma TRANSAÇÃO.
 * Ela garante que, ao criar um usuário, um carrinho VAZIO
 * também seja criado para ele. Se uma das operações falhar,
 * nenhuma delas é executada (rollback).
 */
const createUser = async (nome, email, passwordHash, whatsapp) => {
  let connection; // Declara a conexão fora do try para que possa ser usada no finally

  try {
    // 1. Pega uma conexão do pool
    connection = await pool.getConnection();
    
    // 2. Inicia a transação
    await connection.beginTransaction();

    // 3. Insere o novo usuário na tabela 'users'
    const [userResult] = await connection.query(
      'INSERT INTO users (nome, email, password_hash, whatsapp) VALUES (?, ?, ?, ?)',
      [nome, email, passwordHash, whatsapp]
    );

    // Pega o ID do usuário recém-criado
    const newUserId = userResult.insertId;

    // 4. Cria um carrinho vazio para este novo usuário na tabela 'carts'
    await connection.query(
      'INSERT INTO carts (user_id) VALUES (?)',
      [newUserId]
    );

    // 5. Se tudo deu certo, "comita" (salva) as alterações no banco
    await connection.commit();

    // Retorna o ID do novo usuário
    return newUserId;

  } catch (error) {
    // 6. Se algo deu errado, "desfaz" (rollback) todas as alterações
    if (connection) {
      await connection.rollback();
    }
    // Loga o erro e o "lança" para ser tratado pelo Controller
    console.error('[UserModel] Erro ao criar usuário (com transação):', error);
    throw new Error('Erro no banco de dados ao tentar criar usuário.');
  
  } finally {
    // 7. Independentemente de sucesso ou falha, libera a conexão de volta ao pool
    if (connection) {
      connection.release();
    }
  }
};

/**
 * Model para buscar um usuário pelo seu email.
 * Usado principalmente para a tela de LOGIN.
 */
const findUserByEmail = async (email) => {
  try {
    // Executa a query para buscar o usuário
    const [rows] = await pool.query(
      'SELECT * FROM users WHERE email = ?',
      [email]
    );
    
    // Retorna o primeiro (e único) usuário encontrado, ou undefined
    return rows[0];

  } catch (error) {
    console.error('[UserModel] Erro ao buscar usuário por email:', error);
    throw new Error('Erro no banco de dados ao buscar usuário.');
  }
};

/**
 * Model para buscar um usuário pelo seu ID.
 * Usado para autenticação (validar token) e buscar dados do perfil.
 * Note que NÃO retornamos o 'password_hash' por segurança.
 */
const findUserById = async (id) => {
  try {
    const [rows] = await pool.query(
      'SELECT id, nome, email, whatsapp, created_at FROM users WHERE id = ?',
      [id]
    );
    
    return rows[0];

  } catch (error) {
    console.error('[UserModel] Erro ao buscar usuário por ID:', error);
    throw new Error('Erro no banco de dados ao buscar usuário.');
  }
};

module.exports = {
  createUser,
  findUserByEmail,
  findUserById
};