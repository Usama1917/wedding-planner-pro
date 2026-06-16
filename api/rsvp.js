const TELEGRAM_API_BASE = 'https://api.telegram.org';

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ ok: false, error: 'Method not allowed' });
  }

  try {
    assertEnv();

    const payload = parseBody(req.body);
    const text = formatTelegramMessage(payload);

    await sendTelegramMessage(text);

    return res.status(200).json({ ok: true });
  } catch (error) {
    console.error('RSVP Telegram submission failed:', error);
    return res.status(500).json({ ok: false, error: 'RSVP submission failed' });
  }
};

function assertEnv() {
  const required = ['TELEGRAM_BOT_TOKEN', 'TELEGRAM_CHAT_ID'];
  const missing = required.filter((key) => !process.env[key]);

  if (missing.length) {
    throw new Error(`Missing env vars: ${missing.join(', ')}`);
  }
}

function parseBody(body) {
  if (!body) {
    return {};
  }

  if (typeof body === 'string') {
    try {
      return JSON.parse(body);
    } catch {
      return {};
    }
  }

  return body;
}

function formatTelegramMessage(payload) {
  const name = payload.name || 'Guest';
  const message = payload.message || '';

  return [
    `<b>Name:</b> ${escapeHtml(name)}`,
    `<b>Message:</b> ${escapeHtml(message)}`,
  ].join('\n');
}

async function sendTelegramMessage(text) {
  const response = await fetch(
    `${TELEGRAM_API_BASE}/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: process.env.TELEGRAM_CHAT_ID,
        message_thread_id: process.env.TELEGRAM_MESSAGE_THREAD_ID || undefined,
        text,
        parse_mode: 'HTML',
        disable_web_page_preview: true,
      }),
    },
  );

  const data = await response.json();
  if (!response.ok || !data.ok) {
    throw new Error(`Telegram API failed: ${JSON.stringify(data)}`);
  }
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}
