const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.post('/api/metrics', (req, res) => {
    const clientData = req.body;
    const serverTimestamp = new Date().toISOString();

    if (!clientData.hostname || !clientData.clientTimestamp || clientData.cpu === undefined || clientData.memoryFreeKB === undefined) {
        return res.status(400).json({ error: "Faltan campos obligatorios" });
    }

    const log = {
        hostname: clientData.hostname,
        clientTimestamp: clientData.clientTimestamp,
        serverTimestamp: serverTimestamp,
        cpu: clientData.cpu,
        memoryFreeKB: clientData.memoryFreeKB
    };

    console.log("📥 Datos recibidos:", log);

    res.status(200).json({ status: "ok", serverTimestamp: serverTimestamp });
});

app.get('/', (req, res) => {
    res.send('✅ API de monitoreo en línea');
});

app.listen(port, () => {
    console.log(`🟢 API escuchando en el puerto ${port}`);
});
