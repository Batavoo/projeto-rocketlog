# RocketLog API 🚀

![License: ISC](https://img.shields.io/badge/License-ISC-blue.svg)

API REST para gestão de entregas de encomendas, construída com Node.js, Express e TypeScript. O projeto utiliza Prisma como ORM para interagir com um banco de dados PostgreSQL, implementa autenticação JWT, controle de autorização por perfil (RBAC), e validação de dados com Zod.

## Sumário

- [Funcionalidades](#funcionalidades)
- [Tecnologias Utilizadas](#tecnologias-utilizadas)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [Pré-requisitos](#pré-requisitos)
- [Como Executar](#como-executar)
  - [1. Clone o Repositório](#1-clone-o-repositório)
  - [2. Instale as Dependências](#2-instale-as-dependências)
  - [3. Configure o Ambiente](#3-configure-o-ambiente)
  - [4. Execute as Migrações](#4-execute-as-migrações)
  - [5. Inicie a Aplicação](#5-inicie-a-aplicação)
- [Testes](#testes)
- [Rotas da API](#rotas-da-api)
- [Licença](#licença)

## Funcionalidades

- ✅ **Cadastro de Usuários**: Criação de novos usuários com senha criptografada.
- ✅ **Autenticação JWT**: Geração de token para acesso seguro às rotas protegidas.
- ✅ **Controle de Acesso por Perfil (RBAC)**: Distinção entre perfis `customer` e `sale` para autorização de acesso.
- ✅ **Gestão de Entregas**: Criação, listagem e atualização de status de entregas.
- ✅ **Logs de Entrega**: Rastreamento do histórico de status de cada entrega.
- ✅ **Validação de Dados**: Utilização do Zod para garantir a integridade dos dados de entrada.
- ✅ **Tratamento de Erros**: Middleware centralizado para uma resposta de erro consistente.

## Tecnologias Utilizadas

- **Backend**: Node.js, Express, TypeScript
- **ORM**: Prisma
- **Banco de Dados**: PostgreSQL
- **Autenticação**: JSON Web Token (JWT), Bcrypt
- **Validação**: Zod
- **Testes**: Jest, Supertest
- **Build**: tsup
- **Desenvolvimento**: tsx

## Estrutura do Projeto

```
/
├── prisma/             # Schema e migrações do banco de dados
│   └── schema.prisma
├── src/                # Código-fonte da aplicação
│   ├── app.ts          # Configuração principal do Express
│   ├── server.ts       # Inicialização do servidor
│   ├── routes/         # Definição das rotas da API
│   ├── controllers/    # Lógica de negócio das rotas
│   ├── middlewares/    # Middlewares (autenticação, autorização, erros)
│   ├── database/       # Configuração do cliente Prisma
│   ├── configs/        # Configurações (auth)
│   ├── utils/          # Utilitários (ex: AppError)
│   ├── types/          # Definições de tipos (ex: extensão do Express)
│   └── tests/          # Testes de integração
├── .env                # Variáveis de ambiente (local)
├── .env-example        # Exemplo de variáveis de ambiente
├── docker-compose.yml  # Configuração do serviço PostgreSQL
└── package.json        # Dependências e scripts
```

## Pré-requisitos

- [Node.js](https://nodejs.org/) (versão >= 18)
- [NPM](https://www.npmjs.com/) ou [Yarn](https://yarnpkg.com/)
- [Docker](https://www.docker.com/) (recomendado para o banco de dados)

## Como Executar

### 1. Clone o Repositório

```sh
git clone <URL_DO_SEU_REPOSITORIO>
cd projeto-rocketlog
```

### 2. Instale as Dependências

```sh
npm install
```

### 3. Configure o Ambiente

1.  Copie o arquivo de exemplo `.env-example` para um novo arquivo chamado `.env`.

    ```sh
    cp .env-example .env
    ```

2.  Edite o arquivo `.env` com as credenciais do seu banco de dados e um segredo para o JWT. Se estiver usando o Docker, os valores padrão já devem funcionar.

    ```env
    // .env
    DATABASE_URL="postgresql://postgres:postgres@localhost:5432/rocketlog"
    JWT_SECRET=seu-segredo-super-secreto
    PORT=3333
    ```

3.  Inicie o container do PostgreSQL com Docker Compose.

    ```sh
    docker-compose up -d
    ```

### 4. Execute as Migrações

Este comando aplicará o schema do Prisma ao seu banco de dados.

```sh
npx prisma migrate dev
```

### 5. Inicie a Aplicação

- **Modo de Desenvolvimento** (com hot-reload):

  ```sh
  npm run dev
  ```

- **Modo de Produção**:

  ```sh
  npm run build
  npm start
  ```

O servidor estará rodando em `http://localhost:3333`.

## Testes

Para executar os testes de integração, utilize o seguinte comando. Ele observará as alterações nos arquivos e re-executará os testes automaticamente.

```sh
npm run test:dev
```

**Nota**: Os testes são executados no banco de dados configurado em `DATABASE_URL`. Recomenda-se o uso de um banco de dados dedicado para testes.

## Rotas da API

A URL base para todas as rotas é `http://localhost:3333`.

---

### Usuários

- **`POST /users`**
  - **Descrição**: Cria um novo usuário.
  - **Autorização**: Nenhuma.
  - **Corpo**:
    ```json
    {
      "name": "string",
      "email": "string",
      "password": "string"
    }
    ```

---

### Sessões

- **`POST /sessions`**
  - **Descrição**: Autentica um usuário e retorna um token JWT.
  - **Autorização**: Nenhuma.
  - **Corpo**:
    ```json
    {
      "email": "string",
      "password": "string"
    }
    ```

---

### Entregas

- **`POST /deliveries`**

  - **Descrição**: Cria uma nova entrega.
  - **Autorização**: `sale`.
  - **Corpo**:
    ```json
    {
      "user_id": "string (uuid)",
      "description": "string"
    }
    ```

- **`GET /deliveries`**

  - **Descrição**: Lista todas as entregas.
  - **Autorização**: `sale`.

- **`PATCH /deliveries/:id/status`**
  - **Descrição**: Atualiza o status de uma entrega.
  - **Autorização**: `sale`.
  - **Corpo**:
    ```json
    {
      "status": "processing" | "shipped" | "delivered"
    }
    ```

---

### Logs de Entrega

- **`POST /delivery-logs`**

  - **Descrição**: Adiciona um novo log a uma entrega. A entrega não pode estar com status `processing` ou `delivered`.
  - **Autorização**: `sale`.
  - **Corpo**:
    ```json
    {
      "delivery_id": "string (uuid)",
      "description": "string"
    }
    ```

- **`GET /delivery-logs/:delivery_id/show`**
  - **Descrição**: Exibe os detalhes e logs de uma entrega. Clientes (`customer`) só podem visualizar suas próprias entregas.
  - **Autorização**: `sale` ou `customer`.

## Licença

Este projeto está sob a licença ISC. Veja o arquivo [package.json](package.json) para mais detalhes.
