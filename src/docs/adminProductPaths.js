/* eslint-disable */
// Desabilitamos o eslint neste arquivo por ser apenas um JSON de definição

const adminProductPaths = {
  '/admin/products': {
    post: {
      tags: ['Admin: Produtos'],
      summary: 'Cria um novo produto',
      description: 'Cria um novo produto no catálogo. Requer autenticação de Admin.',
      security: [ // Rota protegida
        {
          bearerAuth: [],
        },
      ],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/ProductInput',
            },
            // Define os campos obrigatórios para o POST
            example: {
              nome: "Produto Exemplo",
              descricao: "Descrição opcional",
              preco: 10.99,
              categoria: "unissex",
              imagem_url: "https://url.opcional.com/img.jpg"
            }
          },
        },
      },
      responses: {
        '201': {
          description: 'Produto criado com sucesso',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  message: { type: 'string', example: 'Produto criado com sucesso!' },
                  productId: { type: 'integer', example: 7 },
                },
              },
            },
          },
        },
        '400': { description: 'Requisição inválida. Verifique os dados enviados.' },
        '401': { description: 'Token de autenticação não fornecido ou inválido.' },
        '403': { description: 'Acesso negado. Requer permissão de administrador' }, // Erro de permissão
        '500': { description: 'Erro interno do servidor' },
      },
    },
  },
  '/admin/products/{id}': {
    put: {
      tags: ['Admin: Produtos'],
      summary: 'Atualiza um produto existente',
      description: 'Atualiza os dados de um produto pelo ID. Requer autenticação de Admin.',
      security: [ // Rota protegida
        {
          bearerAuth: [],
        },
      ],
      parameters: [
        {
          name: 'id',
          in: 'path',
          required: true,
          schema: {
            type: 'integer',
          },
          description: 'ID do produto a ser atualizado.',
        },
      ],
      requestBody: {
        description: 'Campos a serem atualizados (todos são opcionais).',
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/ProductInput',
            },
            example: {
              preco: 12.99,
              descricao: "Nova descrição atualizada."
            }
          },
        },
      },
      responses: {
        '200': { description: 'Produto atualizado com sucesso' },
        '400': { description: 'Requisição inválida. Verifique os dados enviados.' },
        '401': { description: 'Token de autenticação não fornecido ou inválido.' },
        '403': { description: 'Acesso negado. Requer permissão de administrador.' },
        '404': { description: 'Recurso não encontrado.' },
        '500': { description: 'Erro interno do servidor.' },
      },
    },
    delete: {
      tags: ['Admin: Produtos'],
      summary: 'Deleta um produto',
      description: 'Deleta um produto do catálogo pelo ID. Requer autenticação de Admin.',
      security: [ // Rota protegida
        {
          bearerAuth: [],
        },
      ],
      parameters: [
        {
          name: 'id',
          in: 'path',
          required: true,
          schema: {
            type: 'integer',
          },
          description: 'ID do produto a ser deletado.',
        },
      ],
      responses: {
        '200': { description: 'Produto deletado com sucesso' },
        '401': { description: 'Token de autenticação não fornecido ou inválido.' },
        '403': { description: 'Acesso negado. Requer permissão de administrador.' },
        '404': { description: 'Produto não encontrado' },
        '500': { description: 'Erro interno do servidor.' },
      },
    },
  },
};

module.exports = { adminProductPaths };