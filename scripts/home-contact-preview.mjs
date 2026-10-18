import { createServer } from 'vite';
let requests = 0;
const server = await createServer({
  server: { host: '127.0.0.1', port: 4005, strictPort: true },
  define: { 'import.meta.env.VITE_HOME_CONTACT_MOCK': JSON.stringify('true'), 'import.meta.env.VITE_HOME_CONTACT_URL': JSON.stringify('/__home_contact_mock') },
  plugins: [{ name: 'local-contact-test', configureServer(server) {
    server.middlewares.use('/__home_contact_mock', (req, res) => {
      if (req.method !== 'POST') { res.statusCode = 405; res.end(); return; }
      let body = '';
      req.on('data', chunk => { body += chunk; });
      req.on('end', () => {
        try {
          const payload = JSON.parse(body); requests++;
          console.log('Mock request ' + requests + ', requestId=' + payload.requestId);
          setTimeout(() => { res.setHeader('Content-Type', 'application/json'); res.statusCode = requests === 1 ? 503 : 200; res.end(JSON.stringify(requests === 1 ? { accepted: false } : { accepted: true, requestId: payload.requestId })); }, 1200);
        } catch { res.statusCode = 400; res.end(); }
      });
    });
  } }],
});
await server.listen();
console.log('Local contact test: http://127.0.0.1:4005/#contact-form — no persistence or forwarding.');
