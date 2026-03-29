module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');

  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    return res.status(204).end();
  }

  if (req.method !== 'POST') return res.status(405).end();

  if (!req.body?.messages) return res.status(400).json({ error: 'Missing messages' });
  const messages = req.body.messages;

  const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.GROQ_API_KEY}`
    },
    body: JSON.stringify({ model: 'llama3-8b-8192', messages, max_tokens: 1000 })
  });

  if (!response.ok) {
    const err = await response.json();
    return res.status(response.status).json({ error: err });
  }

  const data = await response.json();
  res.status(200).json(data);
};
