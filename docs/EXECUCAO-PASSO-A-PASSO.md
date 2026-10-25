# Execução passo a passo — KIAZOP Livros

Este quadro distingue código preparado de serviços externos efetivamente configurados. Uma etapa só fica concluída após teste real.

## Estado da migração para Vercel + WhatsApp Cloud API

- [x] Site demonstrativo e pesquisa/filtros no GitHub.
- [x] Cabeçalhos de segurança e validações automáticas.
- [x] Ramo de migração criado: `feat/vercel-whatsapp-cloud-api`.
- [x] Função Vercel para verificação do webhook Meta e mensagens recebidas.
- [x] Verificação HMAC-SHA256 da assinatura de webhooks POST.
- [x] Função de diagnóstico que não revela segredos.
- [x] Testes automatizados iniciais para handshake e assinatura inválida/válida.
- [x] Guia de configuração da Cloud API e variáveis Vercel.
- [ ] Aguardar GitHub Actions passar no ramo de migração.
- [ ] Rever e integrar o Pull Request na branch de produção.
- [ ] Confirmar deployment novo Ready na Vercel.
- [ ] Inserir variáveis reais na Vercel (nunca no GitHub).
- [ ] Validar callback e subscrição `messages` no painel Meta.
- [ ] Testar envio/receção com número de teste e depois com o número de produção.
- [ ] Configurar Upstash para deduplicação persistente antes de produção.

## Etapa 1 — Vercel

URL informado: https://kiazop-livros-whatsapp.vercel.app/

1. Confirma que o projeto Vercel está ligado ao repositório e à branch que vai receber a migração.
2. Depois de integrar as alterações, confirma que o deployment mais recente está Ready e corresponde ao commit integrado.
3. Abre o site num telemóvel e num computador; testa pesquisa, filtros, navegação e links.
4. Abre `/api/whatsapp/health`. O estado `configured` indica apenas presença das variáveis obrigatórias; não comprova validade de credenciais ou ligação Meta.

**Estado:** o código foi preparado no GitHub, mas ainda não há confirmação de deployment, nem de variáveis reais no painel Vercel.

## Etapa 2 — WhatsApp Cloud API oficial

Seguir [docs/CONFIGURACAO-WHATSAPP-CLOUD-API-VERCEL.md](CONFIGURACAO-WHATSAPP-CLOUD-API-VERCEL.md).

- [ ] Criar/configurar aplicação Meta e WhatsApp Business Account.
- [ ] Adicionar variáveis `WHATSAPP_VERIFY_TOKEN`, `WHATSAPP_APP_SECRET`, `WHATSAPP_ACCESS_TOKEN`, `WHATSAPP_PHONE_NUMBER_ID` e confirmar `WHATSAPP_API_VERSION`.
- [ ] Configurar callback `https://kiazop-livros-whatsapp.vercel.app/api/whatsapp/webhook`.
- [ ] Verificar o callback com o mesmo verify token e subscrever `messages`.
- [ ] Testar respostas para CATÁLOGO, 1, MOEDA e ATENDIMENTO.
- [ ] Testar assinatura inválida, estado de entrega e mensagens não textuais.
- [ ] Configurar Upstash Redis REST para impedir respostas duplicadas em retries.

A Cloud API oficial substitui n8n/Evolution para o fluxo novo. O workflow antigo permanece inativo e é apenas legado.

## Etapa 3 — catálogo comercial real

- [ ] Fornecer títulos, autores, descrições, idioma e categorias dos livros que tens direito de vender.
- [ ] Usar capas próprias ou licenciadas.
- [ ] Definir preço e moeda por produto (AOA e/ou BRL).
- [ ] Confirmar os ficheiros finais e guardá-los em armazenamento privado, não no GitHub público.
- [ ] Publicar condições de venda, privacidade, suporte e reembolso.
- [ ] Ligar o menu do WhatsApp a um catálogo real em vez de respostas demonstrativas.

Até receber os dados reais, os títulos e categorias são exemplos.

## Etapa 4 — pagamento e entrega

- [ ] Confirmar país do vendedor, tipo de conta e países dos clientes.
- [ ] Escolher um prestador de pagamento que aceite legalmente o vendedor e as moedas pretendidas.
- [ ] Criar pedidos persistentes com identificador único e estado pendente.
- [ ] Confirmar pagamento por webhook/API autenticado; validar assinatura, pedido, valor e moeda.
- [ ] Tratar eventos repetidos de forma idempotente.
- [ ] Entregar apenas após confirmação válida, com ligação privada e temporária.
- [ ] Testar rejeição, pendência, webhook inválido, repetição e reembolso.

Nunca entregar um livro apenas porque o cliente enviou um comprovativo por mensagem.

## Etapa 5 — teste ponta a ponta

- [ ] Site HTTPS funciona em computador e telemóvel.
- [ ] Mensagem WhatsApp recebe uma única resposta.
- [ ] Pedido contém produto, preço e moeda corretos.
- [ ] Pagamento aprovado atualiza o pedido.
- [ ] Pagamento pendente/rejeitado não entrega ficheiro.
- [ ] Pagamento confirmado entrega apenas o produto comprado.
- [ ] Link de download é privado e expira.
- [ ] Logs não expõem segredos; backups e reembolsos foram testados.

## Segurança

Nunca partilhar `.env`, passwords, API keys, tokens, cookies ou QR codes de sessão no GitHub/chat. Guardar segredos apenas nas variáveis de ambiente dos serviços.

## Links

- Repositório: https://github.com/manuelbaptistalicanga00-sys/KIAZOP-LIVROS-WHATSAPP.
- Site: https://kiazop-livros-whatsapp.vercel.app/
- Vercel: https://vercel.com/dashboard
- GitHub Actions: https://github.com/manuelbaptistalicanga00-sys/KIAZOP-LIVROS-WHATSAPP./actions
- Guia novo: [Configuração WhatsApp Cloud API + Vercel](CONFIGURACAO-WHATSAPP-CLOUD-API-VERCEL.md)
- Guia antigo (legado): [Hostinger/EasyPanel](CONFIGURACAO-HOSTINGER-EASYPANEL.md)
- Checklist: [CHECKLIST-PUBLICACAO.md](CHECKLIST-PUBLICACAO.md)
