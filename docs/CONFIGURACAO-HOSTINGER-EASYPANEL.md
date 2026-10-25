# Configuração no Hostinger EasyPanel

Este guia assume que já tens uma conta Hostinger. Ter entrado na Hostinger usando GitHub não cria automaticamente um VPS, não instala n8n e não liga a Evolution API. É preciso confirmar se existe um VPS e quais serviços estão instalados.

## 1. Confirmar o VPS e o EasyPanel
1. Entra em https://hpanel.hostinger.com/.
2. Abre VPS e seleciona o servidor, se existir.
3. Abre o EasyPanel.
4. Identifica os projetos/serviços existentes: n8n, Evolution API e, se necessário, PostgreSQL.
5. Anota apenas os nomes e estados (Running/Stopped/Error). Não partilhes passwords, tokens, chaves API nem QR codes.

Se não houver VPS, confirma primeiro se o teu plano inclui um VPS. Uma conta Hostinger ou login com GitHub, por si só, não garante um servidor.

## 2. Domínios
- Configura um domínio/subdomínio para n8n, por exemplo `n8n.teudominio.com`.
- Configura outro para Evolution API, por exemplo `evolution.teudominio.com`.
- Ativa HTTPS para ambos.
- Usa os nomes reais dos teus domínios nas variáveis; os exemplos deste repositório são placeholders.

## 3. Variáveis de ambiente do n8n
No serviço n8n do EasyPanel, configura pelo menos:
- `N8N_HOST`: host público do n8n, sem protocolo.
- `N8N_PROTOCOL=https`
- `N8N_EDITOR_BASE_URL=https://TEU-DOMINIO-N8N/`
- `WEBHOOK_URL=https://TEU-DOMINIO-N8N/`
- `N8N_ENCRYPTION_KEY`: segredo aleatório forte e persistente.
- `GENERIC_TIMEZONE=Africa/Luanda`

Se usares este Docker Compose fora de um template EasyPanel, configura também as variáveis PostgreSQL mostradas em `.env.example`. Não uses os placeholders em produção.

## 4. Importar workflow
1. Abre o editor n8n.
2. Escolhe Import from File e seleciona `n8n/workflows/whatsapp-venda-livros.json`.
3. Define as variáveis `EVOLUTION_API_URL`, `EVOLUTION_INSTANCE` e `EVOLUTION_API_KEY` no ambiente do n8n, ou substitui por credenciais n8n guardadas de forma segura.
4. Mantém o workflow inativo até terminares os testes.

## 5. Definir webhook na Evolution API
Usa a URL de produção do nó Webhook do n8n. A Evolution API deve enviar o evento `MESSAGES_UPSERT` para essa URL. Configura a chave da API apenas no painel/secret manager ou no comando local; nunca no GitHub.

Exemplo conceptual (substitui todos os valores):
```bash
curl -X POST "https://TEU-DOMINIO-EVOLUTION/webhook/set/TUA-INSTANCIA" \
  -H "Content-Type: application/json" \
  -H "apikey: TUA_CHAVE_API" \
  -d '{
    "enabled": true,
    "url": "https://TEU-DOMINIO-N8N/webhook/whatsapp-livros-inbound",
    "webhookByEvents": false,
    "webhookBase64": false,
    "events": ["MESSAGES_UPSERT"]
  }'
```

Confirma o formato do endpoint e os campos na documentação correspondente à versão instalada da Evolution API.

## 6. Testar
1. Ativa o workflow apenas em janela de teste.
2. Envia `CATÁLOGO` a partir de um telefone autorizado.
3. Verifica em Executions se o webhook recebeu o evento e se o nó de resposta executou.
4. Confirma que a mensagem chegou ao WhatsApp.
5. Se falhar, verifica logs, domínio/HTTPS, URL do webhook, formato do payload e permissões da chave API.

## Importante
- Não publiques chaves nem credenciais.
- O workflow de arranque não processa pagamentos nem entrega e-books automaticamente.
- Nunca entregues produtos com base apenas num comprovativo de mensagem; confirma a transação na plataforma de pagamento.
- Ajusta o workflow ao payload real da tua versão Evolution API antes de produção.
