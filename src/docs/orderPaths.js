/* eslint-disable */
const orderPaths = {
  '/order/checkout': {
    post: {
      tags: ['Pedido (Checkout)'],
      summary: 'Processa o checkout e gera link do WhatsApp',
      description: 'Pega o carrinho do usuário, formata o pedido, limpa o carrinho e retorna uma URL `wa.me` para o frontend.',
      security: [
        {
          bearerAuth: [],
        },
      ],
      responses: {
        '200': {
          description: 'Link do WhatsApp gerado',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  message: { type: 'string', example: 'Pedido pronto para ser enviado via WhatsApp!' },
                  whatsappUrl: { type: 'string', example: 'https://wa.me/5511999998888?text=Ol%C3%A1!...' },
                },
              },
            },
          },
        },
        '400': { description: 'Carrinho está vazio',},
        '401': { description: 'Token inválido ou expirado.' },
        '500': { description: 'Erro interno do servidor.' },
      },
    },
  },
};

module.exports = { orderPaths };