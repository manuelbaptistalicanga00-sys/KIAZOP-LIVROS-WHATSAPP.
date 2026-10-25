# Execução passo a passo — KIAZOP Livros

Este é o quadro de trabalho para levar a loja à produção. Não considerar uma etapa concluída sem teste real.

## Estado
- [x] Site demonstrativo e pesquisa/filtros no GitHub.
- [x] Cabeçalhos básicos de segurança e validações automáticas.
- [x] Workflow inicial do n8n criado e mantido inativo.
- [x] URL de produção fornecido pelo proprietário: https://kiazop-livros-whatsapp.vercel.app/
- [x] Última execução do GitHub Actions consultada: sucesso nas validações estáticas.
- [ ] Teste manual do site publicado em telemóvel e computador; confirmar que a versão publicada corresponde ao último commit.
- [ ] Evolution API, número WhatsApp e webhook testados.
- [ ] Catálogo real, capas autorizadas, preços e ficheiros confirmados.
- [ ] Pagamentos verificados no servidor antes da entrega.
- [ ] Compra completa testada de ponta a ponta.

## Etapa 1 — Vercel
1. URL fornecido: https://kiazop-livros-whatsapp.vercel.app/
2. Abre o endereço num navegador, também em janela privada, e testa pesquisa, filtros, links e visualização em telemóvel.
3. No painel Vercel, confirma que o deployment mais recente do ramo main está Ready e corresponde ao último commit do GitHub.
4. Se houver erro, envia o texto ou uma captura do erro, sem segredos.

**Estado:** URL recebido e validações do repositório passaram. O acesso HTTP automatizado nesta conversa não confirmou o conteúdo live, por isso o teste visual final continua pendente.

## Etapa 2 — WhatsApp / Evolution API / n8n
- [ ] Confirmar que n8n e Evolution API estão ativos no EasyPanel e usam HTTPS.
- [ ] Confirmar versão Evolution API, nome da instância e número ligado.
- [ ] Configurar no ambiente do n8n EVOLUTION_API_URL, EVOLUTION_INSTANCE e EVOLUTION_API_KEY. Não colocar segredos no GitHub.
- [ ] Importar n8n/workflows/whatsapp-venda-livros.json.
- [ ] Configurar MESSAGES_UPSERT para o webhook de produção /webhook/whatsapp-livros-inbound.
- [ ] Testar mensagem recebida, resposta, mensagem própria, grupo, mensagem vazia e erro.
- [ ] Só ativar o workflow após os testes passarem.

**Critério:** mensagem direta recebe uma única resposta e os casos que devem ser ignorados não recebem resposta.

## Etapa 3 — catálogo comercial real
- [ ] Fornecer títulos, autores, descrições, idioma e categoria dos livros que tens direito de vender.
- [ ] Usar capas próprias ou licenciadas.
- [ ] Definir preço e moeda por produto (AOA e/ou BRL).
- [ ] Confirmar ficheiros finais e guardá-los em armazenamento privado, não no GitHub público.
- [ ] Publicar condições de venda, privacidade, suporte e reembolso.

Até receber os dados reais, os títulos do site são apenas demonstrativos.

## Etapa 4 — pagamento e entrega
- [ ] Confirmar país do vendedor, tipo de conta comercial e países dos clientes.
- [ ] Escolher um prestador que aceite legalmente o vendedor e as moedas pretendidas.
- [ ] Criar pedidos com identificador único e estado pendente.
- [ ] Confirmar pagamento por API/webhook autenticado no servidor; validar assinatura, pedido, valor e moeda.
- [ ] Tratar eventos repetidos de forma idempotente.
- [ ] Entregar apenas após confirmação válida, com ligação privada e temporária.
- [ ] Testar rejeição, pagamento pendente, webhook inválido, repetição e reembolso.

Nunca entregar um livro só porque o cliente enviou um comprovativo por mensagem.

## Etapa 5 — teste ponta a ponta
- [ ] Site público HTTPS funciona em computador e telemóvel.
- [ ] Pedido tem produto, preço e moeda corretos.
- [ ] WhatsApp recebe e responde uma única vez.
- [ ] Pagamento aprovado altera o estado do pedido.
- [ ] Pagamento pendente/rejeitado não entrega ficheiro.
- [ ] Pagamento confirmado entrega apenas o produto comprado.
- [ ] Link de download é privado e expira.
- [ ] Logs não expõem segredos; backups e reembolsos foram testados.

## Segurança
Nunca partilhar .env, passwords, API keys, tokens, cookies ou QR codes de sessão no GitHub/chat. Guardar segredos apenas nas variáveis de ambiente dos serviços.

## Links
- Repositório: https://github.com/manuelbaptistalicanga00-sys/KIAZOP-LIVROS-WHATSAPP.
- Vercel: https://vercel.com/dashboard
- Testes: https://github.com/manuelbaptistalicanga00-sys/KIAZOP-LIVROS-WHATSAPP./actions
- Guia Hostinger/EasyPanel: docs/CONFIGURACAO-HOSTINGER-EASYPANEL.md
- Checklist: docs/CHECKLIST-PUBLICACAO.md
