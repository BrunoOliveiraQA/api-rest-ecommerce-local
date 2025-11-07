# API E-commerce de Cosméticos

Uma API RESTful para um e-commerce de cosméticos, construída com Node.js, Express e MySQL. Inclui autenticação JWT, catálogo de produtos, carrinho de compras, checkout via WhatsApp, rotas administrativas (CRUD de produtos), documentação com Swagger e testes de desempenho com k6.

## 📋 Índice* **Gerenciamento de Carrinho:** Rotas privadas (`/cart`) onde usuários logados podem adicionar, remover e visualizar itens. O carrinho é persistido no banco de dados.

* **Checkout via WhatsApp:** Rota privada (`/order/checkout`) que:

- [🎯 Sobre o Projeto](#-sobre-o-projeto)    1.  Valida o carrinho do usuário.

- [🏗️ Arquitetura](#️-arquitetura)    2.  Formata uma mensagem de pedido detalhada (itens, total, dados do cliente).

- [🚀 Funcionalidades](#-funcionalidades)    3.  Limpa o carrinho do usuário no banco.

- [⚙️ Instalação e Configuração](#️-instalação-e-configuração)    4.  Retorna uma URL `wa.me` para o frontend redirecionar o cliente.

- [🗄️ Configuração do Banco de Dados](#️-configuração-do-banco-de-dados)

- [🧪 Testes Automatizados](#-testes-automatizados)## 🚀 Tecnologias Utilizadas

- [🐛 Bugs Identificados](#-bugs-identificados)

- [📊 Relatórios de Teste](#-relatórios-de-teste)* **Backend:** Node.js

- [📚 Documentação Adicional](#-documentação-adicional)* **Servidor:** Express

- [🔗 Links Úteis](#-links-úteis)* **Banco de Dados:** MySQL (utilizando `mysql2` com `async/await`)

* **Autenticação:** JSON Web Tokens (JWT) e `bcrypt`

## ✨ Funcionalidades

- Autenticação e registro de usuários (JWT)
- Catálogo de produtos (listar, buscar por ID e filtrar por categoria)
- Carrinho de compras (adicionar, remover, listar e totalizar)
- Checkout que gera link do WhatsApp com o pedido formatado
- Rotas administrativas para CRUD de produtos (somente Admin)
- Documentação interativa com Swagger em `/api-docs`
- Teste de performance (k6) para fluxo de login
- Pipeline CI (GitHub Actions) com job de build/test e job manual dedicado ao k6

## 🧱 Tecnologias Utilizadas

- Node.js 22.x, Express 5
- MySQL 8 (driver: mysql2/promise)
- Autenticação: JSON Web Token (jsonwebtoken)
- Segurança e utilidades: cors, dotenv, bcrypt
- Documentação: swagger-ui-express
- Observabilidade de performance (local/CI): k6
- CI/CD: GitHub Actions

## 📂 Estrutura do Projeto (resumo)

```
src/
  app.js                # App Express (middlewares, rotas, Swagger)
  server.js             # Bootstrap do servidor + teste de conexão
  config/
    db.js               # Pool MySQL e função testConnection
    swaggerConfig.js    # Montagem do Swagger a partir de docs/*
  controllers/
    AuthController.js   # Registro e login
    ProductController.js# Listagem/busca de produtos
    ProductAdminController.js # CRUD admin de produtos
    CartController.js   # Carrinho (get/add/remove)
    OrderController.js  # Checkout -> WhatsApp
  middlewares/
    authMiddleware.js   # Valida token JWT (Bearer)
    adminMiddleware.js  # Garante role === 'admin'
  models/
    UserModel.js        # users (criar, buscar por email/id)
    ProductModel.js     # products (listar, criar, atualizar, deletar)
    CartModel.js        # carts/cart_items (itens e totais)
  routes/
    authRoutes.js       # /auth
    productRoutes.js    # /products
    cartRoutes.js       # /cart (privado)
    orderRoutes.js      # /order (privado)
    adminRoutes.js      # /admin (privado admin)

docs/                   # Partes Swagger (schemas, paths, security)
scripts/
  setup-db.js           # Cria tabelas e insere seeds (admin/user, produtos)
utils/
  variaveis.js          # BASE_URL para k6
k6/
  login.test.js         # Teste de performance de login
```

## 🗄️ Banco de Dados

Tabelas principais criadas por `scripts/setup-db.js`:
- `users(id, nome, email, password_hash, whatsapp, role, created_at)`
- `products(id, nome, descricao, preco, categoria, imagem_url, ativo, created_at)`
- `carts(id, user_id, created_at, updated_at)`
- `cart_items(id, cart_id, product_id, quantidade)`

Seeds incluídos (para testes):
- Admin: `admin@email.com` / senha `123456`
- User:  `user@email.com`  / senha `123456`

Categorias válidas de produtos: `masculino | feminino | unissex`.

## ⚙️ Instalação e Execução (local)

Pré-requisitos: Node.js 22.x, MySQL 8 rodando localmente.

1. Instale as dependências
```
npm ci
```

2. Configure o arquivo `.env` (exemplo):
```
PORT=3333
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=sua_senha
DB_NAME=cosmeticos_db
JWT_SECRET=SEU_SEGREDO_SUPER_SECRETO
JWT_EXPIRES_IN=1d
SELLER_WHATSAPP=5521999998888
```

3. Prepare o banco (tabelas + seeds)
```
node scripts/setup-db.js
```

4. Suba a API em modo dev (com nodemon)
```
npm run dev
```
Acesse: http://localhost:3333

5. Documentação Swagger
- Abra: http://localhost:3333/api-docs

## 🔐 Autenticação

- JWT no cabeçalho `Authorization: Bearer <seu_token>`
- Geração do token: `POST /auth/login`
- Expiração configurável via `JWT_EXPIRES_IN` (ex: `1d`)

### Exemplo de login (curl)
```
curl -X POST http://localhost:3333/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@email.com","senha":"123456"}'
```
Resposta (200):
```
{
  "message": "Login bem-sucedido!",
  "userId": 2,
  "token": "<JWT>",
  "role": "user"
}
```

## 🚦 Endpoints Principais

Públicos:
- `GET /` – healthcheck
- `POST /auth/register` – cria usuário
- `POST /auth/login` – retorna JWT
- `GET /products` – lista (filtro: `?categoria=masculino`)
- `GET /products/:id` – detalhe

Privados (JWT):
- `GET /cart` – itens e total
- `POST /cart/add` – body `{ productId, quantidade }`
- `DELETE /cart/remove/:productId`
- `POST /order/checkout` – retorna `{ whatsappUrl }`

Admin (JWT + role=admin):
- `POST /admin/products` – cria produto
- `PUT /admin/products/:id` – atualiza produto
- `DELETE /admin/products/:id` – remove produto

### Estruturas de dados (exemplos)

Produto (GET /products):
```
{
  "id": 1,
  "nome": "Shampoo Fortalecedor Man",
  "descricao": "...",
  "preco": 59.90,
  "categoria": "masculino",
  "imagem_url": "https://..."
}
```

Carrinho (GET /cart):
```
{
  "items": [
    { "product_id": 1, "nome": "Shampoo", "preco": 59.90, "quantidade": 2 }
  ],
  "total": 119.8
}
```

Checkout (POST /order/checkout):
```
{
  "message": "Pedido pronto para ser enviado via WhatsApp!",
  "whatsappUrl": "https://wa.me/5521999998888?text=..."
}
```

## 🧪 Testes

### k6 (local)

Rodar teste de login:
```
BASE_URL=http://localhost:3333 k6 run k6/login.test.js
```
- Thresholds configurados em `k6/login.test.js`
- Ajuste `utils/variaveis.js` para apontar BASE_URL via `__ENV.BASE_URL`

### Mocha (funcionais)

```
npm test
```
Gera relatório Mochawesome.

## 🚀 CI/CD (GitHub Actions)

Jobs:
- `build-and-test` (push/PR): instala deps, prepara DB MySQL (service), sobe API, sanity check de login e roda testes.
- `k6-tests` (manual via Workflow Dispatch): prepara DB, sobe API, instala k6 e executa `k6/login.test.js`, exporta summary como artefato.

Para rodar o k6 manualmente:
- GitHub > Actions > CI API Cosméticos > `Run workflow` > branch `main` > Run

## 🧩 Convenções e Notas

- Uso de percentis (`p(90)`, `p(95)`) em k6 em vez de `max` para evitar flakiness.
- Middlewares: `authMiddleware` injeta `req.user` a partir do JWT; `adminMiddleware` exige `role === 'admin'`.
- O `scripts/setup-db.js` é idempotente (usa `IF NOT EXISTS`) e popula dados de exemplo.

## ❗ Troubleshooting

- `Access denied for user 'root'@'localhost'`: verifique `DB_USER/DB_PASSWORD` no `.env`.
- `Token inválido ou expirado`: gere novo login, confira `JWT_SECRET` e `JWT_EXPIRES_IN`.
- Swagger vazio para Admin: confira se `docs/adminProductPaths.js` existe; há fallback seguro no `swaggerConfig.js`.

## 📄 Licença

Projeto para fins educacionais e demonstração. Ajuste conforme a sua necessidade.
