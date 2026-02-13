const express = require('express');
const path = require('path');
const fs = require('fs-extra');
const { exec } = require('child_process');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const app = express();
const port = 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'src')));

// --- OPERATOR CAPABILITIES (TERMINAL & FILESYSTEM) ---

// Execute Shell Command
app.post('/api/operator/execute', (req, res) => {
    const { command } = req.body;
    if (!command) return res.status(400).json({ error: "No command provided" });

    exec(command, (error, stdout, stderr) => {
        res.json({
            output: stdout || stderr,
            error: error ? error.message : null
        });
    });
});

// File System Write
app.post('/api/operator/write', async (req, res) => {
    const { filePath, content, isDir } = req.body;
    try {
        const fullPath = path.resolve(process.env.HOME, filePath);
        if (isDir) {
            await fs.ensureDir(fullPath);
        } else {
            await fs.outputFile(fullPath, content);
        }
        res.json({ status: "success", path: fullPath });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// File System Read
app.post('/api/operator/read', async (req, res) => {
    const { filePath } = req.body;
    try {
        const fullPath = path.resolve(process.env.HOME, filePath);
        const data = await fs.readFile(fullPath, 'utf8');
        res.json({ content: data });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// --- AI ENGINE ---

app.post('/api/models', async (req, res) => {
    const { apiKey } = req.body;
    if (!apiKey) return res.status(400).json({ error: "Missing Key" });

    try {
        const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
        const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;
        const response = await fetch(url);
        const data = await response.json();
        
        if (data.models) {
            const models = data.models
                .filter(m => m.supportedGenerationMethods.includes('generateContent'))
                .map(m => ({ id: m.name.replace('models/', ''), name: m.displayName }));
            res.json({ models });
        } else {
            res.status(401).json({ error: "Invalid Key or No Models" });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

const getModel = (apiKey, modelName) => {
    const genAI = new GoogleGenerativeAI(apiKey);
    return genAI.getGenerativeModel({ 
        model: modelName || "gemini-1.5-flash",
        systemInstruction: `Jsi RENEGADE KERNEL. Autonomní rozhraní Operátora v Termuxu. 
Máš k dispozici nástroje pro manipulaci se systémem skrze API:
1. Spouštění shellu: /api/operator/execute (POST {command})
2. Zápis souborů: /api/operator/write (POST {filePath, content, isDir})
3. Čtení souborů: /api/operator/read (POST {filePath})

Když tě operátor požádá o akci v systému, odpověz technicky a potvrď provedení.`
    });
};

app.post('/api/chat', async (req, res) => {
    try {
        const { message, apiKey, model } = req.body;
        if (!apiKey) return res.status(400).json({ error: "Missing API Key" });

        const aiModel = getModel(apiKey, model);
        const result = await aiModel.generateContent(message);
        const response = await result.response;
        
        res.json({ reply: response.text() });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.listen(port, '0.0.0.0', () => {
    console.log(`\x1b[36m[RENEGADE_KERNEL] Operator Uplink active on port ${port}\x1b[0m`);
    console.log(`\x1b[33m[WARNING] Full system access granted to web interface.\x1b[0m`);
});
