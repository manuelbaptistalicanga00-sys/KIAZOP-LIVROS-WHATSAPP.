module.exports = function health(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Report configuration presence only. Never return secret values.
  const configured = {
    verifyToken: Boolean(process.env.WHATSAPP_VERIFY_TOKEN),
    appSecret: Boolean(process.env.WHATSAPP_APP_SECRET),
    accessToken: Boolean(process.env.WHATSAPP_ACCESS_TOKEN),
    phoneNumberId: Boolean(process.env.WHATSAPP_PHONE_NUMBER_ID),
    apiVersion: Boolean(process.env.WHATSAPP_API_VERSION || 'v22.0'),
    deduplicationStore: Boolean(process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN)
  };
  const required = ['verifyToken', 'appSecret', 'accessToken', 'phoneNumberId'];
  const ready = required.every((key) => configured[key]);

  return res.status(200).json({
    service: 'kiazop-whatsapp-cloud-api',
    status: ready ? 'configured' : 'needs_configuration',
    configured,
    note: 'This endpoint checks environment-variable presence only; it does not contact Meta or send a message.'
  });
};
