const bcrypt = require('bcryptjs');

// Armazenamento em memória
let users = [];
let loginAttempts = new Map(); // email -> { count: number, blockedUntil: Date }

class UserService {
  /**
   * Registra um novo usuário
   */
  static async registerUser(userData) {
    const { name, email, password } = userData;

    // Verificar se o email já existe
    const existingUser = users.find(user => user.email === email);
    if (existingUser) {
      throw new Error('Email já está em uso');
    }

    // Criptografar senha
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Criar novo usuário
    const newUser = {
      id: Date.now().toString(),
      name,
      email,
      password: hashedPassword,
      createdAt: new Date().toISOString(),
      isBlocked: false,
      blockedUntil: null
    };

    users.push(newUser);

    // Retornar usuário sem senha
    const { password: _, ...userWithoutPassword } = newUser;
    return userWithoutPassword;
  }

  /**
   * Busca usuário por email
   */
  static findUserByEmail(email) {
    return users.find(user => user.email === email);
  }

  /**
   * Busca usuário por ID
   */
  static findUserById(id) {
    return users.find(user => user.id === id);
  }

  /**
   * Verifica se a conta está bloqueada
   */
  static isAccountBlocked(email) {
    const attempts = loginAttempts.get(email);
    if (!attempts) return false;

    // Se ainda está bloqueado
    if (attempts.blockedUntil && new Date() < attempts.blockedUntil) {
      return true;
    }

    // Se o bloqueio expirou, limpar
    if (attempts.blockedUntil && new Date() >= attempts.blockedUntil) {
      loginAttempts.delete(email);
      return false;
    }

    return false;
  }

  /**
   * Registra tentativa de login
   */
  static recordLoginAttempt(email, success) {
    if (success) {
      // Login bem-sucedido, limpar tentativas
      loginAttempts.delete(email);
      return;
    }

    const attempts = loginAttempts.get(email) || { count: 0, blockedUntil: null };
    attempts.count++;

    // Bloquear após 3 tentativas
    if (attempts.count >= 3) {
      attempts.blockedUntil = new Date(Date.now() + 30 * 60 * 1000); // 30 minutos
    }

    loginAttempts.set(email, attempts);
  }

  /**
   * Verifica senha
   */
  static async verifyPassword(password, hashedPassword) {
    return await bcrypt.compare(password, hashedPassword);
  }

  /**
   * Atualiza perfil do usuário
   */
  static updateUserProfile(userId, updateData) {
    const userIndex = users.findIndex(user => user.id === userId);
    if (userIndex === -1) {
      throw new Error('Usuário não encontrado');
    }

    // Atualizar apenas campos permitidos
    const allowedFields = ['name'];
    allowedFields.forEach(field => {
      if (updateData[field] !== undefined) {
        users[userIndex][field] = updateData[field];
      }
    });

    const { password: _, ...userWithoutPassword } = users[userIndex];
    return userWithoutPassword;
  }

  /**
   * Redefine senha (simulado)
   */
  static async resetPassword(email) {
    const user = this.findUserByEmail(email);
    if (!user) {
      throw new Error('Usuário não encontrado');
    }

    // Simular envio de email
    console.log(`📧 Email de redefinição enviado para: ${email}`);
    
    // Gerar nova senha temporária
    const tempPassword = Math.random().toString(36).slice(-8);
    const hashedPassword = await bcrypt.hash(tempPassword, 10);
    
    // Atualizar senha do usuário
    const userIndex = users.findIndex(u => u.id === user.id);
    users[userIndex].password = hashedPassword;

    return {
      message: 'Email de redefinição enviado com sucesso',
      tempPassword: tempPassword // Em produção, isso seria enviado por email
    };
  }

  /**
   * Retorna uma dica de senha (simulado)
   */
  static getPasswordHint(email) {
    const user = this.findUserByEmail(email);
    if (!user) {
      throw new Error('Usuário não encontrado');
    }
    // Simulação: retorna os 2 primeiros caracteres da senha original (NÃO FAÇA ISSO EM PRODUÇÃO)
    // Aqui, como a senha está criptografada, retornamos uma mensagem genérica
    return { hint: 'A senha contém pelo menos 6 caracteres, incluindo maiúsculas, minúsculas e números.' };
  }

  /**
   * Exclui um usuário pelo ID
   */
  static deleteUserById(userId) {
    const userIndex = users.findIndex(user => user.id === userId);
    if (userIndex === -1) {
      throw new Error('Usuário não encontrado');
    }
    users.splice(userIndex, 1);
    return { message: 'Usuário excluído com sucesso' };
  }

  /**
   * Obtém estatísticas dos usuários (para debug)
   */
  static getStats() {
    return {
      totalUsers: users.length,
      blockedAccounts: loginAttempts.size,
      blockedEmails: Array.from(loginAttempts.keys())
    };
  }
}

module.exports = UserService; 