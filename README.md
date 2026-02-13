# ⚡ RENEGADE KERNEL - WEB INTERFACE (PWA)

Toto je grafické rozhraní pro Renegade Kernel, optimalizované jako progresivní webová aplikace (PWA).

## 🚀 SPUŠTĚNÍ

1. **Instalace závislostí:**
   ```bash
   npm install
   ```

2. **Start serveru:**
   ```bash
   node server.js
   ```

3. **Přístup:**
   Otevři prohlížeč na adrese: `http://localhost:3000`

## 🛠 VLASTNOSTI

- **Cyberpunk UI:** Neonový design s fontem Orbitron.
- **Universal Scanner:** Automaticky detekuje dostupné modely (Gemini 2.5, 3.0 atd.) po zadání API klíče.
- **PWA Ready:** Možnost instalace na plochu telefonu nebo PC.
- **Autonomous Identity:** Plná integrace Renegade Kernel identity.

## 📡 NASAZENÍ V TERMUXU

Pokud chceš, aby rozhraní běželo trvale na pozadí:
```bash
npm install -g pm2
pm2 start server.js --name "renegade-web"
```

**STATUS: ONLINE**
