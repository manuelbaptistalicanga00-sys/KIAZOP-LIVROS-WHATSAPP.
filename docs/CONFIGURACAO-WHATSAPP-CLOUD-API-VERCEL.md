# WhatsApp Cloud API oficial na Vercel

Este guia substitui a rota de instalação Hostinger/EasyPanel para a integração WhatsApp. O site continua estático e a Vercel executa as funções serverless em `/api/whatsapp/`. Não é necessário alojar n8n ou Evolution API para este fluxo.

## O que foi preparado

- `GET /api/whatsapp/webhook`: handshake de verificação do webhook Meta.
- `POST /api/whatsapp/webhook`: valida a assinatura HMAC-SHA256 do corpo original, lê mensagens de texto e envia respostas pela WhatsApp Cloud API.
- `GET /api/whatsapp/health`: informa apenas se as variáveis necessárias estão presentes; não mostra valores secretos e não testa a ligação à Meta.
- Respostas de arranque para catálogo, categorias, moeda e pagamento.
- Deduplicação opcional de IDs de mensagens por 24 horas via Upstash Redis REST. Recomenda-se ativá-la antes de produção.

Esta é uma integração inicial de atendimento, não uma loja de e-books completa. O catálogo ainda contém categorias demonstrativas; não cria pedidos, não cobra, não verifica pagamentos, não entrega ficheiros e não transfere uma conversa para um atendente humano.

## 1. Preparar a conta Meta

1. Abre [Meta for Developers](https://developers.facebook.com/) e cria ou seleciona uma aplicação empresarial com o produto WhatsApp.
2. Em WhatsApp > API Setup, configura uma WhatsApp Business Account e um número de telefone. Para começar, podes usar o número de teste fornecido pela Meta e adicionar o teu número pessoal como destinatário de teste.
3. Guarda o **Phone Number ID**, o token de acesso e o **App Secret** da aplicação. Usa um token de sistema/produção com as permissões necessárias, não um token temporário para um lançamento permanente.
4. Cria um segredo aleatório forte para `WHATSAPP_VERIFY_TOKEN`. É uma senha de verificação escolhida por ti; não é o token de acesso Meta.
5. Nunca coloques estes valores no código, commits, capturas de ecrã públicas ou mensagens de suporte.

Documentação oficial: [WhatsApp Cloud API](https://developers.facebook.com/docs/whatsapp/cloud-api/) e [Webhooks](https://developers.facebook.com/docs/graph-api/webhooks/).

## 2. Configurar as variáveis na Vercel

No projeto correspondente a este repositório, abre Settings > Environment Variables. Adiciona as variáveis abaixo para **Production** e, se quiseres testar uma preview separada, também para Preview com credenciais de teste.

| Variável | Obrigatória | Valor |
|---|---|---|
| `WHATSAPP_VERIFY_TOKEN` | Sim | Segredo aleatório criado por ti; igual ao que vais colocar no painel Meta |
| `WHATSAPP_APP_SECRET` | Sim | App Secret da aplicação Meta; usado para validar assinaturas |
| `WHATSAPP_ACCESS_TOKEN` | Sim | Token de acesso com permissões WhatsApp necessárias |
| `WHATSAPP_PHONE_NUMBER_ID` | Sim | ID do número remetente na Meta, não o número de telefone |
| `WHATSAPP_API_VERSION` | Recomendado | Versão Graph API suportada pela aplicação, por exemplo `v22.0`; confirma a versão disponível no teu painel/documentação antes de produção |
| `UPSTASH_REDIS_REST_URL` | Recomendado | URL REST de uma base Upstash Redis |
| `UPSTASH_REDIS_REST_TOKEN` | Recomendado | Token REST da mesma base Upstash Redis |

As duas variáveis Upstash são opcionais para executar o starter, mas sem ambas a proteção contra mensagens repetidas não é persistente. Cria uma base Redis gerida em [Upstash](https://upstash.com/) se quiseres deduplicação. Não coloques segredos em `.env.example`.

Depois de adicionar ou alterar variáveis, faz redeploy do projeto Vercel.

## 3. Configurar o webhook na Meta

Usa este Callback URL:

```text
https://kiazop-livros-whatsapp.vercel.app/api/whatsapp/webhook
```

1. Em Meta for Developers, abre o produto WhatsApp e a secção de configuração de webhooks.
2. Cola o Callback URL acima.
3. Introduz o mesmo valor de `WHATSAPP_VERIFY_TOKEN` configurado na Vercel.
4. Verifica/guarda. A Meta deve validar o endpoint e receber o `hub.challenge`.
5. Subscreve o campo/evento `messages) no objeto WhatsApp Business Account.
6. Envia uma mensagem de teste de um número autorizado para o número WhatsApp configurado.

O endpoint recusa POST sem assinatura válida. Não desatives a validação de assinatura para “fazer funcionar”.

## 4. Verificar a implantação

- Abre `https://kiazop-livros-whatsapp.vercel.app/api/whatsapp/health`. Espera JSON com `status: "configured"` quando as quatro variáveis obrigatórias estão presentes. Este teste não comprova que o token é válido.
- Na Meta, confirma que a verificação do callback passou e que o campo `messages` está subscrito.
- Envia `CATÁLOGO`, `1`, `MOEDA` e `ATENDIMENTO` e confirma as respostas.
- Testa um POST com assinatura inválida: deve receber HTTP 401.
- Testa eventos de estado de entrega e mensagens não textuais: o endpoint não deve responder a esses eventos como se fossem mensagens do cliente.
- Confirma os logs Vercel sem expor tokens, conteúdo das mensagens ou dados pessoais.

## 5. Limites e próximos passos antes de vender

- O código responde apenas a mensagens de texto recebidas; não trata imagens, áudio, documentos nem interações de botões.
- Mensagens iniciadas pela empresa fora da janela de atendimento aplicável podem exigir templates aprovados pela Meta. O starter não envia templates.
- O menu de categorias é demonstrativo, não consulta um catálogo real.
- Ainda é necessário implementar pedidos persistentes, checkout compatível com o país/conta do vendedor, confirmação de pagamento por webhook autenticado, entrega privada e temporária de ficheiros, reembolsos, política de privacidade e termos de venda.
- Para produção, configure a deduplicação Upstash. Sem ela, as tentativas repetidas de entrega de um webhook podem produzir respostas duplicadas.
- Verifica os limites de execução e configurações da tua conta Vercel. A função aguarda a resposta da API Meta; falhas transitórias podem provocar repetição de eventos.
- O teste de CI verifica sintaxe e estrutura, não a ligação real à Meta nem o envio de mensagens.

## Documentação útil

- [Vercel Functions — Node.js](https://vercel.com/docs/functions/runtimes/node-js)
- [WhatsApp Cloud API](https://developers.facebook.com/docs/whatsapp/cloud-api/)
- [Webhooks Meta](https://developers.facebook.com/docs/graph-api/webhooks/)
- [Upstash Redis REST API](https://upstash.com/docs/redis/features/restapi)

## Estado da migração

- [x] Código inicial da Cloud API e validação de assinatura criado.
- [x] Rota de diagnóstico sem exposição de segredos criada.
- [x] Guia de configuração Vercel/Meta preparado.
- [ ] Configurar as variáveis reais na conta Vercel.
- [ ] Validar webhook no painel Meta.
- [ ] Enviar e receber mensagens reais de teste.
- [ ] Ativar deduplicação persistente.
- [ ] Implementar catálogo real, pedidos, pagamentos e entrega segura antes de abrir vendas.
