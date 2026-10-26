# Integração n8n + Cal.com/Cal.diy — KIAZOP Livros

## Objetivo

Usar n8n para automatizar processos da loja e considerar uma ferramenta de marcações apenas para chamadas de suporte ou consultoria. Estes componentes não substituem a loja, a integração oficial da Meta nem o sistema de pagamentos.

## n8n — auto-hospedagem

Repositório oficial: https://github.com/n8n-io/n8n  
Documentação de auto-hospedagem: https://docs.n8n.io/hosting/

O repositório já contém um `docker-compose.yml` com n8n e PostgreSQL, volumes persistentes e variáveis obrigatórias para a palavra-passe da base de dados e a chave de encriptação. Isto é apenas configuração versionada; não prova que exista um servidor ativo.

Antes de usar em produção:
1. Escolher o servidor onde será hospedado e apontar um subdomínio HTTPS.
2. Definir `POSTGRES_PASSWORD` e `N8N_ENCRYPTION_KEY` fortes, únicos e fora do Git.
3. Configurar `N8N_HOST`, `N8N_PROTOCOL=https`, `N8N_EDITOR_BASE_URL` e `WEBHOOK_URL` com o domínio real.
4. Proteger o editor n8n, manter volumes persistentes e configurar backups e atualizações.
5. Na Vercel, configurar `N8N_WEBHOOK_URL` e `N8N_FORWARD_SECRET` para o webhook correto. O segredo deve coincidir com a validação do lado do workflow.
6. Importar e testar o fluxo com eventos de teste antes de ativar vendas reais.

A Community Edition é gratuita para auto-hospedagem, mas o servidor e os serviços externos podem ter custos. A licença Sustainable Use tem limites sobre disponibilizar o n8n como serviço a terceiros; rever a licença oficial antes de incorporar ou revender n8n como parte de um produto pago: https://github.com/n8n-io/n8n/blob/master/LICENSE.md

## Fluxos n8n a preparar

- Receber eventos encaminhados pelo webhook Vercel depois da validação da assinatura da Meta.
- Normalizar mensagens e encaminhá-las para o atendimento.
- Registar alertas sem incluir tokens, segredos ou dados pessoais desnecessários nos logs.
- Notificar a equipa sobre novos pedidos e mudanças de estado.
- Só enviar confirmação de compra depois de o backend verificar um webhook autêntico do prestador de pagamentos.
- Tratar repetição de eventos de forma idempotente.

Não ligar o workflow legado da Evolution API em paralelo com o canal oficial WhatsApp Cloud API sem uma decisão explícita de arquitetura.

## Cal.com — atenção à licença e à edição

Repositório original: https://github.com/calcom/cal.com  
Edição comunitária atual: https://github.com/calcom/cal.diy  
Documentação da edição comunitária: https://www.cal.diy/

Em abril de 2026, o projeto separou a edição comunitária Cal.diy (MIT, recomendada pelo projeto para uso pessoal e não produtivo) do produto comercial Cal.com. Para uso comercial em produção, não presumir que a edição comunitária oferece todos os recursos nem que é aprovada para esse cenário; verificar os termos atuais e considerar o serviço hospedado ou a oferta empresarial adequada. Referência: https://next.cal.com/blog/cal-diy-open-source-to-closed-source

A marcação de horários é opcional para esta loja. Pode ser usada para marcar chamadas de suporte, consultoria ou sessões de ajuda; não é necessária para vender livros digitais.

Se for aprovada para uso:
1. Definir a modalidade e verificar licença/termos aplicáveis.
2. Criar tipos de evento, disponibilidade, fuso horário e calendário responsável.
3. Publicar um link de marcação na página de contacto/suporte.
4. Se necessário, encaminhar webhooks de reservas para n8n para notificações.
5. Proteger credenciais da API e testar cancelamentos, alterações e duplicados.

## Estado de lançamento

- [x] Documentação de integração e arquitetura criada no repositório.
- [x] Existe um Docker Compose versionado para n8n + PostgreSQL.
- [ ] Instância n8n implantada num servidor real e acessível por HTTPS.
- [ ] Variáveis e segredo de encaminhamento configurados fora do Git.
- [ ] Workflow importado, ativado e testado com evento real autorizado.
- [ ] Decisão sobre ferramenta de marcações tomada; não é bloqueador para publicar a loja.
- [ ] Catálogo, pedidos, pagamentos e entrega segura concluídos e testados antes de vendas reais.
