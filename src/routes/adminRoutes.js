const { Router } = require('express');

// Importa os "seguranças"
const authMiddleware = require('../middlewares/authMiddleware.js');
const adminMiddleware = require('../middlewares/adminMiddleware.js');

// Importa os controllers de admin que criamos
const {
  adminCreateProduct,
  adminUpdateProduct,
  adminDeleteProduct
} = require('../controllers/ProductAdminController.js');

const adminRouter = Router();

// --- Definição das Rotas de Admin para Produtos ---

// Para TODAS as rotas deste arquivo, vamos aplicar os middlewares
// O 'authMiddleware' roda primeiro, depois o 'adminMiddleware'
adminRouter.use(authMiddleware);
adminRouter.use(adminMiddleware);

// Se o usuário passar pelos dois middlewares (está logado E é admin),
// ele pode acessar as rotas abaixo.

/**
 * @route   POST /admin/products
 * @desc    Cria um novo produto
 * @access  Admin
 * @body    { "nome": "...", "descricao": "...", "preco": 10.50, "categoria": "...", "imagem_url": "..." }
 */
adminRouter.post('/products', adminCreateProduct);

/**
 * @route   PUT /admin/products/:id
 * @desc    Atualiza um produto existente
 * @access  Admin
 * @body    { "nome": "..." (etc. - campos opcionais) }
 */
adminRouter.put('/products/:id', adminUpdateProduct);

/**
 * @route   DELETE /admin/products/:id
 * @desc    Deleta um produto
 * @access  Admin
 */
adminRouter.delete('/products/:id', adminDeleteProduct);

// (Futuramente, poderíamos adicionar aqui o CRUD de usuários)
// ex: adminRouter.get('/users', adminGetAllUsers);

module.exports = adminRouter;