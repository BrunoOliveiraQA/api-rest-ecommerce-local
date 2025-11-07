// Este arquivo define a estrutura base do Swagger/OpenAPI

// NOTA: Vamos usar a especificação OpenAPI 3.0.0
// O "swagger-ui-express" usa um "swagger-jsdoc" por baixo dos panos
// para montar a especificação final. Por enquanto, só definimos o básico.

const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'API de Cosméticos - Projeto Portfólio Pessoal',
    version: '1.0.0',
    description: 'API para gerenciamento de produtos, usuários e carrinho de compras de uma loja de cosméticos.',
    contact: {
      name: 'Bruno Oliveira',
      email: 'brunosoftware.qa@gmail.com',
      url: 'https://www.linkedin.com/in/bruno-de-oliveira-diniz-369b63380/'
    }
  },
  servers: [
    {
      url: 'http://localhost:3333',
      description: 'Servidor de Desenvolvimento Local'
    }
    // Você pode adicionar mais servidores aqui (ex: produção)
  ],
  // (Mais tarde, adicionaremos aqui as definições de 'components' (schemas, security) 
  // e 'paths' (rotas), mas faremos isso de forma modular)
};

module.exports = swaggerDefinition;