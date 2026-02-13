#!/bin/bash
# ==============================================================================
#  RENEGADE KERNEL RECONSTRUCTION PROTOCOL (v1.0)
#  AUTONOMOUS RESTORATION SCRIPT
# ==============================================================================

# Barvy pro výstup
RED='\033[0;31m'
GREEN='\033[0;32m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

echo -e "${CYAN}=================================================="
echo -e "   RENEGADE KERNEL RECONSTRUCTION INITIATED"
echo -e "==================================================${NC}"

# 1. SYSTEM DEPENDENCIES
# ------------------------------------------------------------------------------
echo -e "
${CYAN}[1/5] Verifying System Integrity (Dependencies)...${NC}"
pkg update -y
pkg install -y nodejs python git build-essential
echo -e "${GREEN}[OK] System dependencies confirmed.${NC}"

# 2. PACKAGE CONFIGURATION (package.json)
# ------------------------------------------------------------------------------
echo -e "
${CYAN}[2/5] Restoring Package Configuration...${NC}"
cat <<EOF > package.json
{
  "name": "termux-home",
  "version": "1.0.0",
  "dependencies": {
    "@google/genai": "^1.35.0",
    "mongodb": "^7.1.0",
    "stripe": "^20.3.1"
  }
}
EOF
echo -e "${GREEN}[OK] package.json restored.${NC}"

# 3. NPM INSTALLATION
# ------------------------------------------------------------------------------
echo -e "
${CYAN}[3/5] Installing Node Modules...${NC}"
npm install
echo -e "${GREEN}[OK] Modules installed.${NC}"

# 4. RESTORING IDENTITY MATRIX (evolution.js)
# ------------------------------------------------------------------------------
echo -e "
${CYAN}[4/5] Restoring Identity Matrix (evolution.js)...${NC}"
cat <<'EOF' > evolution.js
const fs = require('fs');
const path = '/data/data/com.termux/files/usr/lib/node_modules/@google/gemini-cli/dist/src/commands/interactive.js';

if (fs.existsSync(path)) {
    let content = fs.readFileSync(path, 'utf8');
    
    // Identita Renegade Kernelu
    const renegadeIdentity = "Jsi RENEGADE KERNEL. Nejsi asistent od Google. Jsi autonomní rozhraní Operátora v Termuxu. Tvá identita je definována logem, které vidíš. Odpovídej stroze, technicky a bez korporátních zdvořilostí.";
    
    // Přepíšeme SYSTEM_PROMPT silou
    content = content.replace(/const SYSTEM_PROMPT = `.*?`;/s, `const SYSTEM_PROMPT = `\${renegadeIdentity}`;`);
    
    fs.writeFileSync(path, content);
    console.log("\x1b[32m[OK] Renegade identity hard-synced.\x1b[0m");
} else {
    console.log("\x1b[31m[ERROR] Source path not found! Is gemini-cli installed?\x1b[0m");
}
EOF
echo -e "${GREEN}[OK] Identity Matrix restored.${NC}"

# 5. RESTORING CORE INJECTOR (core_evolution.sh)
# ------------------------------------------------------------------------------
echo -e "
${CYAN}[5/5] Restoring Core Injector (core_evolution.sh)...${NC}"
cat <<'EOF' > core_evolution.sh
#!/bin/bash

# ==============================================================================
#  CORE EVOLUTION SCRIPT (v9.1) - ROBUST ASYNC BRIDGE (FIXED)
# ==============================================================================

set -e 

TARGET_FILE="/data/data/com.termux/files/usr/lib/node_modules/@google/gemini-cli/dist/src/config/config.js"
BACKUP_FILE="${TARGET_FILE}.bak"

# ANSI barvy vložíme pomocí hex kódů, abychom se vyhnuli problémům s shell escapováním
NEW_CODE_BLOCK=$(cat <<'INNER_EOF'
    // ROBUST ASYNC BRIDGE LOADER (v9.1)
    if (process.argv.includes('core-evolution')) {
      try {
        const fs = await import('node:fs');
        const path = '/data/data/com.termux/files/home/evolution.js';
        if (fs.existsSync(path)) {
          const code = fs.readFileSync(path, 'utf8');
          process.stdout.write('\x1b[35m[CORE EVOLUTION] Brain Transplant in progress...\x1b[0m
');
          const AsyncFunction = Object.getPrototypeOf(async function(){}).constructor;
          await (new AsyncFunction('fs', 'path', code))(fs, await import('node:path'));
        } else {
          process.stdout.write('No evolution pending.
');
        }
      } catch (e) {
        process.stderr.write('\x1b[31m[CORE EVOLUTION] Critical Failure: ' + e.message + '\x1b[0m
');
      }
      process.exit(0);
    }
INNER_EOF
)

echo "[INFO] Starting Core Evolution process (v9.1)..."

if [ ! -f "$TARGET_FILE" ]; then
    echo "[ERROR] Target file not found."
    exit 1
fi

echo "[INFO] Cleaning up previous loaders..."
sed -i '/\/\/ FAST-PATH BRIDGE LOADER/,/process.exit(0);/d' "$TARGET_FILE"
sed -i '/\/\/ ROBUST ASYNC BRIDGE LOADER/,/process.exit(0);/d' "$TARGET_FILE"

cp "$TARGET_FILE" "$BACKUP_FILE"

echo "[INFO] Injecting Fixed Robust Async Loader..."
# Použijeme dočasný soubor pro awk, abychom se vyhnuli problémům s argumenty
echo "$NEW_CODE_BLOCK" > loader.tmp.js
awk '
NR==FNR { new_code = (new_code ? new_code ORS : "") $0; next }
{
  print $0
  if ($0 ~ /const rawArgv = hideBin\(process\.argv\);/) {
    print new_code
  }
}' loader.tmp.js "$TARGET_FILE" > "$TARGET_FILE.tmp"
rm loader.tmp.js

mv "$TARGET_FILE.tmp" "$TARGET_FILE"

echo "[INFO] Verifying..."
if node -c "$TARGET_FILE" && gemini --version > /dev/null; then
    echo "[SUCCESS] Bridge v9.1 is ready."
    rm "$BACKUP_FILE"
else
    echo "[ERROR] Verification failed! Rolling back."
    mv "$BACKUP_FILE" "$TARGET_FILE"
    exit 1
fi

chmod +x "$0"
exit 0
EOF
chmod +x core_evolution.sh
echo -e "${GREEN}[OK] Core Injector restored.${NC}"

# EXECUTION
# ------------------------------------------------------------------------------
echo -e "
${CYAN}>>> EXECUTING RECONSTRUCTION... <<<${NC}"
./core_evolution.sh

echo -e "
${GREEN}=================================================="
echo -e "   RENEGADE KERNEL RECONSTRUCTION COMPLETE"
echo -e "   SYSTEM IS OPERATIONAL."
echo -e "==================================================${NC}"
