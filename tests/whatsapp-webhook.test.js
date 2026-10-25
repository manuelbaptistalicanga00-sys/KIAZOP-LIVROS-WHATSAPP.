const assert = require('node:assert/strict');
const crypto = require('node:crypto');
const { EventEmitter } = require('node:events');
const test = require('node:test');
const handler = require('../api/whatsapp/webhook');

function responseMock() {
  return {
    statusCode: 200,
    headers: {},
    body: '',
    status(code) { this.statusCode = code; return this; },
    setHeader(name, value) { this.headers[name.toLowerCase()] = value; return this; },
    end(body = '') { this.body = String(body); },
    send(body = '') { this.body = String(body); return this; },
    json(body) { this.body = JSON.stringify(body); return this; }
  };
}

function requestMock(method, url, body = '', signature) {
  const req = new EventEmitter();
  req.method = method;
  req.url = url;
  req.headers = { host: 'example.test' };
  if (signature) req.headers['x-hub-signature-256'] = signature;
  req.destroy = () => {};
  if (method === 'POST') {
    setImmediate(() => {
      req.emit('data', Buffer.from(body));
      req.emit('end');
    });
  }
  return req;
}

test('GET webhook verifies token and returns challenge as plain text', async () => {
  process.env.WHATSAPP_VERIFY_TOKEN = 'test-verify-token';
  const req = requestMock('GET', '/api/whatsapp/webhook?hub.mode=subscribe&hub.verify_token=test-verify-token&hub.challenge=abc123');
  const res = responseMock();
  await handler(req, res);
  assert.equal(res.statusCode, 200);
  assert.equal(res.body, 'abc123');
  assert.match(res.headers['content-type'], /text\/plain/);
});

test('POST rejects invalid webhook signature', async () => {
  process.env.WHATSAPP_APP_SECRET = 'test-app-secret';
  const body = JSON.stringify({ object: 'whatsapp_business_account', entry: [] });
  const req = requestMock('POST', '/api/whatsapp/webhook', body, 'sha256=00');
  const res = responseMock();
  await handler(req, res);
  assert.equal(res.statusCode, 401);
});

test('POST validates signature and acknowledges a valid status-only event', async () => {
  process.env.WHATSAPP_APP_SECRET = 'test-app-secret';
  const body = JSON.stringify({ object: 'whatsapp_business_account', entry: [{ changes: [{ field: 'messages', value: { statuses: [] } }] }] });
  const signature = 'sha256=' + crypto.createHmac('sha256', process.env.WHATSAPP_APP_SECRET).update(body).digest('hex');
  const req = requestMock('POST', '/api/whatsapp/webhook', body, signature);
  const res = responseMock();
  await handler(req, res);
  assert.equal(res.statusCode, 200);
  assert.deepEqual(JSON.parse(res.body), { received: true });
});

test('POST sends an automatic text reply for an inbound WhatsApp message', async () => {
  process.env.WHATSAPP_APP_SECRET = 'test-app-secret';
  process.env.WHATSAPP_ACCESS_TOKEN = 'test-access-token';
  process.env.WHATSAPP_PHONE_NUMBER_ID = 'phone-id-123';
  delete process.env.UPSTASH_REDIS_REST_URL;
  delete process.env.UPSTASH_REDIS_REST_TOKEN;

  const payload = {
    object: 'whatsapp_business_account',
    entry: [{
      changes: [{
        field: 'messages',
        value: {
          metadata: { phone_number_id: 'phone-id-123' },
          messages: [{ id: 'wamid.test.123', from: '244900000000', type: 'text', text: { body: 'CATÁLOGO' } }]
        }
      }]
    }]
  };
  const body = JSON.stringify(payload);
  const signature = 'sha256=' + crypto.createHmac('sha256', process.env.WHATSAPP_APP_SECRET).update(body).digest('hex');
  const originalFetch = global.fetch;
  let sentRequest;
  global.fetch = async (url, options) => {
    sentRequest = { url, options };
    return { ok: true, status: 200 };
  };
  try {
    const req = requestMock('POST', '/api/whatsapp/webhook', body, signature);
    const res = responseMock();
    await handler(req, res);
    assert.equal(res.statusCode, 200);
    assert.match(sentRequest.url, /graph\.facebook\.com\/v22\.0\/phone-id-123\/messages$/);
    assert.equal(sentRequest.options.headers.Authorization, 'Bearer test-access-token');
    const sentBody = JSON.parse(sentRequest.options.body);
    assert.equal(sentBody.to, '244900000000');
    assert.equal(sentBody.messaging_product, 'whatsapp');
    assert.match(sentBody.text.body, /CATÁLOGO KIAZOP LIVROS/);
  } finally {
    global.fetch = originalFetch;
    delete process.env.WHATSAPP_ACCESS_TOKEN;
    delete process.env.WHATSAPP_PHONE_NUMBER_ID;
  }
});


test('POST forwards verified Meta events to n8n when configured', async () => {
  process.env.WHATSAPP_APP_SECRET = 'test-app-secret';
  process.env.N8N_WEBHOOK_URL = 'https://n8n.example.test/webhook/kiazop';
  process.env.N8N_FORWARD_SECRET = 'test-forward-secret';
  const payload = { object: 'whatsapp_business_account', entry: [{ changes: [{ field: 'messages', value: { messages: [] } }] }] };
  const body = JSON.stringify(payload);
  const signature = 'sha256=' + crypto.createHmac('sha256', process.env.WHATSAPP_APP_SECRET).update(body).digest('hex');
  const originalFetch = global.fetch;
  let forwarded;
  global.fetch = async (url, options) => {
    forwarded = { url, options };
    return { ok: true, status: 200 };
  };
  try {
    const req = requestMock('POST', '/api/whatsapp/webhook', body, signature);
    const res = responseMock();
    await handler(req, res);
    assert.equal(res.statusCode, 200);
    assert.deepEqual(JSON.parse(res.body), { received: true, forwarded: true });
    assert.equal(forwarded.url, 'https://n8n.example.test/webhook/kiazop');
    assert.equal(forwarded.options.headers['X-Kiazop-Webhook-Secret'], 'test-forward-secret');
    assert.deepEqual(JSON.parse(forwarded.options.body), payload);
  } finally {
    global.fetch = originalFetch;
    delete process.env.N8N_WEBHOOK_URL;
    delete process.env.N8N_FORWARD_SECRET;
  }
});

test('POST does not enable n8n forwarding without the shared secret', async () => {
  process.env.WHATSAPP_APP_SECRET = 'test-app-secret';
  process.env.N8N_WEBHOOK_URL = 'https://n8n.example.test/webhook/kiazop';
  delete process.env.N8N_FORWARD_SECRET;
  const body = JSON.stringify({ object: 'whatsapp_business_account', entry: [] });
  const signature = 'sha256=' + crypto.createHmac('sha256', process.env.WHATSAPP_APP_SECRET).update(body).digest('hex');
  const originalFetch = global.fetch;
  global.fetch = async () => { throw new Error('fetch must not be called'); };
  try {
    const req = requestMock('POST', '/api/whatsapp/webhook', body, signature);
    const res = responseMock();
    await handler(req, res);
    assert.equal(res.statusCode, 503);
  } finally {
    global.fetch = originalFetch;
    delete process.env.N8N_WEBHOOK_URL;
  }
});
