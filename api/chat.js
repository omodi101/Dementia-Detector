module.exports = async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  let body = req.body;
  if (typeof body === 'string') body = JSON.parse(body);

  const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.GROQ_API_KEY}`
    },
    body: JSON.stringify({
      model: 'llama3-8b-8192',
      messages: body.messages,
      max_tokens: 1000
    })
  });

  const text = await response.text();
  console.log('Groq response:', text);
  
  try {
    const data = JSON.parse(text);
    res.status(200).json(data);
  } catch(e) {
    res.status(500).json({ error: text });
  }
}
