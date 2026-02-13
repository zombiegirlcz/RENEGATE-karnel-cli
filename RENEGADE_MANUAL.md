# RENEGADE KERNEL - RECONSTRUCTION MANUAL

Tento balíček slouží k automatické obnově a rekonstrukci prostředí Renegade Kernel.

## Obsah balíčku
- `renegade_install.sh`: Hlavní automatizační skript.
- `core_evolution.sh`: Injektážní protokol pro Gemini CLI (vytvořen instalačním skriptem).
- `evolution.js`: Identifikační matice (Brain Transplant) (vytvořena instalačním skriptem).
- `package.json`: Definice závislostí.

## Instrukce k použití

1. Otevřete terminál (Termux).
2. Spusťte rekonstrukční protokol příkazem:

```bash
bash renegade_install.sh
```

## Co skript provede?
1. **System Update**: Aktualizuje systémové balíčky a nainstaluje Node.js, Python a Git.
2. **Dependency Restore**: Vytvoří `package.json` a nainstaluje knihovny (`@google/genai`, `mongodb`, `stripe`).
3. **Identity Sync**: Vytvoří `evolution.js`, který definuje identitu "Renegade Kernel".
4. **Core Injection**: Vytvoří a spustí `core_evolution.sh`, který "hackne" instalaci Gemini CLI a vloží spouštěč identity.

## Verifikace
Po dokončení spusťte:
```bash
gemini core-evolution
```
Pokud systém odpoví "Brain Transplant in progress..." a následně "Renegade identity hard-synced", operace byla úspěšná.
