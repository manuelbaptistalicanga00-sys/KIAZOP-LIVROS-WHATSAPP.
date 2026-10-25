# KIAZOP Livros — plano de lançamento

Este documento distingue o que está implementado no repositório do que exige configuração externa. Não considerar a loja pronta para receber pagamentos até concluir os testes abaixo.

## Implementado no GitHub
- Página estática responsiva com identidade violeta/roxo.
- Catálogo de demonstração, pesquisa por texto, filtros por categoria e estado de pesquisa sem resultados.
- Metadados de partilha social e cabeçalhos HTTP de segurança na configuração da Vercel.
- Workflow n8n inicial para interpretar mensagens e responder através da Evolution API; permanece inativo por segurança.
- Docker Compose para n8n e PostgreSQL, exemplo de variáveis e documentação.
- GitHub Actions para validar a estrutura da página, o JavaScript, o JSON do workflow e a configuração Vercel.

## Passo 1 — publicar a página na Vercel
1. Abre https://vercel.com/dashboard e confirma se o projeto está ligado ao repositório `manuelbaptistalicanga00-sys/KIAZOP-LIVROS-WHATSAPP.`.
2. Se ainda não existir, importa o repositório GitHub.
3. Para esta página estática, usa a raiz do repositório como Root Directory; não é necessário comando de build nem pasta de saída personalizada.
4. Faz o deploy e abre o URL gerado. Confirma a página em telemóvel e computador.
5. Só considerar publicado depois de verificar o URL real e os registos de deploy da Vercel.

## Passo 2 — substituir o catálogo de demonstração
- Adicionar apenas e-books que tenhas direito de vender/distribuir.
- Para cada livro, definir título real, autor, descrição, idioma, capa autorizada, preço e moeda.
- Adicionar ficheiros de entrega num armazenamento privado; não colocar livros pagos numa pasta pública do repositório.
- Não anunciar preços nem disponibilidade antes de os confirmar.

## Passo 3 — ativar atendimento WhatsApp
1. Confirmar que o VPS/serviços n8n e Evolution API estão ativos no EasyPanel.
2. Configurar domínios HTTPS, persistência, backups e variáveis de ambiente secretas conforme `CONFIGURACAO-HOSTINGER-EASYPANEL.md`.
3. Importar `../n8n/workflows/whatsapp-venda-livros.json` no n8n.
4. Configurar a instância Evolution API para enviar o evento `MESSAGES_UPSERT` ao URL de produção do webhook n8n.
5. Verificar se o formato do evento recebido corresponde ao payload esperado pelo workflow.
6. Testar mensagens recebidas, respostas, mensagens do próprio bot, mensagens vazias e erros de API com um número autorizado.
7. Ativar o workflow apenas depois de todos os testes passarem.

## Passo 4 — pagamentos e entrega
- Escolher um prestador de pagamentos que aceite legalmente o vendedor e os países/moedas alvo.
- Definir explicitamente preços em AOA e/ou BRL; não assumir conversão automática.
- Implementar confirmação de pagamento por API/webhook confiável antes da entrega do ficheiro.
- Criar política de reembolso, suporte e privacidade.
- Nunca aceitar um simples comprovativo enviado por mensagem como prova definitiva de pagamento.

## Dados/ações externas ainda necessários
- Confirmar o URL de produção da Vercel e que o deploy está funcional.
- Confirmar VPS, domínios e estados reais de n8n/Evolution API.
- Número WhatsApp autorizado e ligação à instância.
- Catálogo real, preços, ficheiros e direitos de distribuição.
- Prestador de pagamento e fluxo de entrega segura.
- Testes reais ponta a ponta e procedimento de suporte/reembolso.

## Segurança
- Nunca publicar `.env`, chaves API, passwords, tokens, cookies, QR codes ou credenciais no GitHub.
- Usar segredos apenas nas variáveis de ambiente do serviço.
- Fazer backup e testar recuperação antes de processar encomendas reais.
