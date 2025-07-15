const AuthService = require('../services/authService');

/**
 * Middleware para verificar autenticação via JWT
 */
const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      return res.status(401).json({
        error: 'Token não fornecido',
        message: 'É necessário fornecer um token de autenticação'
      });
    }

    // Verificar token e obter dados do usuário
    const user = await AuthService.getUserFromToken(token);
    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({
      error: 'Token inválido',
      message: error.message
    });
  }
};

/**
 * Middleware opcional para autenticação (não falha se não houver token)
 */
const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token) {
      const user = await AuthService.getUserFromToken(token);
      req.user = user;
    }
    next();
  } catch (error) {
    // Se o token for inválido, apenas continua sem usuário
    next();
  }
};

module.exports = {
  authenticateToken,
  optionalAuth
}; 