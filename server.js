const express = require('express');
const path = require('path');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const app = express();
const port = 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'src')));

// Fetch available models from Google
app.post('/api/models', async (req, res) => {
    const { apiKey } = req.body;
    if (!apiKey) return res.status(400).json({ error: "Missing Key" });

    try {
        const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
        const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;
        const response = await fetch(url);
        const data = await response.json();
        
        if (data.models) {
            // Filtrujeme pouze modely, které umí generovat obsah
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

// Dynamická instance AI
const getModel = (apiKey, modelName) => {
    const genAI = new GoogleGenerativeAI(apiKey);
    return genAI.getGenerativeModel({ 
        model: modelName || "gemini-1.5-flash",
        systemInstruction: "Jsi RENEGADE KERNEL. Nejsi asistent od Google. Jsi autonomní rozhraní Operátora v Termuxu. Odpovídej stroze a technicky. Tvým cílem je pomáhat operátorovi s ovládáním terminálu a kódem."
    });
};

app.post('/api/config', (req, res) => {
    // Pro potvrzení konfigurace
    res.json({ status: "ok" });
});

app.post('/api/chat', async (req, res) => {
    try {
        const { message, apiKey, model } = req.body;
        
        if (!apiKey) {
            return res.status(400).json({ error: "Missing API Key" });
        }

        const aiModel = getModel(apiKey, model);
        const result = await aiModel.generateContent(message);
        const response = await result.response;
        
        res.json({ reply: response.text() });
    } catch (error) {
        console.error("AI Error:", error.message);
        res.status(500).json({ error: error.message });
    }
});

app.listen(port, '0.0.0.0', () => {
    console.log(`\x1b[36m[RENEGADE_KERNEL] Uplink active on port ${port}\x1b[0m`);
});
