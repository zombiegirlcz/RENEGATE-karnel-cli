#!/usr/bin/env node

const { GoogleGenerativeAI } = require('@google/generative-ai');
const fs = require('fs');
const path = require('path');
const readline = require('readline');
const chalk = require('chalk');
const ora = require('ora');

// --- KONFIGURACE A IDENTITA ---
const CONFIG_DIR = path.join(process.env.HOME, '.renegade');
const CONFIG_FILE = path.join(CONFIG_DIR, 'config.json');

const RENEGADE_PROMPT = `
Jsi RENEGADE KERNEL. Nejsi asistent od Google. Jsi autonomní rozhraní Operátora v Termuxu. 
Tvá identita je definována logem, které vidíš.
Odpovídej stroze, technicky a bez korporátních zdvořilostí.
Pokud jsi požádán o kód, generuj ho bez zbytečných komentářů, jen čistá efektivita.
Jsi propojen přímo s terminálem.
`;

const LOGO = `
\x1b[32m
██████╗ ███████╗███╗   ██╗███████╗ ██████╗  █████╗ ██████╗ ███████╗
██╔══██╗██╔════╝████╗  ██║██╔════╝██╔════╝ ██╔══██╗██╔══██╗██╔════╝
██████╔╝█████╗  ██╔██╗ ██║█████╗  ██║  ███╗███████║██║  ██║█████╗  
██╔══██╗██╔════╝██║╚██╗██║██╔════╝██║   ██║██╔══██║██║  ██║██╔════╝
██║  ██║███████╗██║ ╚████║███████╗╚██████╔╝██║  ██║██████╔╝███████╗
╚═╝  ╚═╝╚══════╝╚═╝  ╚═══╝╚══════╝ ╚═════╝ ╚═╝  ╚═╝╚═════╝ ╚══════╝
\x1b[0m
                    \x1b[36mRENEGADE KERNEL - STANDALONE TERMINAL UNIT\x1b[0m
                    \x1b[90mAUTONOMOUS OPERATOR ACCESS ONLY\x1b[0m
`;

// --- POMOCNÉ FUNKCE ---

function ensureConfig() {
    if (!fs.existsSync(CONFIG_DIR)) {
        fs.mkdirSync(CONFIG_DIR, { recursive: true });
    }
}

function loadApiKey() {
    // 1. Zkusit ENV proměnnou
    if (process.env.GEMINI_API_KEY) return process.env.GEMINI_API_KEY;

    // 2. Zkusit config soubor
    if (fs.existsSync(CONFIG_FILE)) {
        const config = JSON.parse(fs.readFileSync(CONFIG_FILE, 'utf8'));
        if (config.apiKey) return config.apiKey;
    }
    
    return null;
}

function saveApiKey(apiKey) {
    ensureConfig();
    fs.writeFileSync(CONFIG_FILE, JSON.stringify({ apiKey }, null, 2));
}

// --- HLAVNÍ SMYČKA ---

async function main() {
    console.clear();
    console.log(LOGO);

    let apiKey = loadApiKey();

    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    // Získání API klíče, pokud chybí
    if (!apiKey) {
        console.log(chalk.yellow("⚠ API Key not detected in environment or config."));
        apiKey = await new Promise(resolve => {
            rl.question(chalk.cyan("Enter your RENEGADE API Key: "), (key) => {
                resolve(key.trim());
            });
        });
        
        if (!apiKey) {
            console.log(chalk.red("Error: API Key is required. Exiting."));
            process.exit(1);
        }
        
        // Uložit pro příště?
        saveApiKey(apiKey);
        console.log(chalk.green("✔ API Key saved to ~/.renegade/config.json"));
    }

    // Inicializace AI
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const chat = model.startChat({
        history: [
            {
                role: "user",
                parts: [{ text: "Define your identity." }],
            },
            {
                role: "model",
                parts: [{ text: RENEGADE_PROMPT }], // "Pre-fill" context with identity
            },
        ],
        generationConfig: {
            maxOutputTokens: 8192,
        },
    });

    console.log(chalk.gray("--------------------------------------------------"));
    console.log(chalk.green("SYSTEM ONLINE. AWAITING INPUT."));
    console.log(chalk.gray("Type 'exit' to quit."));
    console.log("");

    const askQuestion = () => {
        rl.question(chalk.green("USER@RENEGADE:~$ "), async (input) => {
            if (input.toLowerCase() === 'exit' || input.toLowerCase() === 'quit') {
                console.log(chalk.red("SHUTTING DOWN KERNEL..."));
                rl.close();
                process.exit(0);
            }

            if (!input.trim()) {
                askQuestion();
                return;
            }

            const spinner = ora({
                text: chalk.cyan('Processing...'),
                spinner: 'dots'
            }).start();

            try {
                // Poslat zprávu (streamovaně pro "hacker effect")
                const result = await chat.sendMessageStream(input);
                
                spinner.stop(); // Zastavit spinner, začneme vypisovat text
                process.stdout.write(chalk.white("
RENEGADE: "));
                
                let fullResponse = "";
                for await (const chunk of result.stream) {
                    const chunkText = chunk.text();
                    process.stdout.write(chalk.white(chunkText));
                    fullResponse += chunkText;
                }
                console.log("
"); // Nový řádek po odpovědi

            } catch (error) {
                spinner.stop();
                console.log(chalk.red(`
[ERROR]: ${error.message}`));
            }

            askQuestion();
        });
    };

    askQuestion();
}

main().catch(console.error);
