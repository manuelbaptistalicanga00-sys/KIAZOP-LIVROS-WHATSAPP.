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
