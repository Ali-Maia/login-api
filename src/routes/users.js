const express = require('express');
const UserService = require('../services/userService');
const { authenticateToken } = require('../middleware/auth');
const { validateUpdateProfile } = require('../middleware/validation');

const router = express.Router();

/**
 * @swagger
 * /api/users/profile:
 *   get:
 *     summary: Obter perfil do usuário
 *     tags: [Usuários]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Perfil do usuário
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
 *       401:
 *         description: Não autorizado
 */
router.get('/profile', authenticateToken, async (req, res) => {
  try {
    res.json({
      message: 'Perfil obtido com sucesso',
      user: req.user
    });
  } catch (error) {
    res.status(500).json({
      error: 'Erro interno do servidor',
      message: error.message
    });
  }
});

/**
 * @swagger
 * /api/users/profile:
 *   put:
 *     summary: Atualizar perfil do usuário
 *     tags: [Usuários]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Novo nome do usuário
 *                 example: "João Silva Santos"
 *     responses:
 *       200:
 *         description: Perfil atualizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
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
 *       400:
 *         description: Dados inválidos
 *       401:
 *         description: Não autorizado
 */
router.put('/profile', authenticateToken, validateUpdateProfile, async (req, res) => {
  try {
    const { name } = req.body;
    const userId = req.user.id;
    
    const updatedUser = UserService.updateUserProfile(userId, { name });
    
    res.json({
      message: 'Perfil atualizado com sucesso',
      user: updatedUser
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

/**
 * @swagger
 * /api/users/stats:
 *   get:
 *     summary: Obter estatísticas dos usuários (apenas para debug)
 *     tags: [Usuários]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Estatísticas dos usuários
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalUsers:
 *                   type: number
 *                   description: Total de usuários registrados
 *                 blockedAccounts:
 *                   type: number
 *                   description: Número de contas bloqueadas
 *                 blockedEmails:
 *                   type: array
 *                   items:
 *                     type: string
 *                   description: Lista de emails bloqueados
 *       401:
 *         description: Não autorizado
 */
router.get('/stats', authenticateToken, async (req, res) => {
  try {
    const stats = UserService.getStats();
    
    res.json({
      message: 'Estatísticas obtidas com sucesso',
      stats
    });
  } catch (error) {
    res.status(500).json({
      error: 'Erro interno do servidor',
      message: error.message
    });
  }
});

module.exports = router; 