const jwt = require('jsonwebtoken');
const UserService = require('./userService');

const JWT_SECRET = process.env.JWT_SECRET || 'sua-chave-secreta-super-segura-2024';
const JWT_EXPIRES_IN = '24h';

class AuthService {
  /**
   * Gera token JWT
   */
  static generateToken(user) {
    const payload = {
      userId: user.id,
      email: user.email,
      name: user.name
    };

    return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
  }

  /**
   * Verifica token JWT
   */
  static verifyToken(token) {
    try {
      return jwt.verify(token, JWT_SECRET);
    } catch (error) {
      throw new Error('Token inválido');
    }
  }

  /**
   * Realiza login do usuário
   */
  static async login(email, password) {
    // Verificar se a conta está bloqueada
    if (UserService.isAccountBlocked(email)) {
      throw new Error('Conta bloqueada. Tente novamente em 30 minutos.');
    }

    // Buscar usuário
    const user = UserService.findUserByEmail(email);
    if (!user) {
      UserService.recordLoginAttempt(email, false);
      throw new Error('Email ou senha inválidos');
    }

    // Verificar senha
    const isPasswordValid = await UserService.verifyPassword(password, user.password);
    if (!isPasswordValid) {
      UserService.recordLoginAttempt(email, false);
      throw new Error('Email ou senha inválidos');
    }

    // Login bem-sucedido
    UserService.recordLoginAttempt(email, true);

    // Gerar token
    const token = this.generateToken(user);

    // Retornar dados do usuário sem senha
    const { password: _, ...userWithoutPassword } = user;

    return {
      user: userWithoutPassword,
      token,
      expiresIn: JWT_EXPIRES_IN
    };
  }

  /**
   * Registra novo usuário
   */
  static async register(userData) {
    const user = await UserService.registerUser(userData);
    const token = this.generateToken(user);

    return {
      user,
      token,
      expiresIn: JWT_EXPIRES_IN
    };
  }

  /**
   * Redefine senha
   */
  static async resetPassword(email) {
    return await UserService.resetPassword(email);
  }

  /**
   * Decodifica token e retorna dados do usuário
   */
  static async getUserFromToken(token) {
    const decoded = this.verifyToken(token);
    const user = UserService.findUserById(decoded.userId);
    
    if (!user) {
      throw new Error('Usuário não encontrado');
    }

    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }
}

module.exports = AuthService; 