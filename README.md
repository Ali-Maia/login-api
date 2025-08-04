# API REST de Login

API REST criada para estudos de testes de software com autenticação via JWT.

---

## Configuração Inicial

1. Clone o projeto:
   ```bash
   git clone <URL_DO_REPOSITORIO>
   cd <nome-da-pasta>
   ```

2. Instale as dependências:
   ```bash
   npm install
   ```

3. Crie um arquivo `.env` na raiz do projeto com o seguinte conteúdo:
   ```env
   BASE_URL='http://localhost:3000'
   ```

---

## Executando o Projeto

- **Ambiente de Produção:**
  ```bash
  npm start
  ```
  Inicia o servidor normalmente com Node.js em `http://localhost:3000`.

- **Ambiente de Desenvolvimento (com hot reload):**
  ```bash
  npm run dev
  ```
  Usa `nodemon` para reiniciar o servidor automaticamente a cada alteração no código.

**Atenção:** o arquivo `src/server.js` possui um *Rate Limiting* que bloqueia IPs após **200 requisições**. Durante testes, isso pode causar falhas. Monitore a quantidade de requisições ou aumente esse limite se necessário.

---

## Testes Automatizados

### Rodar todos os testes:
```bash
npm run test
```

### Rodar testes por grupo:
```bash
npm run test:auth     # Testes de autenticação
npm run test:users    # Testes de usuários
```

### Rodar testes específicos:
```bash
npm run test:auth:login     # Login
npm run test:auth:register  # Registro
npm run test:auth:reset     # Redefinição de senha
```

> Os testes utilizam Mocha + Supertest + Chai. O relatório é gerado automaticamente em formato HTML com o mochawesome.

---

## Tecnologias

### API em:
- Node.js
- Express
- JWT
- Helmet
- CORS
- express-validator
- Swagger

### Testes com:
- Mocha
- Supertest
- Chai

### Relatório com:
- Mochawesome