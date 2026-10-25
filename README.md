# KIAZOP-LIVROS-WHATSAPP

Loja demonstrativa de livros digitais com frontend estático na Vercel e integração inicial com a **WhatsApp Cloud API oficial da Meta**, através de Vercel Functions. A nova integração não exige VPS, Hostinger, EasyPanel, n8n ou Evolution API.

## O que está preparado

- Site responsivo com pesquisa e filtros de catálogo.
- Cabeçalhos de segurança e validações automáticas no GitHub Actions.
- `GET/POST /api/whatsapp/webhook`: verificação Meta e validação HMAC-SHA256; pode responder diretamente pela Cloud API ou encaminhar eventos validados para um Webhook genérico do n8n através de `N8N_WEBHOOK_URL` + `N8N_FORWARD_SECRET`.
- `GET /api/whatsapp/health`: verificação segura da presença das variáveis de ambiente, sem expor segredos.
- Deduplicação opcional de eventos por 24 horas via Upstash Redis REST.
- Guia de configuração, incluindo a ponte segura para n8n: [WhatsApp Cloud API + Vercel](docs/CONFIGURACAO-WHATSAPP-CLOUD-API-VERCEL.md).

## Estado atual — não é ainda uma loja pronta para vendas

O frontend e o atendimento são demonstrativos. Os livros/categorias não representam um catálogo comercial real. Ainda não existem checkout, gestão persistente de pedidos, confirmação de pagamento, entrega segura de e-books, reembolsos nem transferência real para um atendente humano. Não anuncies vendas nem entregues ficheiros até esses fluxos estarem implementados e testados.

A migração foi integrada em `main` via [Pull Request #1](https://github.com/manuelbaptistalicanga00-sys/KIAZOP-LIVROS-WHATSAPP./pull/1), e as validações do GitHub Actions passaram no pull request. O deployment de produção na Vercel e a configuração da conta Meta ainda precisam de confirmação; não foram adicionadas credenciais ao GitHub.

## Início rápido

1. Abre [docs/CONFIGURACAO-WHATSAPP-CLOUD-API-VERCEL.md](docs/CONFIGURACAO-WHATSAPP-CLOUD-API-VERCEL.md).
2. Configura na Vercel as variáveis `WHATSAPP_VERIFY_TOKEN`, `WHATSAPP_APP_SECRET`, `WHATSAPP_ACCESS_TOKEN` e `WHATSAPP_PHONE_NUMBER_ID`.
3. Faz redeploy na Vercel.
4. No painel Meta, define o callback `https://kiazop-livros-whatsapp.vercel.app/api/whatsapp/webhook`, usa o mesmo verify token e subscreve o campo `messages`.
5. Testa o handshake, mensagens de texto, assinatura inválida e os logs. Configura Upstash antes de produção para evitar respostas duplicadas em retries.
6. Se quiseres que o n8n faça as automações, configura `N8N_WEBHOOK_URL` e `N8N_FORWARD_SECRET` conforme o guia; usa um Webhook genérico no n8n, não o WhatsApp Trigger independente.
7. Confirma que o número/conta está aprovado e que o token é apropriado para produção.

## Variáveis de ambiente

Consulta `.env.example` para os nomes e valores ilustrativos. Adiciona segredos reais apenas nas Environment Variables da Vercel, nunca em commits ou no frontend. `/api/whatsapp/health` revela apenas se as variáveis existem, não os seus valores nem se o token funciona.

## Infraestrutura anterior (legado)

O repositório ainda contém `docker-compose.yml`, workflow n8n/Evolution e o guia Hostinger/EasyPanel para referência. Esses ficheiros são **legado** e não fazem parte do novo fluxo Vercel + Cloud API. Não atives o workflow antigo se escolheres a integração oficial.

## Segurança e conformidade

- Nunca coloques API keys, tokens, passwords, cookies ou segredos no GitHub.
- Valida as assinaturas dos webhooks; não desligues a validação.
- Confirma pagamentos com um webhook autenticado do prestador, não por comprovativo enviado no WhatsApp.
- Usa apenas e-books que tenhas direito de distribuir.
- Publica condições de venda, privacidade, suporte e reembolso antes de vender.
- Respeita a janela de atendimento e os modelos de mensagem exigidos pela Meta.

## Links

- Site: https://kiazop-livros-whatsapp.vercel.app/
- Repositório: https://github.com/manuelbaptistalicanga00-sys/KIAZOP-LIVROS-WHATSAPP.
- GitHub Actions: https://github.com/manuelbaptistalicanga00-sys/KIAZOP-LIVROS-WHATSAPP./actions
- [Plano de execução](docs/EXECUCAO-PASSO-A-PASSO.md)
- [Checklist de publicação](docs/CHECKLIST-PUBLICACAO.md)
