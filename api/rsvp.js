const SHEET_ID = process.env.GOOGLE_SHEET_ID;
const SHEET_NAME = process.env.GOOGLE_SHEET_NAME || 'RSVP';
const HEADERS = [
  'Submitted At',
  'Name',
  'Message',
  'Language',
  'Page URL',
  'User Agent',
];

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ ok: false, error: 'Method not allowed' });
  }

  try {
    assertEnv();

    const payload = parseBody(req.body);
    const accessToken = await getAccessToken();

    await ensureSheet(accessToken);
    await ensureHeaders(accessToken);
    await appendRsvp(accessToken, payload);

    return res.status(200).json({ ok: true });
  } catch (error) {
    console.error('RSVP submission failed:', error);
    return res.status(500).json({ ok: false, error: 'RSVP submission failed' });
  }
};

function assertEnv() {
  const required = [
    'GOOGLE_CLIENT_ID',
    'GOOGLE_CLIENT_SECRET',
    'GOOGLE_REFRESH_TOKEN',
    'GOOGLE_SHEET_ID',
  ];

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

async function getAccessToken() {
  const response = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      client_id: process.env.GOOGLE_CLIENT_ID,
      client_secret: process.env.GOOGLE_CLIENT_SECRET,
      refresh_token: process.env.GOOGLE_REFRESH_TOKEN,
      grant_type: 'refresh_token',
    }),
  });

  const data = await response.json();
  if (!response.ok || !data.access_token) {
    throw new Error(`Google OAuth failed: ${JSON.stringify(data)}`);
  }

  return data.access_token;
}

async function ensureSheet(accessToken) {
  const metadata = await googleRequest(
    accessToken,
    `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}?fields=sheets.properties.title`,
  );

  const exists = metadata.sheets?.some((sheet) => sheet.properties?.title === SHEET_NAME);
  if (exists) {
    return;
  }

  await googleRequest(
    accessToken,
    `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}:batchUpdate`,
    {
      method: 'POST',
      body: JSON.stringify({
        requests: [
          {
            addSheet: {
              properties: {
                title: SHEET_NAME,
              },
            },
          },
        ],
      }),
    },
  );
}

async function ensureHeaders(accessToken) {
  const range = encodeURIComponent(`${SHEET_NAME}!A1:F1`);
  const data = await googleRequest(
    accessToken,
    `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${range}`,
  );

  if (data.values?.[0]?.some(Boolean)) {
    return;
  }

  await googleRequest(
    accessToken,
    `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${range}?valueInputOption=RAW`,
    {
      method: 'PUT',
      body: JSON.stringify({
        values: [HEADERS],
      }),
    },
  );
}

async function appendRsvp(accessToken, payload) {
  const range = encodeURIComponent(`${SHEET_NAME}!A:F`);
  await googleRequest(
    accessToken,
    `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${range}:append?valueInputOption=USER_ENTERED&insertDataOption=INSERT_ROWS`,
    {
      method: 'POST',
      body: JSON.stringify({
        values: [
          [
            payload.submittedAt || new Date().toISOString(),
            payload.name || '',
            payload.message || '',
            payload.language || '',
            payload.pageUrl || '',
            payload.userAgent || '',
          ],
        ],
      }),
    },
  );
}

async function googleRequest(accessToken, url, options = {}) {
  const response = await fetch(url, {
    ...options,
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  const text = await response.text();
  const data = text ? JSON.parse(text) : {};

  if (!response.ok) {
    throw new Error(`Google API failed: ${JSON.stringify(data)}`);
  }

  return data;
}
