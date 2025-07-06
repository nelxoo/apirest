const express = require('express');
const { TableClient, AzureNamedKeyCredential } = require('@azure/data-tables');
const app = express();
const port = process.env.PORT || 3000;

// Configuración de Azure Table Storage
const account = "clustervmstorageapi";
const accountKey = "gaz3Ju4561X1T34OnB9XMEC/l1zX/rQmuE6NgxYMLXpsSYPocx1kTK+yPbWOIAB/kjQyq5iGsH2h+ASt2FvAWw==";
const tableName = "metrics";

const credential = new AzureNamedKeyCredential(account, accountKey);
const client = new TableClient(`https://${account}.table.core.windows.net`, tableName, credential);

app.use(express.json());

app.get('/', (req, res) => {
    res.send('✅ API de monitoreo en línea (con almacenamiento)');
});

app.post('/api/metrics', async (req, res) => {
    const clientData = req.body;
    const serverTimestamp = new Date().toISOString();

    if (!clientData.hostname || !clientData.clientTimestamp || clientData.cpu === undefined || clientData.memoryFreeKB === undefined) {
        return res.status(400).json({ error: "Faltan campos obligatorios" });
    }

    const entity = {
        partitionKey: "metrics",
        rowKey: `${clientData.hostname}-${Date.now()}`,
        hostname: clientData.hostname,
        cpu: clientData.cpu,
        memoryFreeKB: clientData.memoryFreeKB,
        clientTimestamp: clientData.clientTimestamp,
        serverTimestamp: serverTimestamp
    };

    try {
        await client.createEntity(entity);
        console.log("✅ Guardado en Storage:", entity);
        res.status(200).json({ status: "ok", serverTimestamp: serverTimestamp });
    } catch (err) {
        console.error("❌ Error al guardar en Storage:", err.message);
        res.status(500).json({ error: "Error al guardar en almacenamiento" });
    }
});

app.listen(port, () => {
    console.log(`🟢 API escuchando en el puerto ${port}`);
});
