# Instruções de Uso - API REST de Login

## 🚀 Como Executar

1. **Instalar dependências:**
   ```bash
   npm install
   ```

2. **Executar em desenvolvimento (com hot reload):**
   ```bash
   npm run dev
   ```

3. **Executar em produção:**
   ```bash
   npm start
   ```

## 📋 Endpoints Disponíveis

### Autenticação (Público)

#### 1. Registrar Usuário
- **URL:** `POST /api/auth/register`
- **Body:**
  ```json
  {
    "name": "João Silva",
    "email": "joao@example.com",
    "password": "Senha123"
  }
  ```
- **Resposta de Sucesso (201):**
  ```json
  {
    "message": "Usuário registrado com sucesso",
    "user": {
      "id": "1752539149291",
      "name": "João Silva",
      "email": "joao@example.com",
      "createdAt": "2025-07-15T00:25:49.291Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expiresIn": "24h"
  }
  ```

#### 2. Fazer Login
- **URL:** `POST /api/auth/login`
- **Body:**
  ```json
  {
    "email": "joao@example.com",
    "password": "Senha123"
  }
  ```
- **Resposta de Sucesso (200):**
  ```json
  {
    "message": "Login realizado com sucesso",
    "user": {
      "id": "1752539149291",
      "name": "João Silva",
      "email": "joao@example.com",
      "createdAt": "2025-07-15T00:25:49.291Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expiresIn": "24h"
  }
  ```

#### 3. Redefinir Senha (Simulado)
- **URL:** `POST /api/auth/reset-password`
- **Body:**
  ```json
  {
    "email": "joao@example.com"
  }
  ```
- **Resposta de Sucesso (200):**
  ```json
  {
    "message": "Email de redefinição enviado com sucesso",
    "tempPassword": "abc12345"
  }
  ```

### Usuários (Protegido - Requer Token JWT)

#### 4. Obter Perfil
- **URL:** `GET /api/users/profile`
- **Headers:** `Authorization: Bearer SEU_TOKEN_JWT`
- **Resposta de Sucesso (200):**
  ```json
  {
    "message": "Perfil obtido com sucesso",
    "user": {
      "id": "1752539149291",
      "name": "João Silva",
      "email": "joao@example.com",
      "createdAt": "2025-07-15T00:25:49.291Z"
    }
  }
  ```

#### 5. Atualizar Perfil
- **URL:** `PUT /api/users/profile`
- **Headers:** `Authorization: Bearer SEU_TOKEN_JWT`
- **Body:**
  ```json
  {
    "name": "João Silva Santos"
  }
  ```
- **Resposta de Sucesso (200):**
  ```json
  {
    "message": "Perfil atualizado com sucesso",
    "user": {
      "id": "1752539149291",
      "name": "João Silva Santos",
      "email": "joao@example.com",
      "createdAt": "2025-07-15T00:25:49.291Z"
    }
  }
  ```

#### 6. Estatísticas (Debug)
- **URL:** `GET /api/users/stats`
- **Headers:** `Authorization: Bearer SEU_TOKEN_JWT`
- **Resposta de Sucesso (200):**
  ```json
  {
    "message": "Estatísticas obtidas com sucesso",
    "stats": {
      "totalUsers": 1,
      "blockedAccounts": 0,
      "blockedEmails": []
    }
  }
  ```

### Outros Endpoints

#### 7. Health Check
- **URL:** `GET /health`
- **Resposta:**
  ```json
  {
    "status": "OK",
    "message": "API de Login funcionando corretamente",
    "timestamp": "2025-07-15T00:25:24.318Z"
  }
  ```

#### 8. Documentação Swagger
- **URL:** `GET /api-docs`
- **Descrição:** Interface interativa da documentação da API

## 🔒 Funcionalidades de Segurança

### Bloqueio de Conta
- Após **3 tentativas** de login com senha incorreta
- Bloqueio por **30 minutos**
- Reset automático após o período de bloqueio

### Validações
- **Nome:** 2-100 caracteres
- **Email:** Formato válido
- **Senha:** Mínimo 6 caracteres, 1 maiúscula, 1 minúscula, 1 número

### Autenticação JWT
- Tokens válidos por **24 horas**
- Necessário para rotas protegidas
- Formato: `Authorization: Bearer TOKEN`

## 🧪 Testes

### Usando o arquivo test-examples.http
1. Abra o arquivo `test-examples.http` no VS Code
2. Instale a extensão "REST Client"
3. Clique em "Send Request" em cada endpoint

### Usando PowerShell
```powershell
# Registrar usuário
Invoke-WebRequest -Uri "http://localhost:3000/api/auth/register" -Method POST -Headers @{"Content-Type"="application/json"} -Body '{"name":"João Silva","email":"joao@example.com","password":"Senha123"}'

# Fazer login
Invoke-WebRequest -Uri "http://localhost:3000/api/auth/login" -Method POST -Headers @{"Content-Type"="application/json"} -Body '{"email":"joao@example.com","password":"Senha123"}'
```

### Usando curl (Linux/Mac)
```bash
# Registrar usuário
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"João Silva","email":"joao@example.com","password":"Senha123"}'

# Fazer login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"joao@example.com","password":"Senha123"}'
```

## 📊 Status Codes

- `200` - Sucesso
- `201` - Criado com sucesso
- `400` - Dados inválidos
- `401` - Não autorizado
- `403` - Acesso negado (conta bloqueada)
- `404` - Não encontrado
- `409` - Conflito (email já existe)
- `429` - Muitas tentativas
- `500` - Erro interno do servidor

## 🔧 Configuração

### Variáveis de Ambiente
- `PORT` - Porta do servidor (padrão: 3000)
- `JWT_SECRET` - Chave secreta para JWT (padrão: definida no código)
- `NODE_ENV` - Ambiente (development/production)

### Armazenamento
- **Memória:** Dados são perdidos ao reiniciar o servidor
- **Usuários:** Array em memória
- **Tentativas de login:** Map em memória

## 🚨 Limitações

1. **Armazenamento temporário:** Dados são perdidos ao reiniciar
2. **Email simulado:** Redefinição de senha não envia email real
3. **Sem banco de dados:** Apenas para estudos de teste
4. **Sem HTTPS:** Apenas para ambiente de desenvolvimento

## 📝 Notas Importantes

- Esta API foi criada **exclusivamente para estudos de teste de software**
- **NÃO** deve ser usada em produção
- Todos os dados são armazenados em memória
- A redefinição de senha é simulada (não envia email real)
- O bloqueio de conta é temporário (30 minutos) 