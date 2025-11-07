const jwt = require('jsonwebtoken');
require('dotenv').config();

// Nosso segredo do .env
const JWT_SECRET = process.env.JWT_SECRET;

/**
 * Middleware para verificar a autenticação do usuário via Token JWT.
 */
const authMiddleware = (req, res, next) => {
  // 1. Pega o token do cabeçalho 'Authorization'
  // O formato esperado é: "Bearer SEU_TOKEN_AQUI"
  const authHeader = req.headers.authorization;

  // 2. Verifica se o cabeçalho foi enviado
  if (!authHeader) {
    return res.status(401).json({ 
      message: 'Token de autenticação não fornecido.' 
    });
  }

  // 3. Separa o "Bearer" do token em si
  const parts = authHeader.split(' '); // ['Bearer', 'SEU_TOKEN_AQUI']

  // 4. Verifica se o formato está correto (deve ter 2 partes)
  if (parts.length !== 2) {
    return res.status(401).json({ message: 'Token em formato inválido.' });
  }

  // 5. Verifica se o esquema é "Bearer"
  const [scheme, token] = parts;
  if (!/^Bearer$/i.test(scheme)) {
    return res.status(401).json({ message: 'Token mal formatado (esquema não é Bearer).' });
  }

  // 6. Tenta validar o token
  try {
    // jwt.verify "decodifica" o token usando nosso segredo.
    // Se o token for inválido (expirado, assinatura errada), ele vai "lançar" um erro.
    const decodedPayload = jwt.verify(token, JWT_SECRET);

    // 7. Se o token for VÁLIDO, anexamos o payload (ex: id do usuário)
    // ao objeto 'req' para que os próximos controllers possam usá-lo.
    req.user = decodedPayload; // Agora req.user = { id: 1, nome: 'Teste', iat: ..., exp: ... }

    // 8. Chama o próximo middleware ou controller na pilha
    return next();

  } catch (error) {
    // 7. Se o token for INVÁLIDO (expirado, assinatura errada, etc.)
    console.error('[AuthMiddleware] Erro ao validar token:', error.message);
    return res.status(401).json({ 
      message: 'Token inválido ou expirado.' 
    });
  }
};

module.exports = authMiddleware;