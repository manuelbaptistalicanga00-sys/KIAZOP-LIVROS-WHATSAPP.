# Execução passo a passo — KIAZOP Livros

Este é o quadro de trabalho para levar a loja à produção. Não considerar uma etapa concluída sem teste real.

## Estado
- [x] Site demonstrativo e pesquisa/filtros no GitHub.
- [x] Cabeçalhos básicos de segurança e validações automáticas.
- [x] Workflow inicial do n8n criado e mantido inativo.
- [ ] Deploy Vercel confirmado por URL público.
- [ ] Evolution API, número WhatsApp e webhook testados.
- [ ] Catálogo real, capas autorizadas, preços e ficheiros confirmados.
- [ ] Pagamentos verificados no servidor antes da entrega.
- [ ] Compra completa testada de ponta a ponta.

## Etapa 1 — Vercel (começar aqui)
1. Abre https://vercel.com/dashboard.
2. Localiza o projeto ligado ao repositório KIAZOP-LIVROS-WHATSAPP.
3. Se não existir, importa o repositório GitHub e escolhe o ramo main.
4. Define Root Directory como raiz do repositório. É um site estático; não precisa de build command.
5. Faz Deploy e espera que o deployment mais recente fique Ready.
6. Abre o endereço .vercel.app e testa o site em telemóvel.
7. Envia-me o endereço público ou a mensagem de erro do deployment. Não envies passwords, tokens ou chaves.

**Critério de conclusão:** URL público abre e o último deployment aparece como Ready.

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
- Guia Hostinger/EasyPanel: CONFIGURACAO-HOSTINGER-EASYPANEL.md
- Checklist: CHECKLIST-PUBLICACAO.md
