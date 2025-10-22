# Gerador de Prioridades da Semana

Aplicação simples em Node.js + HTML estático para gerar, visualizar e salvar prioridades semanais.

## Pré-requisitos

- Node.js 18 ou superior.

## Executando localmente

```bash
npm install
npm start
```

O servidor Express será iniciado em `http://localhost:3000` e servirá os arquivos `index.html` e `weekly.html`.

## Armazenamento de semanas

Os arquivos JSON gerados ao salvar uma semana ficam na pasta `data/`. O diretório é criado automaticamente pelo servidor no primeiro acesso.

## Deploy automático na Vercel

1. Faça login na [Vercel](https://vercel.com) e importe este repositório a partir do GitHub.
2. Ao configurar o projeto, mantenha o framework como **Other**. O arquivo `vercel.json` deste repositório já aponta o `server.js` para ser executado como função serverless.
3. Não é necessário configurar comandos de build; a Vercel instalará as dependências automaticamente. Apenas confirme que a variável de ambiente `PORT` não está definida (a plataforma já injeta uma porta própria).
4. Conclua a criação do projeto. A cada push para a branch principal, a Vercel executará o deploy automaticamente usando a função Node definida.

Para testar um deploy manual antes de automatizar, instale a CLI da Vercel (`npm i -g vercel`) e execute `vercel --prod` na raiz do projeto. O comando respeita o `vercel.json` incluído aqui.
