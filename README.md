# KIAZOP-LIVROS-WHATSAPP

Automação inicial de atendimento e catálogo de livros digitais pelo WhatsApp usando Evolution API + n8n, preparada para alojamento num VPS Hostinger com EasyPanel.

## Funcionalidades incluídas
- Site estático responsivo com identidade visual violeta/roxo, pesquisa de catálogo e filtros por categoria.
- Metadados para partilha social e cabeçalhos HTTP de segurança na Vercel.
- Verificações automáticas no GitHub Actions para validar HTML/JavaScript e JSON do workflow.
- Webhook de entrada para eventos de mensagens da Evolution API.
- Respostas iniciais para catálogo, categorias, moeda e pedido de atendimento.
- Categorias: e-books de trading, finanças e investimentos, desenvolvimento pessoal e outros livros digitais.
- Moedas suportadas no atendimento: AOA (kwanza) e BRL (real brasileiro).
- Exemplo de Docker Compose para n8n e PostgreSQL.
- Guia de instalação no Hostinger EasyPanel.

## Estado do projeto
**Estado atual: demonstração visual + automação inicial. Ainda não está pronta para vender em produção.** A pesquisa e os filtros do catálogo funcionam; os títulos são exemplos. O workflow WhatsApp permanece inativo até configurar domínios, credenciais, catálogo real, pagamentos e testes. O workflow vem inativo por segurança.

O GitHub Actions foi executado com sucesso na última versão validada. Isto confirma verificações estáticas do repositório, não um teste real de deploy, WhatsApp ou pagamentos. Consulta `docs/PLANO-DE-LANCAMENTO.md` para os bloqueios e passos de publicação.

## Estrutura
- `docker-compose.yml`: n8n + PostgreSQL para ambiente próprio.
- `.env.example`: nomes das variáveis necessárias, sem segredos reais.
- `n8n/workflows/whatsapp-venda-livros.json`: workflow importável no n8n.
- `docs/CONFIGURACAO-HOSTINGER-EASYPANEL.md`: guia de implantação.
- `docs/CHECKLIST-PUBLICACAO.md`: verificações antes de publicar.

## Início rápido
1. Cria serviços/domínios para n8n e Evolution API no EasyPanel ou confirma os serviços existentes.
2. Configura variáveis de ambiente e armazenamento persistente.
3. Importa o workflow JSON no n8n.
4. Define o webhook da Evolution API para o URL de produção do n8n e evento `MESSAGES_UPSERT`.
5. Testa mensagens recebidas e respostas com um número autorizado.
6. Só ativa vendas após configurar catálogo real, checkout e verificação de pagamento.

## Segurança e pagamentos
- Nunca coloques chaves API, passwords, cookies, tokens, QR codes de sessão ou ficheiros `.env` no GitHub.
- Guarda segredos nas variáveis de ambiente/secret manager do EasyPanel.
- Não entregues e-books apenas com base num comprovativo enviado por mensagem; confirma o pagamento na plataforma de pagamento.
- Não prometer lucros nem retornos financeiros em conteúdos de trading.
- Confirma os direitos de distribuição de cada e-book e a legalidade dos meios de pagamento em Angola e no Brasil.

## Aviso
O repositório contém código de arranque. A compatibilidade do payload da Evolution API depende da versão/instância; valida com uma execução de teste antes de produção.