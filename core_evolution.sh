#!/bin/bash

# ==============================================================================
#  CORE EVOLUTION SCRIPT (v9.1) - ROBUST ASYNC BRIDGE (FIXED)
# ==============================================================================

set -e 

TARGET_FILE="/data/data/com.termux/files/usr/lib/node_modules/@google/gemini-cli/dist/src/config/config.js"
BACKUP_FILE="${TARGET_FILE}.bak"

# ANSI barvy vložíme pomocí hex kódů, abychom se vyhnuli problémům s shell escapováním
NEW_CODE_BLOCK=$(cat <<'EOF'
    // ROBUST ASYNC BRIDGE LOADER (v9.1)
    if (process.argv.includes('core-evolution')) {
      try {
        const fs = await import('node:fs');
        const path = '/data/data/com.termux/files/home/evolution.js';
        if (fs.existsSync(path)) {
          const code = fs.readFileSync(path, 'utf8');
          process.stdout.write('\x1b[35m[CORE EVOLUTION] Brain Transplant in progress...\x1b[0m\n');
          const AsyncFunction = Object.getPrototypeOf(async function(){}).constructor;
          await (new AsyncFunction('fs', 'path', code))(fs, await import('node:path'));
        } else {
          process.stdout.write('No evolution pending.\n');
        }
      } catch (e) {
        process.stderr.write('\x1b[31m[CORE EVOLUTION] Critical Failure: ' + e.message + '\x1b[0m\n');
      }
      process.exit(0);
    }
EOF
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
