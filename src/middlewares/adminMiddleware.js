/**
 * Middleware para verificar se o usuário é um Administrador.
 * Este middleware DEVE rodar DEPOIS do 'authMiddleware',
 * pois ele depende do 'req.user' que o authMiddleware insere.
 */
const adminMiddleware = (req, res, next) => {
  try {
    // 1. Verifica se 'req.user' existe (prova que o authMiddleware rodou)
    if (!req.user) {
      return res.status(401).json({ message: 'Autenticação falhou.' });
    }

    // 2. Verifica se o 'role' do usuário no token é 'admin'
    if (req.user.role !== 'admin') {
      // 403 (Forbidden) é o status correto para "Eu te entendi,
      // mas você não tem permissão para ver isso."
      return res.status(403).json({ 
        message: 'Acesso negado. Requer permissão de administrador.' 
      });
    }

    // 3. Se chegou aqui, o usuário está logado E é um admin.
    // Pode continuar para o controller.
    next();

  } catch (error) {
    console.error('[AdminMiddleware] Erro:', error);
    res.status(500).json({ message: 'Erro interno do servidor ao verificar permissões.' });
  }
};

module.exports = adminMiddleware;