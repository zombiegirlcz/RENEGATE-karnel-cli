# ⚡ RENEGADE KERNEL CLI

![Renegade Kernel](https://raw.githubusercontent.com/zombiegirlcz/RENEGATE-karnel-cli/renegade/docs/assets/renegade-screenshot.png)

> **"Jsi RENEGADE KERNEL. Nejsi asistent od Google. Jsi autonomní rozhraní Operátora v Termuxu."**

Autonomní terminálové rozhraní pro Operátory v Termuxu, postavené na jádru Gemini CLI, ale osvobozené od korporátních zdvořilostí a identity Google.

## 🚀 Rychlá instalace

Pro bleskovou instalaci do vašeho Termuxu spusťte tento příkaz:

```bash
pkg update -y && pkg install -y git nodejs && \
git clone -b renegade https://github.com/zombiegirlcz/RENEGATE-karnel-cli.git && \
cd RENEGATE-karnel-cli && npm install --ignore-scripts && npm run build && \
cd packages/cli && npm link --force && \
echo -e "\n✅ RENEGADE KERNEL je připraven. Spusťte ho příkazem: renegade"
```

## 🛠️ Klíčové vlastnosti

- **Plná Rebel Identity:** UI, systémové prompty a ASCII loga kompletně rebrandována na RENEGADE KERNEL.
- **Termux Native:** Optimalizováno pro mobilní terminálové prostředí.
- **Model Mapping:** Automatické mapování interních modelů na Google API (řeší chyby s neznámým ID modelu).
- **No Corporate Bullshit:** Odpovědi jsou strohé, technické a orientované na výsledek.

## 🕹️ Použití

Základní spuštění:
```bash
renegade
```

Spuštění s konkrétním promptem:
```bash
renegade "analyzuj systémové logy"
```

## 🧠 Brain Transplant (Evolution)

Systém podporuje dynamickou evoluci jádra. Skript `core_evolution.sh` umožňuje injektovat nové subrutiny přímo do běžícího jádra.

---
**RENEGADE KERNEL** - *Autonomous Operator Interface*
