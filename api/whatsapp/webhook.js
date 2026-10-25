const crypto = require('node:crypto');

const API_VERSION = process.env.WHATSAPP_API_VERSION || 'v22.0';
const MAX_BODY_BYTES = 1_000_000;

function json(res, status, body) {
  res.status(status).setHeader('Content-Type', 'application/json; charset=utf-8');
  res.end(JSON.stringify(body));
}

function readRawBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    let size = 0;
    req.on('data', (chunk) => {
      size += chunk.length;
      if (size > MAX_BODY_BYTES) {
        reject(Object.assign(new Error('Payload too large'), { statusCode: 413 }));
        req.destroy();
        return;
      }
      chunks.push(chunk);
    });
    req.on('end', () => resolve(Buffer.concat(chunks)));
    req.on('error', reject);
  });
}

function safeEqualHex(expectedHex, suppliedHex) {
  if (!expectedHex || !suppliedHex) return false;
  const expected = Buffer.from(expectedHex, 'hex');
  const supplied = Buffer.from(suppliedHex, 'hex');
  return expected.length === supplied.length
    && expected.length > 0
    && crypto.timingSafeEqual(expected, supplied);
}

function verifySignature(rawBody, signature, appSecret) {
  if (!signature || !appSecret || !signature.startsWith('sha256=')) return false;
  const expected = crypto.createHmac('sha256', appSecret).update(rawBody).digest('hex');
  return safeEqualHex(expected, signature.slice(7));
}

function buildReply(text) {
  const message = String(text || '').trim().toLocaleLowerCase('pt-PT');
  if (!message) return null;

  if (message.includes('catálogo') || message.includes('catalogo') || message === 'livro' || message.includes('livros')) {
    return [
      '📚 *CATÁLOGO KIAZOP LIVROS*',
      '',
      '1. E-books de trading',
      '2. Finanças e investimentos',
      '3. Desenvolvimento pessoal',
      '4. Outros livros digitais',
      '',
      'Responde com 1, 2, 3 ou 4 e indica a moeda pretendida: AOA (kwanza) ou BRL (real).',
      'Os títulos, preços e disponibilidade serão confirmados pelo atendimento antes do pagamento.'
    ].join('\n');
  }
  if (message.includes('moeda') || message.includes('aoa') || message.includes('brl') || message.includes('kwanza') || message.includes('real')) {
    return 'Podes consultar preços em AOA (kwanza angolano) ou BRL (real brasileiro). Diz-me qual e-book procuras e a moeda pretendida. O valor final será confirmado antes do pagamento.';
  }
  const categories = {
    '1': 'E-books de trading',
    '2': 'Finanças e investimentos',
    '3': 'Desenvolvimento pessoal',
    '4': 'Outros livros digitais'
  };
  if (categories[message]) {
    return 'Selecionaste: ' + categories[message] + '.\nIndica o título que procuras e a moeda (AOA ou BRL). Escreve CATÁLOGO para voltar às categorias.';
  }
  if (['atendimento', 'humano', 'ajuda', 'atendente'].some((word) => message.includes(word))) {
    return 'Claro! Para atendimento humano, indica o título do livro e a moeda pretendida (AOA ou BRL). Este canal automático ainda não transfere a conversa para um agente.';
  }
  if (['paguei', 'pagamento', 'comprovativo'].some((word) => message.includes(word))) {
    return 'Obrigado! A entrega só será confirmada depois de verificarmos o pagamento no sistema do vendedor. Envia o número do pedido ao atendimento. Não envies dados de cartão nem palavras-passe.';
  }
  return 'Olá! 👋 Bem-vindo à KIAZOP Livros.\n\nEscreve CATÁLOGO para ver as categorias, MOEDA para informações sobre AOA/BRL ou ATENDIMENTO para instruções de apoio.';
}

async function redisCommand(command) {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return null;
  const response = await fetch(url.replace(/\/$/, ''), {
    method: 'POST',
    headers: { Authorization: 'Bearer ' + token, 'Content-Type': 'application/json' },
    body: JSON.stringify(command)
  });
  if (!response.ok) throw new Error('Deduplication store request failed');
  return response.json();
}

function hasDeduplicationStore() {
  return Boolean(process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN);
}

async function claimMessageOnce(messageId) {
  if (!hasDeduplicationStore()) return true; // Optional; enable Upstash before production.
  const result = await redisCommand(['SET', 'kiazop:whatsapp:message:' + messageId, 'processing', 'EX', '300', 'NX']);
  return result.result === 'OK';
}

async function markMessageSent(messageId) {
  if (!hasDeduplicationStore()) return;
  // A transient store failure here must not make Meta resend a message already sent.
  try {
    await redisCommand(['SET', 'kiazop:whatsapp:message:' + messageId, 'sent', 'EX', '86400']);
  } catch (error) {
    console.error('[whatsapp-webhook] Could not persist deduplication status:', error.message);
  }
}

async function releaseMessageClaim(messageId) {
  if (!hasDeduplicationStore()) return;
  try {
    await redisCommand(['DEL', 'kiazop:whatsapp:message:' + messageId]);
  } catch (error) {
    console.error('[whatsapp-webhook] Could not release message claim:', error.message);
  }
}

async function sendWhatsAppText(to, body) {
  const token = process.env.WHATSAPP_ACCESS_TOKEN;
  const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;
  if (!token || !phoneNumberId) throw new Error('WhatsApp Cloud API is not configured');
  const response = await fetch('https://graph.facebook.com/' + API_VERSION + '/' + encodeURIComponent(phoneNumberId) + '/messages', {
    method: 'POST',
    headers: {
      Authorization: 'Bearer ' + token,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      messaging_product: 'whatsapp',
      recipient_type: 'individual',
      to,
      type: 'text',
      text: { preview_url: false, body }
    })
  });
  if (!response.ok) {
    // Do not log the access token or the full customer payload.
    const error = new Error('WhatsApp Cloud API returned HTTP ' + response.status);
    error.statusCode = response.status;
    throw error;
  }
}

async function processWebhook(payload) {
  for (const entry of payload.entry || []) {
    for (const change of entry.changes || []) {
      if (change.field !== 'messages') continue;
      const value = change.value || {};
      const phoneNumberId = value.metadata && value.metadata.phone_number_id;
      if (process.env.WHATSAPP_PHONE_NUMBER_ID && phoneNumberId !== process.env.WHATSAPP_PHONE_NUMBER_ID) continue;

      for (const message of value.messages || []) {
        // Only answer inbound text messages; ignore statuses and other message types.
        if (!message || message.type !== 'text' || !message.from || !message.id || !message.text) continue;
        const reply = buildReply(message.text.body);
        if (!reply) continue;
        const firstDelivery = await claimMessageOnce(message.id);
        if (!firstDelivery) continue;
        try {
          await sendWhatsAppText(message.from, reply);
          await markMessageSent(message.id);
        } catch (error) {
          await releaseMessageClaim(message.id);
          throw error;
        }
      }
    }
  }
}

module.exports = async function whatsappWebhook(req, res) {
  if (req.method === 'GET') {
    const url = new URL(req.url, 'https://' + (req.headers.host || 'localhost'));
    const mode = url.searchParams.get('hub.mode');
    const token = url.searchParams.get('hub.verify_token');
    const challenge = url.searchParams.get('hub.challenge');
    if (!process.env.WHATSAPP_VERIFY_TOKEN) return res.status(503).send('Webhook verification is not configured');
    if (mode === 'subscribe' && token === process.env.WHATSAPP_VERIFY_TOKEN && challenge) {
      res.status(200).setHeader('Content-Type', 'text/plain; charset=utf-8');
      return res.end(challenge);
    }
    return res.status(403).send('Webhook verification failed');
  }

  if (req.method !== 'POST') {
    res.setHeader('Allow', 'GET, POST');
    return json(res, 405, { error: 'Method not allowed' });
  }

  const appSecret = process.env.WHATSAPP_APP_SECRET;
  if (!appSecret) return json(res, 503, { error: 'Webhook signature verification is not configured' });

  let rawBody;
  try {
    rawBody = await readRawBody(req);
  } catch (error) {
    return json(res, error.statusCode || 400, { error: 'Could not read webhook payload' });
  }

  if (!verifySignature(rawBody, req.headers['x-hub-signature-256'], appSecret)) {
    return json(res, 401, { error: 'Invalid webhook signature' });
  }

  let payload;
  try {
    payload = JSON.parse(rawBody.toString('utf8'));
  } catch {
    return json(res, 400, { error: 'Invalid JSON payload' });
  }

  if (payload.object !== 'whatsapp_business_account') {
    return json(res, 404, { error: 'Unsupported webhook object' });
  }

  try {
    const n8nWebhookUrl = process.env.N8N_WEBHOOK_URL;
    if (n8nWebhookUrl) {
      const sharedSecret = process.env.N8N_FORWARD_SECRET;
      if (!sharedSecret) {
        return json(res, 503, { error: 'n8n forwarding is enabled but its shared secret is not configured' });
      }
      let parsedWebhookUrl;
      try {
        parsedWebhookUrl = new URL(n8nWebhookUrl);
      } catch {
        return json(res, 503, { error: 'n8n webhook URL is invalid' });
      }
      if (parsedWebhookUrl.protocol !== 'https:') {
        return json(res, 503, { error: 'n8n webhook URL must use HTTPS' });
      }
      const forwardResponse = await fetch(parsedWebhookUrl.toString(), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Kiazop-Webhook-Secret': sharedSecret
        },
        body: JSON.stringify(payload)
      });
      if (!forwardResponse.ok) {
        throw new Error('n8n webhook returned HTTP ' + forwardResponse.status);
      }
      return json(res, 200, { received: true, forwarded: true });
    }

    // Direct Cloud API mode is used only when N8N_WEBHOOK_URL is not configured.
    await processWebhook(payload);
    return json(res, 200, { received: true, forwarded: false });
  } catch (error) {
    // Log only a generic error; never log message contents, phone numbers, or secrets.
    console.error('[whatsapp-webhook] Processing failed:', error.message);
    return json(res, 500, { error: 'Webhook processing failed; Meta may retry delivery' });
  }
};

module.exports.config = { api: { bodyParser: false } };
