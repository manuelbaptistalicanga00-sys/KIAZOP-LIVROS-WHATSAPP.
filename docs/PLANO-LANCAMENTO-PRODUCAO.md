# Plano de lançamento — KIAZOP Livros

Este documento é o critério de saída para publicar a loja em produção. Um commit no GitHub não prova, por si só, que a aplicação está publicada ou que os serviços externos funcionam.

## Estado verificado em 2026-10-26

- [x] Código da integração WhatsApp Cloud API está em `main`.
- [x] GitHub Actions mais recente observado: execução 19, commit `418788e248065d8ae9679ff36144327874ae3a08`, conclusão `success`.
- [ ] Confirmar no painel Vercel que o deployment ligado a `main` está `Ready` e que o domínio de produção aponta para esse deployment.
- [ ] Confirmar variáveis de ambiente e testar o endpoint de diagnóstico em produção.
- [ ] Confirmar configuração do callback e subscrição `messages` na Meta.
- [ ] Testar mensagens recebidas e respostas reais no WhatsApp.
- [ ] Configurar armazenamento de deduplicação persistente (Upstash) antes de tráfego real.
- [ ] Adicionar catálogo real, preços e direitos de distribuição comprovados.
- [ ] Implementar pedidos persistentes, checkout e confirmação de pagamento por webhook autenticado.
- [ ] Implementar entrega privada/temporária de ficheiros, suporte e reembolsos.
- [ ] Publicar páginas de privacidade, condições de venda e contacto de suporte.
- [ ] Fazer teste ponta a ponta, incluindo pagamento recusado/pendente, webhook inválido e evento repetido.

## Variáveis da Vercel

Configurar no painel da Vercel (Production; e Preview se for necessário), nunca no GitHub nem no HTML:

- `WHATSAPP_VERIFY_TOKEN`
- `WHATSAPP_APP_SECRET`
- `WHATSAPP_ACCESS_TOKEN`
- `WHATSAPP_PHONE_NUMBER_ID`
- `WHATSAPP_API_VERSION` (o código usa `v22.0` por defeito)
- `UPSTASH_REDIS_REST_URL` e `UPSTASH_REDIS_REST_TOKEN` para deduplicação persistente
- `N8N_WEBHOOK_URL` e `N8N_FORWARD_SECRET` apenas se o fluxo for encaminhado para n8n

Depois de alterar variáveis, fazer redeploy. O endpoint `/api/whatsapp/health` confirma apenas a presença das variáveis obrigatórias; não prova que os tokens são válidos nem que a Meta está ligada.

## Configuração da Meta

Callback esperado: `https://kiazop-livros-whatsapp.vercel.app/api/whatsapp/webhook`.

Usar o mesmo verify token no painel Meta e na Vercel, subscrever `messages` e testar com um número autorizado. Não publicar tokens ou segredos em issues, commits ou mensagens.

## Regra para lançamento

**Não abrir vendas reais ainda.** O repositório descreve atualmente o catálogo e o atendimento como demonstrativos. Não existe confirmação de pagamento nem entrega comercial segura até esses fluxos serem implementados e testados. Não inventar livros, preços, credenciais, estado de deployment ou testes reais.

## Automação opcional

O n8n pode receber eventos validados através de um webhook genérico, usando `N8N_WEBHOOK_URL` e `N8N_FORWARD_SECRET`. Não ativar simultaneamente o workflow legado de Evolution API se o canal oficial Cloud API for o escolhido. Press-Ticket e Open WebUI são integrações opcionais; não são requisitos para publicar a página estática.
