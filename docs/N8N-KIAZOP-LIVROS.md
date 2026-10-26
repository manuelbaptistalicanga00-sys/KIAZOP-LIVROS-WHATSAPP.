# Workflow n8n — KIAZOP LIVROS WhatsApp

Este workflow é um modelo importável para a arquitetura já documentada neste repositório: **WhatsApp Cloud API → função Vercel que valida a assinatura Meta → webhook genérico n8n → resposta pela Cloud API**.

## Ficheiro
Importa `n8n/workflows/kiazop-livros-whatsapp-automation.json` em n8n: Workflows → Import from File.

## Configuração obrigatória antes de ativar
1. No n8n, define as variáveis de ambiente `N8N_FORWARD_SECRET`, `WHATSAPP_ACCESS_TOKEN` e `WHATSAPP_PHONE_NUMBER_ID`. Usa os mesmos valores de segredo de encaminhamento na Vercel e no n8n. O ID do número é o **Phone Number ID** técnico da Meta, não o número +244.
2. Na Vercel, define `N8N_WEBHOOK_URL` para o URL de produção do nó Webhook deste workflow e `N8N_FORWARD_SECRET` para o mesmo segredo.
3. Faz redeploy da Vercel. Mantém o endpoint Meta atual `https://kiazop-livros-whatsapp.vercel.app/api/whatsapp/webhook`; a Vercel valida a assinatura da Meta antes de encaminhar eventos.
4. Confirma que o cabeçalho enviado pela função Vercel é `X-Kiazop-Webhook-Secret` e que o corpo encaminhado preserva o payload WhatsApp original. Se a implementação local diferir, ajusta o primeiro nó Code e testa antes de ativar.
5. Importa o workflow, verifica as variáveis de ambiente no teu alojamento n8n e testa primeiro com um número de teste autorizado pela Meta. Depois de confirmar os logs e respostas, ativa o workflow.

## O que faz
- Recusa pedidos sem o segredo partilhado.
- Ignora eventos que não sejam mensagens de texto recebidas.
- Responde com um menu KIAZOP LIVROS e opções de catálogo, categorias, compra e atendimento.
- Usa a WhatsApp Cloud API v22.0 através de HTTP Request.

## Importante
- O workflow é criado **inativo** de propósito. Não foi possível testar credenciais Meta/n8n a partir do repositório; não afirmes que está online até passares um teste real.
- Não guardes tokens ou segredos no GitHub.
- Confirma a versão Graph API suportada pela aplicação Meta antes de produção.
- O catálogo e as respostas são demonstrativos. Este workflow ainda não guarda pedidos em base de dados/Google Sheets, não processa pagamentos, não entrega e-books e não confirma vendas.
- Não uses simultaneamente este workflow e outro trigger de WhatsApp para responder ao mesmo número.
