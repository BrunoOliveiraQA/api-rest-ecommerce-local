const mysql = require('mysql2/promise');
require('dotenv').config();

// Cria o "pool" de conexões com o banco de dados
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  
  // Limites do pool (ajustáveis conforme a necessidade)
  waitForConnections: true, // Esperar se todas as conexões estiverem em uso
  connectionLimit: 10,      // Número máximo de conexões no pool
  queueLimit: 0             // Limite de requisições na fila (0 = sem limite)
});

// Função para testar a conexão (opcional, mas recomendado)
async function testConnection() {
  try {
    // Pega uma conexão do pool
    const connection = await pool.getConnection();
    
    console.log(`[DATABASE] Conexão com o MySQL estabelecida com sucesso! (ID: ${connection.threadId})`);
    
    // Libera a conexão de volta para o pool
    connection.release();
  } catch (error) {
    console.error('[DATABASE] Erro ao conectar com o MySQL:', error.message);
    // Em um cenário real, você poderia tentar reconectar ou parar a aplicação
    process.exit(1); // Encerra a aplicação se não conseguir conectar ao DB
  }
}

// Exporta o pool para ser usado em outros arquivos (models, controllers)
module.exports = pool;
module.exports.testConnection = testConnection;