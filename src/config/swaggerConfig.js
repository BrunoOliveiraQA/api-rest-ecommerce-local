const swaggerUi = require('swagger-ui-express');
const swaggerDefinition = require('../docs/swaggerDef.js');

// Importa todas as partes da documentação
const { schemas } = require('../docs/schemas.js');
const { securitySchemes } = require('../docs/security.js');
const { authPaths } = require('../docs/authPaths.js');
const { productPaths } = require('../docs/productPaths.js');
const { cartPaths } = require('../docs/cartPaths.js');
const { orderPaths } = require('../docs/orderPaths.js');

// 1. IMPORTA O NOVO ARQUIVO DE ROTAS DE ADMIN com fallback robusto
let adminProductPaths = {};
try {
  const adminModule = require('../docs/adminProductPaths.js');
  adminProductPaths = adminModule.adminProductPaths || {};
  console.log('✅ adminProductPaths carregado com sucesso');
} catch (error) {
  console.warn('⚠️ adminProductPaths.js não encontrado, usando objeto vazio como fallback');
  console.warn('Erro:', error.message);
}

// Monta a especificação completa do Swagger
const swaggerSpec = {
  ...swaggerDefinition, // Definição base (info, servers)
  
  // 2. ADICIONA A NOVA TAG DE ADMIN
  tags: [
    { name: 'Autenticação', description: 'Rotas para registro e login' },
    { name: 'Produtos', description: 'Rotas públicas de visualização do catálogo' },
    { name: 'Carrinho', description: 'Rotas privadas para gerenciamento do carrinho' },
    { name: 'Pedido (Checkout)', description: 'Rota privada para finalizar a compra' },
    { name: 'Admin: Produtos', description: 'Rotas de gerenciamento (CRUD) de produtos (Admin)' },
  ],

  // Adiciona os Schemas e Definições de Segurança
  components: {
    schemas: schemas,
    securitySchemes: securitySchemes,
  },

  // 3. JUNTA AS NOVAS ROTAS AO 'paths'
  paths: {
    ...authPaths,
    ...productPaths,
    ...cartPaths,
    ...orderPaths,
    ...adminProductPaths, // <-- ADICIONADO AQUI
  },
};

// Função para configurar o Swagger UI
const setupSwagger = (app) => {
  app.use(
    '/api-docs', // A rota onde a documentação ficará disponível
    swaggerUi.serve,
    swaggerUi.setup(swaggerSpec, { 
      customCss: '.swagger-ui .topbar { display: none }',
      customSiteTitle: 'API Cosméticos - Docs',
      swaggerOptions: {
        docExpansion: 'list',
        filter: true,
        showCommonExtensions: true,
        showExtensions: true,
      },
    })
  );
};

module.exports = setupSwagger;