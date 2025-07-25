# API REST de Login

Uma API REST simples de login criada para estudos de teste de software.

## Funcionalidades

- ✅ Login bem-sucedido com email e senha
- ✅ Retorno adequado para login inválido
- ✅ Bloqueio de conta após 3 tentativas
- ✅ Redefinição de senha via endpoint (simulado)
- ✅ Registro de novos usuários
- ✅ Armazenamento simples de usuários em memória
- ✅ Uso de JWT para autenticação
- ✅ Documentação Swagger

## Tecnologias Utilizadas

- **Node.js** - Runtime JavaScript
- **Express** - Framework web
- **JWT** - Autenticação via tokens
- **bcryptjs** - Criptografia de senhas
- **Swagger** - Documentação da API
- **Helmet** - Segurança
- **CORS** - Cross-Origin Resource Sharing
- **express-validator** - Validação de dados

## Instalação

1. Clone o repositório
2. Instale as dependências:
```bash
npm install
```

## Execução

### Desenvolvimento (com hot reload)
```bash
npm run dev
```

### Produção
```bash
npm start
```

## Endpoints

### Autenticação
- `POST /api/auth/register` - Registrar novo usuário
- `POST /api/auth/login` - Fazer login
- `POST /api/auth/reset-password` - Redefinir senha (simulado)

### Usuários (Protegido)
- `GET /api/users/profile` - Obter perfil do usuário
- `PUT /api/users/profile` - Atualizar perfil
- `DELETE /api/users/delete` - Excluir usuário autenticado

### Documentação
- `GET /api-docs` - Documentação Swagger

## Estrutura do Projeto

```
src/
├── server.js          # Servidor principal
├── routes/
│   ├── auth.js        # Rotas de autenticação
│   └── users.js       # Rotas de usuários
├── middleware/
│   ├── auth.js        # Middleware de autenticação
│   └── validation.js  # Middleware de validação
├── services/
│   ├── authService.js # Lógica de autenticação
│   └── userService.js # Lógica de usuários
└── utils/
    └── swagger.js     # Configuração Swagger
```

## Exemplos de Uso

### Registrar usuário
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "João Silva",
    "email": "joao@example.com",
    "password": "senha123"
  }'
```

### Fazer login
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "joao@example.com",
    "password": "senha123",
    "rememberMe": true
  }'
```

Se 'rememberMe' for true, um cookie persistente chamado 'token' será enviado na resposta e o usuário permanecerá logado por 30 dias.

### Acessar perfil (com token)
```bash
curl -X GET http://localhost:3000/api/users/profile \
  -H "Authorization: Bearer SEU_TOKEN_JWT"
```

### Excluir usuário autenticado
```bash
curl -X DELETE http://localhost:3000/api/users/delete \
  -H "Authorization: Bearer SEU_TOKEN_JWT"
```

## Documentação Swagger

Acesse a documentação interativa da API em:
**http://localhost:3000/api-docs**

## Segurança

- Senhas são criptografadas com bcrypt
- Tokens JWT para autenticação
- Rate limiting para prevenir ataques
- Headers de segurança com Helmet
- Validação de dados de entrada
- **Opção "Lembrar Senha" (manter logado):** Se ativada, o token JWT é enviado em um cookie httpOnly persistente válido por 30 dias.

## Armazenamento

Os dados são armazenados em memória durante a execução da aplicação. Ao reiniciar o servidor, os dados são perdidos.

## Status Codes

- `200` - Sucesso
- `201` - Criado com sucesso
- `400` - Dados inválidos
- `401` - Não autorizado
- `403` - Acesso negado (conta bloqueada)
- `404` - Não encontrado
- `429` - Muitas tentativas
- `500` - Erro interno do servidor 