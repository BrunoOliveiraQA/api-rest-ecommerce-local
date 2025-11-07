/* eslint-disable */
const productPaths = {
  '/products': {
    get: {
      tags: ['Produtos'],
      summary: 'Lista todos os produtos',
      description: 'Retorna uma lista de todos os produtos no catálogo. Pode ser filtrado por categoria via query param.',
      parameters: [
        {
          name: 'categoria',
          in: 'query',
          schema: {
            type: 'string',
            enum: ['masculino', 'feminino', 'unissex'],
          },
          required: false,
          description: 'Filtra produtos pela categoria especificada.',
        },
      ],
      responses: {
        '200': {
          description: 'Lista de produtos',
          content: {
            'application/json': {
              schema: {
                type: 'array',
                items: {
                  $ref: '#/components/schemas/Product', // Referência ao Schema de Produto
                },
              },
            },
          },
        },
        '500': { description: 'Erro interno do servidor.' },
      },
    },
  },
  '/products/{id}': {
    get: {
      tags: ['Produtos'],
      summary: 'Busca um produto por ID',
      description: 'Retorna os detalhes de um produto específico.',
      parameters: [
        {
          name: 'id',
          in: 'path',
          required: true,
          schema: {
            type: 'integer',
          },
          description: 'ID do produto a ser buscado.',
        },
      ],
      responses: {
        '200': {
          description: 'Detalhes do produto',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Product',
              },
            },
          },
        },
        '404': { description: 'Produto não encontrado.' },
        '500': { description: 'Erro interno do servidor.' },
      },
    },
  },
};

module.exports = { productPaths };