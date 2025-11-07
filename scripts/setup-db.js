// Importa o driver (ex: mysql2)
// Certifique-se que ele está em 'dependencies' ou 'devDependencies'
const mysql = require('mysql2/promise');

// Suas queries de setup


const CREATE_TABLES_SQL = `

CREATE DATABASE IF NOT EXISTS cosmeticos_db;

USE cosmeticos_db;

CREATE TABLE IF NOT EXISTS users (
  id INT NOT NULL AUTO_INCREMENT,
  nome VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  whatsapp VARCHAR(20) NOT NULL,
  role ENUM('user', 'admin') NOT NULL DEFAULT 'user',
  created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE INDEX email_UNIQUE (email ASC) VISIBLE
);

CREATE TABLE IF NOT EXISTS products (
  id INT NOT NULL AUTO_INCREMENT,
  nome VARCHAR(255) NOT NULL,
  descricao TEXT NULL,
  preco DECIMAL(10, 2) NOT NULL,
  categoria ENUM('masculino', 'feminino', 'unissex') NOT NULL,
  imagem_url VARCHAR(255) NULL,
  ativo BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS carts (
  id INT NOT NULL AUTO_INCREMENT,
  user_id INT NOT NULL,
  created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE INDEX user_id_UNIQUE (user_id ASC) VISIBLE,
  CONSTRAINT fk_carts_users
    FOREIGN KEY (user_id)
    REFERENCES users (id)
    ON DELETE CASCADE -- Se o usuário for deletado, seu carrinho também é.
    ON UPDATE NO ACTION
);

CREATE TABLE IF NOT EXISTS cart_items (
  id INT NOT NULL AUTO_INCREMENT,
  cart_id INT NOT NULL,
  product_id INT NOT NULL,
  quantidade INT NOT NULL DEFAULT 1,
  PRIMARY KEY (id),
  INDEX fk_cart_items_carts_idx (cart_id ASC) VISIBLE,
  INDEX fk_cart_items_products_idx (product_id ASC) VISIBLE,
  UNIQUE INDEX cart_product_UNIQUE (cart_id ASC, product_id ASC) VISIBLE, -- Impede o mesmo produto duplicado no carrinho
  CONSTRAINT fk_cart_items_carts
    FOREIGN KEY (cart_id)
    REFERENCES carts (id)
    ON DELETE CASCADE, -- Se o carrinho for deletado, os itens também são.
  CONSTRAINT fk_cart_items_products
    FOREIGN KEY (product_id)
    REFERENCES products (id)
    ON DELETE CASCADE -- Se um produto for deletado (do catálogo), ele sai dos carrinhos.
);

`;

const CREATE_PRODUCTS_SQL = `
    -- Inserindo alguns produtos de exemplo
INSERT INTO products (nome, descricao, preco, categoria, imagem_url) 
VALUES
('Creme de Barbear Hidratante', 'Creme denso para um barbear suave e rente.', 45.50, 'masculino', 'https://exemplo.com/img/barba.jpg'),
('Shampoo Fortalecedor Man', 'Shampoo para controle de queda e fortalecimento.', 59.90, 'masculino', 'https://exemplo.com/img/shampoo-man.jpg'),
('Sérum Facial Vitamina C', 'Sérum antioxidante para todos os tipos de pele.', 89.90, 'unissex', 'https://exemplo.com/img/serum-vit-c.jpg'),
('Batom Líquido Matte Vermelho', 'Batom de longa duração com acabamento matte.', 35.00, 'feminino', 'https://exemplo.com/img/batom-vm.jpg'),
('Máscara Capilar Hidratação Profunda', 'Máscara para restauração de fios danificados.', 75.00, 'feminino', 'https://exemplo.com/img/mascara-fem.jpg');
`;

// Queries para criar os usuários (admin e comum)
// Hashes corretos para a senha "123456"
const CREATE_USERS_SQL = `
  INSERT INTO users (nome, email, password_hash, whatsapp, role) 
  VALUES 
  ('Admin', 'admin@email.com', '$2b$10$VcgIslc8gA4giDfROEDvWutH.IJ/pN91hPcRcAGCzszDmkhNWF1K2', '5521999998888', 'admin'),
  ('User', 'user@email.com', '$2b$10$2g7wJ27dPUdyCMzITCewfedQSIRNgPOm.fTPfuNI8Bglevy5U6Ydq', '5521999997777', 'user');
`;


// Função principal assíncrona
async function setupDatabase() {
    let connection;
    try {
        console.log('Conectando ao banco de dados de teste...');

        // O script vai pegar as variáveis de ambiente da pipeline!
        connection = await mysql.createConnection({
            host: process.env.DB_HOST || 'localhost',
            port: process.env.DB_PORT || 3306,
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASSWORD || 'root',
            database: process.env.DB_NAME || 'cosmeticos_db',
            // Permite múltiplas queries em um só comando
            multipleStatements: true,
        });

        console.log('Conexão bem-sucedida.');

        // 1. Criar as tabelas
        console.log('Executando CREATE TABLES...');
        await connection.query(CREATE_TABLES_SQL);
        console.log('Tabelas criadas com sucesso.');

        // 2. Criar os produtos (Seed)
        console.log('Executando INSERT PRODUCTS (seed)...');
        await connection.query(CREATE_PRODUCTS_SQL);
        console.log('Produtos criados com sucesso.');
  
        // 3. Criar os usuários (Seed)
        console.log('Executando INSERT USERS (seed)...');
        await connection.query(CREATE_USERS_SQL);
        console.log('Usuários (admin e comum) criados com sucesso.');


        console.log('Banco de dados preparado para os testes!');

        await connection.end();
        // Sai com sucesso
        process.exit(0);

    } catch (error) {
        console.error('Erro ao preparar o banco de dados:', error);
        if (connection) {
            await connection.end();
        }
        // Sai com código de erro, o que fará a pipeline falhar (correto)
        process.exit(1);
    }
}

// Inicia o script
setupDatabase();