# Prioridades por Dia (Next.js + Vercel)

## Rodar local
1. `npm i`
2. `npm run dev`
3. Abra http://localhost:3000

## Persistência
- **Dev**: salva em `data/weeks.json`.
- **Produção (Vercel)**: use **Vercel Blob** para persistir entre execuções.

### Ativar Vercel Blob
1. No dashboard da Vercel, Settings → Environment Variables:
   - `BLOB_READ_WRITE_TOKEN` = (crie um token de acesso do Vercel Blob).
2. Deploy novamente.

> Sem esse token, a Vercel não persiste escrita em disco; a app funciona, mas a semana poderá ser re-gerada.

## Deploy na Vercel
1. Suba este projeto num repositório GitHub.
2. No painel da Vercel: **Add New → Project → Import** seu repositório.
3. Framework: **Next.js** (auto).
4. (Opcional, mas recomendado) Adicione `BLOB_READ_WRITE_TOKEN` em **Environment Variables**.
5. Deploy.

## Uso
- Página **/**: escolha dia (dom..qui) e informe a quantidade de clientes. 
  - Regra: sempre maior prioridade; empates são resolvidos por um **embaralhamento fixo da semana**; cada colaborador **máximo 2**.
  - Campo “Semana (YYYY-MM-DD)” é opcional; se vazio, a API cria/usa a semana atual (segunda-feira como chave).
- Página **/semanas**: gere/salve a **semana** uma vez. Isso fixa os desempates por toda a semana.

## Exemplos
- 2 clientes na **quinta**: retornará **obrigatoriamente** `cadu` e `ant` (prioridade 5).
- 5 clientes na **quinta**: `cadu`, `ant`, `cadu`, `ant`, e o 5º vai para `soler` (porque `cadu` e `ant` já atingiram 2).
