const express = require('express');
const cors = require('cors');
const setupSwagger = require('./config/swaggerConfig.js');

// --- Importação das Rotas ---
const authRouter = require('./routes/authRoutes.js');
const productRouter = require('./routes/productRoutes.js');
const cartRouter = require('./routes/cartRoutes.js');
const orderRouter = require('./routes/orderRoutes.js');
const adminRouter = require('./routes/adminRoutes.js');

// Cria a instância principal da aplicação Express
const app = express()

// --- Configuração dos Middlewares ---
app.use(cors())
app.use(express.json())

// --- Configuração do Swagger ---
setupSwagger(app); // <-- NOVA LINHA (Chama a função)

// --- Rotas ---

// Rota de "saúde" (Health Check)
app.get('/', (req, res) => {
  res.status(200).json({
    message: 'API de Cosméticos está online!',
    status: 'OK',
  })
})

// Rotas Públicas
app.use('/auth', authRouter)
app.use('/products', productRouter)

// Rotas Privadas (Usuário Logado)
app.use('/cart', cartRouter)
app.use('/order', orderRouter)

// Rotas Privadas (Admin)
app.use('/admin', adminRouter);

// Exporta a instância do app para ser usada no server.js
module.exports = app;