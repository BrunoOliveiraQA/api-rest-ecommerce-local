// Carrega as variáveis de ambiente do arquivo .env
require('dotenv').config();

// Importa a aplicação Express configurada (do app.js)
const app = require('./app.js');

// Importa nossa função de teste de conexão
const { testConnection } = require('./config/db.js'); // <-- NOVA LINHA

// Define a porta. Busca da variável de ambiente PORT, ou usa 3333 como padrão.
const PORT = process.env.PORT || 3333;

// --- Função para iniciar o servidor ---
async function startServer() {
  try {
    // 1. Testa a conexão com o banco de dados
    await testConnection(); // <-- NOVA LINHA

    // 2. Se a conexão for bem-sucedida, inicia o servidor web
    app.listen(PORT, () => {
      console.log(`[SERVER] Servidor rodando com sucesso na porta ${PORT} 🚀`);
      console.log(`[SERVER] Acesse http://localhost:${PORT}`);
    });

  } catch (error) {
    // Se a conexão com o banco falhar, a aplicação não deve iniciar
    console.error('[SERVER] Falha ao iniciar o servidor:', error.message);
    process.exit(1); // Encerra a aplicação
  }
}

// Chama a função para iniciar o servidor
startServer(); // <-- MODIFICADO