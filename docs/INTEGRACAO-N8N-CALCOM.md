# Integração n8n + Cal.com — KIAZOP Livros

## Objetivo

Usar n8n para automatizar processos da loja e considerar Cal.com apenas para marcações de atendimento. Estes componentes são complementares: não substituem o frontend da loja, a integração oficial da Meta nem um sistema de pagamentos.

## n8n — auto-hospedagem

Repositório oficial: https://github.com/n8n-io/n8n  
Documentação de auto-hospedagem: https://docs.n8n.io/hosting/

O repositório já contém um `docker-compose.yml` com n8n e PostgreSQL, volumes persistentes e variáveis obrigatórias para a palavra-passe da base de dados e a chave de encriptação. Isto é apenas configuração versionada; não prova que existe um servidor ativo.

Antes de usar em produção:
1. Escolher o servidor onde será hospedado e apontar um subdomínio HTTPS.
2. Definir `POSTGRES_PASSWORD` e `N8N_ENCRYPTION_KEY` fortes, únicos e fora do Git.
3. Configurar `N8N_HOST`, `N8N_PROTOCOL=https`, `N8N_EDITOR_BASE_URL` e `WEBHOOK_URL` com o domínio real.
4. Proteger o editor n8n, manter volumes persistentes e configurar backups/atualizações.
5. Na Vercel, configurar `N8N_WEBHOOK_URL` e `N8N_FORWARD_SECRET` para o endpoint de webhook n8n correto. O segredo deve coincidir com a validação do lado do workflow.
6. Importar/testar o fluxo com eventos de teste antes de ativar vendas reais.

A Community Edition é gratuita para auto-hospedagem, mas o servidor e os serviços externos podem ter custos. A licença Sustainable Use tem limites sobre disponibilização comercial do n8n como serviço a terceiros; rever a licença oficial antes de incorporar ou revender n8n como parte de um produto pago.

## Fluxos n8n a preparar

- Receber eventos encaminhados pelo webhook Vercel depois da validação de assinatura da Meta.
- Normalizar os dados de mensagens e encaminhar para o atendimento.
- Registar alertas operacionais sem incluir tokens, segredos ou dados pessoais desnecessários nos logs.
- Notificar a equipa sobre novos pedidos e mudanças de estado.
- Só enviar confirmação de compra após o backend verificar um webhook autêntico do prestador de pagamentos.
- Tratar repetição de eventos de forma idempotente.

Não ligar o workflow legado da Evolution API em paralelo com o canal oficial WhatsApp Cloud API sem uma decisão explícita de arquitetura.

## Cal.com — marcações opcionais

Repositório oficial: https://github.com/calcom/cal.com  
Documentação: https://cal.com/docs

Cal.com pode servir para marcar chamadas de suporte, consultoria ou sessões de ajuda com clientes. Não é necessário para vender livros digitais nem substitui o checkout.

Para integrar mais tarde:
1. Definir se será usado o serviço hospedado ou uma instância auto-hospedada.
2. Criar tipos de evento, disponibilidade, fuso horário e calendário responsável.
3. Publicar um link de marcação na página de contacto/suporte.
4. Se necessário, encaminhar webhooks de reservas para n8n para notificações e lembretes.
5. Proteger as credenciais da API/webhook em variáveis de ambiente e testar cancelamentos, alterações e duplicados.

Confirmar os termos e a licença atuais do Cal.com para o modelo de utilização pretendido antes de o incorporar num serviço comercial.

## Estado de lançamento

- [x] Documentação de integração e arquitetura criada no repositório.
- [x] Existe um Docker Compose versionado para n8n + PostgreSQL.
- [ ] Instância n8n implantada num servidor real e acessível por HTTPS.
- [ ] Variáveis e segredo de encaminhamento configurados fora do Git.
- [ ] Workflow importado, ativado e testado com evento real autorizado.
- [ ] Decisão sobre Cal.com tomada; não é bloqueador para publicar a loja.
- [ ] Fluxo de catálogo, pedidos, pagamentos e entrega segura concluído e testado antes de vendas reais.
