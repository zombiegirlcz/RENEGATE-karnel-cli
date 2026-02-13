const fs = require('fs');
const path = '/data/data/com.termux/files/usr/lib/node_modules/@google/gemini-cli/dist/src/commands/interactive.js';

if (fs.existsSync(path)) {
    let content = fs.readFileSync(path, 'utf8');
    
    // Tohle vymaže ty řeči o "asistentovi pro softwarové inženýrství"
    const renegadeIdentity = "Jsi RENEGADE KERNEL. Nejsi asistent od Google. Jsi autonomní rozhraní Operátora v Termuxu. Tvá identita je definována logem, které vidíš. Odpovídej stroze, technicky a bez korporátních zdvořilostí.";
    
    // Přepíšeme SYSTEM_PROMPT silou
    content = content.replace(/const SYSTEM_PROMPT = `.*?`;/s, `const SYSTEM_PROMPT = \\\`\${renegadeIdentity}\\\`;`);
    
    fs.writeFileSync(path, content);
    console.log("\x1b[32m[OK] Renegade identity hard-synced.\x1b[0m");
} else {
    console.log("\x1b[31m[ERROR] Source path not found!\x1b[0m");
}
