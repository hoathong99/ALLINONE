export default () => ({
    n8nUrl: parseInt(process.env.VITE_N8N_URL!) || 'http://n8n:5678',
    n8nApiKey: process.env.N8N_API_KEY!,
  });
  