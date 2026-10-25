# Checklist antes de publicar

## Alojamento
- [ ] Confirmar se os serviços n8n e Evolution API estão ativos no EasyPanel.
- [ ] Domínios públicos configurados com HTTPS.
- [ ] Volumes persistentes para n8n e PostgreSQL.
- [ ] Backups testados e política de atualização definida.

## Segredos
- [ ] Usar passwords e chaves aleatórias fortes.
- [ ] Guardar segredos apenas nas variáveis de ambiente/secret manager.
- [ ] Confirmar que nenhum `.env`, token, QR code ou credencial foi enviado para o GitHub.

## WhatsApp
- [ ] Instância Evolution API ligada ao número correto.
- [ ] Webhook público do n8n configurado para `MESSAGES_UPSERT`.
- [ ] Teste de mensagem recebida concluído.
- [ ] Teste de resposta enviada concluído.
- [ ] Mensagens do próprio bot são ignoradas para evitar loops.

## Catálogo e pagamentos
- [ ] Confirmar direitos de venda/distribuição dos e-books.
- [ ] Inserir títulos, preços, descrições, idiomas e ficheiros reais.
- [ ] Definir preços AOA e BRL de forma explícita; não assumir conversão automática.
- [ ] Configurar checkout compatível com o país/moeda.
- [ ] Confirmar pagamento por fonte confiável antes de entregar ficheiros.
- [ ] Criar fluxo de atendimento humano e reembolso.

## Produção
- [ ] Testar casos de erro e mensagens desconhecidas.
- [ ] Testar com números autorizados antes de divulgar.
- [ ] Ativar o workflow apenas após os testes.
- [ ] Não prometer rendimentos ou lucros com trading.
