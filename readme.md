# 📰 Blog API – Backend

Este é o backend de uma aplicação de blog, desenvolvido com **Node.js**, **Express**, **TypeScript** e **MySQL**, utilizando autenticação JWT e armazenamento de imagens em formato BLOB no banco de dados.

---

## 🚀 Funcionalidades

- Cadastro e login de usuários com senha criptografada (`bcrypt`)
- Autenticação via JWT
- CRUD de artigos (criar, listar, editar, excluir)
- Upload de imagem para o artigo com armazenamento em BLOB
- Servir imagem diretamente via rota
- Proteção de rotas: apenas o autor pode editar ou excluir seu artigo

---

## 🛠️ Tecnologias

- Node.js
- Express
- TypeScript
- MySQL
- JWT
- Bcrypt
- Multer

---

## 📁 Estrutura
```
src/
├── controllers/
├── routes/
├── services/
├── middlewares/
├── database/
└── index.ts
```
---

## 🔐 Variáveis de Ambiente

Crie um arquivo `.env` na raiz com o seguinte conteúdo:

```env
DB_HOST= normalmente usado: localhost, mas coloca qual for o seu

DB_PORT= porta do seu banco, normalmente usado: 3306

DB_USER= normalmente usado :root

DB_PASSWORD=sua_senha, pessoal de cada um com o proprio banco

DB_NAME= o database fiz como blog

JWT_SECRET=uma_chave_muito_secreta, rode no terminal o comando "openssl rand -base64 32", vai retornar uma chave e adiciona aqui
```

## Banco de dados
#### O Dump da estrutura do banco esta na pasta database/:
```
mysql -u seu_usuario -p blog < database/dump/blog-dump.sql
```

## Como rodar o projeto
```
# Instale as dependências
npm install

# Rode o projeto em modo dev
npm run dev
```

## Rotas principais

🔐 Autenticação
- POST /auth/register – cadastro

- POST /auth/login – login (retorna JWT)

📝 Artigos
- GET /articles – lista todos

- GET /articles/:id – visualiza um

- GET /articles/:id/image – imagem do artigo

- POST /articles – criar (autenticado, multipart)

- PUT /articles/:id – editar (autenticado, dono)

- DELETE /articles/:id – deletar (autenticado, dono)

## 📫 Contato

[![Email](https://img.shields.io/badge/Email-Enviar_Email-blue?style=for-the-badge&logo=gmail)](mailto:joaovra@gmail.com)

Projeto desenvolvido como parte de um desafio técnico.

