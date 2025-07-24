const express = require('express');
const AuthService = require('../services/authService');
const { validateRegister, validateLogin, validateResetPassword } = require('../middleware/validation');

const router = express.Router();

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Registrar novo usuário
 *     tags: [Autenticação]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *                 description: Nome completo do usuário
 *                 example: "João Silva"
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Email do usuário
 *                 example: "joao@example.com"
 *               password:
 *                 type: string
 *                 description: Senha do usuário (mín 6 chars, 1 maiúscula, 1 minúscula, 1 número)
 *                 example: "Senha123"
 *     responses:
 *       201:
 *         description: Usuário registrado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     name:
 *                       type: string
 *                     email:
 *                       type: string
 *                     createdAt:
 *                       type: string
 *                 token:
 *                   type: string
 *                   description: JWT token
 *                 expiresIn:
 *                   type: string
 *       400:
 *         description: Dados inválidos
 *       409:
 *         description: Email já está em uso
 */
router.post('/register', validateRegister, async (req, res) => {
  try {
    const { name, email, password } = req.body;
    
    const result = await AuthService.register({ name, email, password });
    
    res.status(201).json({
      message: 'Usuário registrado com sucesso',
      ...result
    });
  } catch (error) {
    if (error.message === 'Email já está em uso') {
      return res.status(409).json({
        error: 'Email já está em uso',
        message: error.message
      });
    }
    
    res.status(500).json({
      error: 'Erro interno do servidor',
      message: error.message
    });
  }
});

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Fazer login
 *     tags: [Autenticação]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Email do usuário
 *                 example: "joao@example.com"
 *               password:
 *                 type: string
 *                 description: Senha do usuário
 *                 example: "Senha123"
 *               rememberMe:
 *                 type: boolean
 *                 description: Se verdadeiro, mantém o usuário logado (cookie persistente)
 *                 example: true
 *     responses:
 *       200:
 *         description: Login realizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     name:
 *                       type: string
 *                     email:
 *                       type: string
 *                     createdAt:
 *                       type: string
 *                 token:
 *                   type: string
 *                   description: JWT token
 *                 expiresIn:
 *                   type: string
 *       400:
 *         description: Dados inválidos
 *       401:
 *         description: Email ou senha inválidos
 *       403:
 *         description: Conta bloqueada
 */
router.post('/login', validateLogin, async (req, res) => {
  try {
    const { email, password, rememberMe } = req.body;
    const result = await AuthService.login(email, password);

    // Se rememberMe, definir cookie persistente
    if (rememberMe) {
      res.cookie('token', result.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 30 * 24 * 60 * 60 * 1000 // 30 dias
      });
    }

    res.json({
      message: 'Login realizado com sucesso',
      ...result
    });
  } catch (error) {
    if (error.message === 'Email ou senha inválidos') {
      return res.status(401).json({
        error: 'Credenciais inválidas',
        message: error.message
      });
    }
    if (error.message.includes('bloqueada')) {
      return res.status(403).json({
        error: 'Conta bloqueada',
        message: error.message
      });
    }
    res.status(500).json({
      error: 'Erro interno do servidor',
      message: error.message
    });
  }
});

/**
 * @swagger
 * /api/auth/reset-password:
 *   post:
 *     summary: Redefinir senha (simulado)
 *     tags: [Autenticação]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Email do usuário
 *                 example: "joao@example.com"
 *     responses:
 *       200:
 *         description: Email de redefinição enviado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 tempPassword:
 *                   type: string
 *                   description: Senha temporária (apenas para demonstração)
 *       400:
 *         description: Dados inválidos
 *       404:
 *         description: Usuário não encontrado
 */
router.post('/reset-password', validateResetPassword, async (req, res) => {
  try {
    const { email } = req.body;
    
    const result = await AuthService.resetPassword(email);
    
    res.json({
      message: 'Email de redefinição enviado com sucesso',
      ...result
    });
  } catch (error) {
    if (error.message === 'Usuário não encontrado') {
      return res.status(404).json({
        error: 'Usuário não encontrado',
        message: error.message
      });
    }
    
    res.status(500).json({
      error: 'Erro interno do servidor',
      message: error.message
    });
  }
});

module.exports = router; 