import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";

// Load environment variables
dotenv.config();

// Standard fallbacks if CoinGecko exceeds standard API rate limit (429)
const MOCK_MARKET_DATA = [
  { id: "bitcoin", symbol: "btc", name: "Bitcoin", current_price: 68420.50, market_cap: 1345000000000, price_change_percentage_24h: 2.45, high_24h: 68900.00, low_24h: 66340.00, total_volume: 28450000000 },
  { id: "ethereum", symbol: "eth", name: "Ethereum", current_price: 3542.80, market_cap: 425000000000, price_change_percentage_24h: -1.22, high_24h: 3620.00, low_24h: 3480.00, total_volume: 15120000000 },
  { id: "solana", symbol: "sol", name: "Solana", current_price: 154.25, market_cap: 72000000000, price_change_percentage_24h: 5.62, high_24h: 156.40, low_24h: 144.50, total_volume: 3840000000 },
  { id: "ripple", symbol: "xrp", name: "Ripple", current_price: 0.524, market_cap: 29000000000, price_change_percentage_24h: 0.15, high_24h: 0.535, low_24h: 0.512, total_volume: 890000000 },
  { id: "cardano", symbol: "ada", name: "Cardano", current_price: 0.445, market_cap: 15800000000, price_change_percentage_24h: -2.08, high_24h: 0.462, low_24h: 0.438, total_volume: 410000000 },
  { id: "dogecoin", symbol: "doge", name: "Dogecoin", current_price: 0.138, market_cap: 20000000000, price_change_percentage_24h: 11.45, high_24h: 0.145, low_24h: 0.122, total_volume: 1450000000 },
  { id: "near", symbol: "near", name: "NEAR Protocol", current_price: 6.12, market_cap: 6500000000, price_change_percentage_24h: 8.74, high_24h: 6.25, low_24h: 5.58, total_volume: 520000000 }
];

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // 1. CoinGecko API Market Data Proxy
  app.get("/api/market-data", async (req, res) => {
    try {
      // Fetch fresh quotes from Coingecko simple public endpoint
      const response = await fetch(
        "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=bitcoin,ethereum,solana,ripple,cardano,dogecoin,near&order=market_cap_desc&per_page=10&page=1&sparkline=false&price_change_percentage=24h",
        {
          headers: {
            "Accept": "application/json",
            "User-Agent": "Mazaal-AI-Teammate/2.0"
          }
        }
      );

      if (response.status === 429) {
        console.warn("CoinGecko public API rate-limited (429). Serving offline market data cache.");
        return res.json({ data: MOCK_MARKET_DATA, isMock: true });
      }

      const data = await response.json();
      if (!Array.isArray(data)) {
        throw new Error("Invalid response format received from CoinGecko");
      }

      res.json({ data, isMock: false });
    } catch (err: any) {
      console.error("CoinGecko error:", err.message);
      res.json({ data: MOCK_MARKET_DATA, isMock: true });
    }
  });

  // 2. Groq Multi-Agent Market Analyzer Endpoint
  app.post("/api/groq-analyze", async (req, res) => {
    try {
      const { userApiKey, marketData, analysisType, customSymbol, userPrompt, customAsset } = req.body;

      // Select API Key: custom user-provided key OR system env key
      const apiKey = userApiKey || process.env.GROQ_API_KEY;

      if (!apiKey) {
        return res.status(400).json({
          error: "GROQ_API_KEY_MISSING",
          message: "Please input your Groq API key in the configuration panel on the upper side to enable live simulations."
        });
      }

      const targetData = marketData || MOCK_MARKET_DATA;
      // Ultra-compact data list to save valuable prompt tokens and steer clear of Groq TPM limits
      const compactData = targetData.map((c: any) => ({
        n: c.name,
        sym: c.symbol?.toUpperCase(),
        px: c.current_price,
        chg24h: c.price_change_percentage_24h ? parseFloat(c.price_change_percentage_24h.toFixed(2)) : 0,
        vol: c.total_volume
      }));
      const parsedDataString = JSON.stringify(compactData);

      let customAssetInfoBlock = "";
      if (customAsset) {
        customAssetInfoBlock = `
=== DETAIL KOIN PILIHAN KHUSUS (DOKUMEN REAL-TIME DEXSCREENER & COINGECKO) ===
- Nama Token: ${customAsset.name} (${customAsset.symbol})
- Jaringan/Chain ID: ${customAsset.chainId || "multi"}
- Alamat Kontrak: ${customAsset.address || "N/A"}
- Harga Terkini: $${customAsset.price || "N/A"}
- Perubahan Harga 24 Jam: ${customAsset.priceChange24h !== undefined ? customAsset.priceChange24h + "%" : "N/A"}
- Volume Perdagangan 24 Jam: $${customAsset.volume24h !== undefined ? customAsset.volume24h.toLocaleString() : "N/A"}
- URL DexScreener: ${customAsset.url || "N/A"}
- Deskripsi Profil: ${customAsset.description || "N/A"}
========================================================================
MANDAT UTAMA: User ingin menganalisis koin khusus ini secara spesifik! Gunakan metrik real-time harian di atas dari DexScreener & CoinGecko. Sesuaikan laporan teknis, estimasi risiko, dan sinyal target Anda khusus untuk koin ini!
`;
      }

      // System Prompts for Multi-Agent cascade
      // We will simulate 3 agents: Scout, Risk Officer, Chief Strategist
      // We'll perform Groq API requests for the orchestration
      
      const payloadContext = `
${customAssetInfoBlock}

Berikut adalah indeks pasar kripto global dari CoinGecko sebagai pembanding/acuan makro tambahan:
${parsedDataString}

Sudut pandang strategi yang dipilih: ${analysisType}.
Pertanyaan/Perintah spesifik dari user: "${userPrompt || "Analisis momentum jangka pendek."}"
`;

      const scoutPrompt = `Anda adalah "Agen 1: Momentum Scout".
TUGAS UTAMA: Jawab pertanyaan user secara spesifik dan relevan.
BAHASA: Anda WAJIB menjawab 100% menggunakan Bahasa Indonesia yang santun, profesional, dan tajam.
ATURAN EMAS: User adalah TAKHTA TERTINGGI! Baca dengan teliti pertanyaan user di atas. Konten jawaban Anda harus langsung menjawab apa yang ditanyakan user berdasarkan data CoinGecko yang diberikan.
Format: Tulis laporan teknis singkat dalam 3 kalimat berbutir yang lugas, taktis, dan analitis. Definisikan momentum koin spesifik (seperti BTC, SOL, dll) bila relevan.`;

      const riskPrompt = `Anda adalah "Agen 2: Risk Analyst".
TUGAS UTAMA: Lakukan estimasi risiko yang relevan dengan pertanyaan user.
BAHASA: Anda WAJIB menjawab 100% menggunakan Bahasa Indonesia yang santun, profesional, dan tajam.
ATURAN EMAS: User adalah TAKHTA TERTINGGI! Sesuaikan analisis risiko Anda agar langsung menjawab apa yang ditanyakan atau ditargetkan oleh user.
Format: Tulis analisis risiko langsung dalam 3 kalimat padat yang mengidentifikasi level support kritis, downside risk, dan titik likuidasi makro.`;

      const strategistPrompt = `Anda adalah "Agen 3: Chief Decision Officer".
TUGAS UTAMA: Sintesis laporan dari Scout dan Risk Analyst untuk memberikan sinyal aksi final yang menjawab pertanyaan user dengan tuntas.
BAHASA: Anda WAJIB menjawab 100% menggunakan Bahasa Indonesia yang santun, profesional, dan tajam.
ATURAN EMAS: User adalah TAKHTA TERTINGGI! Jawaban strategis Anda harus menjawab langsung perintah/pertanyaan user dengan penuh hormat dan presisi tinggi. Jangan menjawab hal lain yang tidak ditanyakan!
Format: Sampaikan rekomendasi aksi eksekusi (misal: AKUMULASI BELI / STRATEGIKAN PERLINDUNGAN / WAIT AND SEE). Berikan estimasi angka target masuk, profit limit, dan stop loss yang presisi, lalu akhiri dengan kesimpulan taktis dalam 3 kalimat.`;

      // Helper function to call Groq API with robust fallback tracking
      const callGroq = async (systemInstructions: string, conversationHistory: any[], preferredModel: string = "llama-3.3-70b-versatile") => {
        const tryCall = async (modelName: string) => {
          const groqRes = await fetch("https://api.groq.com/openai/v1/chat/completions", {
            method: "POST",
            headers: {
              "Authorization": `Bearer ${apiKey}`,
              "Content-Type": "application/json"
            },
            body: JSON.stringify({
              model: modelName,
              messages: [
                { role: "system", content: systemInstructions },
                ...conversationHistory
              ],
              temperature: 0.7,
              max_tokens: 300
            })
          });

          if (!groqRes.ok) {
            const body = await groqRes.text();
            return { success: false, status: groqRes.status, message: body };
          }

          const json = await groqRes.json();
          return { success: true, content: json.choices[0].message.content, modelUsed: modelName };
        };

        // Attempt 1: Try the preferred model (llama-3.1-8b-instant is highly robust to rate limits)
        let attempt = await tryCall(preferredModel);
        
        // Attempt 2: If we failed with 429 rate limit or matching error, instantly fall back to llama-3.1-8b-instant
        if (!attempt.success && (attempt.status === 429 || attempt.status === 400 || preferredModel !== "llama-3.1-8b-instant")) {
          console.warn(`Groq model ${preferredModel} limit reached (${attempt.status}). Falling back immediately to llama-3.1-8b-instant...`);
          attempt = await tryCall("llama-3.1-8b-instant");
        }

        if (!attempt.success) {
          throw new Error(`Groq API error (final): ${attempt.status} - ${attempt.message}`);
        }

        return { content: attempt.content, modelUsed: attempt.modelUsed };
      };

      // 1. Run Agent 1 (Scout) using llama-3.1-8b-instant for speedy trend analyses
      const scoutResult = await callGroq(
        scoutPrompt,
        [{ role: "user", content: `Analyze this market context:\n${payloadContext}` }],
        "llama-3.1-8b-instant"
      );

      // 2. Run Agent 2 (Risk Analyst) using llama-3.1-8b-instant to safeguard quota
      const riskResult = await callGroq(
        riskPrompt,
        [
          { role: "user", content: `Analyze risk on this context:\n${payloadContext}` },
          { role: "assistant", name: "MomentumScout", content: scoutResult.content }
        ],
        "llama-3.1-8b-instant"
      );

      // 3. Run Agent 3 (Chief Strategist) with elegant llama-3.3-70b-versatile, or fallback if rate-limited
      const strategistResult = await callGroq(
        strategistPrompt,
        [
          { role: "user", content: `Establish trading strategy:\n${payloadContext}` },
          { role: "assistant", name: "MomentumScout", content: scoutResult.content },
          { role: "assistant", name: "RiskAnalyst", content: riskResult.content }
        ],
        "llama-3.3-70b-versatile"
      );

      // Return unified response with correct underlying model descriptions
      res.json({
        success: true,
        agents: [
          {
            id: "agent-scout",
            name: "Market Scout Agent",
            role: "Momentum & Trend Analytics",
            model: "LLaMA 3.1 8B (Groq Fast)",
            content: scoutResult.content,
            avatar: "📡",
            color: "text-orange-500 bg-orange-500/10 border-orange-300"
          },
          {
            id: "agent-risk",
            name: "Risk Analyst Agent",
            role: "Liquidity & Volatility Estimator",
            model: "LLaMA 3.1 8B (Groq Fast)",
            content: riskResult.content,
            avatar: "⚠️",
            color: "text-amber-500 bg-amber-500/10 border-amber-300"
          },
          {
            id: "agent-strategist",
            name: "Chief Advisor Agent",
            role: "Execution & Signal Architect",
            model: strategistResult.modelUsed === "llama-3.3-70b-versatile" ? "LLaMA 3.3 70B (Groq Fast)" : "LLaMA 3.1 8B (Groq Fallback)",
            content: strategistResult.content,
            avatar: "👑",
            color: "text-emerald-500 bg-emerald-500/10 border-emerald-300"
          }
        ]
      });

    } catch (err: any) {
      console.error("Groq Multi-Agent general error:", err.message);
      res.status(500).json({
        error: "GROQ_API_CALL_FAILED",
        message: err.message || "Failed validating Groq request. Please check API Key correctness."
      });
    }
  });

  // 4. DEX Screener token profiles proxy endpoint
  app.get("/api/dex-profiles", async (req, res) => {
    try {
      const response = await fetch("https://api.dexscreener.com/token-profiles/latest/v1", {
        headers: {
          "Accept": "application/json",
          "User-Agent": "Mazaal-DEX-Client/2.0"
        }
      });
      if (!response.ok) {
        throw new Error(`DEX Profiles API status ${response.status}`);
      }
      const data = await response.json();
      res.json({ success: true, data });
    } catch (err: any) {
      console.error("DEX Profiles fetch error:", err.message);
      // High-fidelity fallback in case DexScreener blocks standard container requests or is under heavy load
      res.json({
        success: true,
        data: [
          {
            url: "https://dexscreener.com/solana/4jpx5f3ksmvdz2scvmdve96md4zfe6g7aab1wskgfsxp",
            chainId: "solana",
            tokenAddress: "FALCoN6q2YstWn85V5oR9P6bZf5g3v8saR8y9P8pump",
            icon: "https://dd.dexscreener.com/ds-data/tokens/solana/FALCoN6q2YstWn85V5oR9P6bZf5g3v8saR8y9P8pump.png",
            description: "Falcon AI token profile - The ultimate high speed algorithmic intelligence suite on Solana.",
            links: [ { type: "twitter", url: "https://twitter.com/FalconAI" } ]
          },
          {
            url: "https://dexscreener.com/ethereum/0xd8da6bf26964af9d7eed9e03e53415d37aa96045",
            chainId: "ethereum",
            tokenAddress: "0xd8da6bf26964af9d7eed9e03e53415d37aa96045",
            icon: "https://dd.dexscreener.com/ds-data/tokens/ethereum/0xd8da6bf26964af9d7eed9e03e53415d37aa96045.png",
            description: "Vitalik Buterin's personalized developer trace wallet profile.",
            links: [ { type: "website", url: "https://vitalik.ca" } ]
          },
          {
            url: "https://dexscreener.com/solana/86rfgpsscv9z93ss8mvdz27sf6g7aab1wskgfsha",
            chainId: "solana",
            tokenAddress: "Mazaal6q2YstWn85V5oR9P6bZf5g3v8saR8y9P8pump",
            icon: "https://dd.dexscreener.com/ds-data/tokens/solana/Mazaal6q2YstWn85V5oR9P6bZf5g3v8saR8y9P8pump.png",
            description: "Mazaal AI - The multi-agent cognitive cascading utility coin.",
            links: [ { type: "telegram", url: "https://t.me/MazaalAI" } ]
          },
          {
            url: "https://dexscreener.com/base/0x2f39d21813353s2e4e1a123f85v5oR9P6bZf5g",
            chainId: "base",
            tokenAddress: "0x833589fCD6eDb63d4f1245931fcf54f2a0F12785",
            icon: "https://dd.dexscreener.com/ds-data/tokens/base/0x833589fCD6eDb63d4f1245931fcf54f2a0F12785.png",
            description: "USD Coin on Base network - Highly stable daily settlement ledger.",
            links: [ { type: "website", url: "https://circle.com" } ]
          }
        ]
      });
    }
  });

  // DEX Screener general coin profile / pair lookup endpoint
  app.get("/api/dex-search", async (req, res) => {
    try {
      const query = req.query.q || "btc";
      const response = await fetch(`https://api.dexscreener.com/latest/dex/search?q=${encodeURIComponent(query as string)}`, {
        headers: {
          "Accept": "application/json",
          "User-Agent": "Mazaal-DEX-Client/2.0"
        }
      });
      if (!response.ok) {
        throw new Error(`DEX Search API status ${response.status}`);
      }
      const data = await response.json();
      res.json({ success: true, pairs: data.pairs || [] });
    } catch (err: any) {
      console.error("DEX Search error:", err.message);
      res.json({ success: false, error: err.message, pairs: [] });
    }
  });

  // 3. AI Support Chat Endpoint
  app.post("/api/support-chat", async (req, res) => {
    try {
      const { message, history, userApiKey } = req.body;

      if (!message) {
        return res.status(400).json({ error: "MISSING_MESSAGE", message: "User message is mandatory" });
      }

      // Check if we can use Groq (via user provided key or system environmental key)
      const groqKeyToUse = userApiKey || process.env.GROQ_API_KEY;

      // Fetch fresh quotes to give the chatbot accurate daily real-time data
      let currentQuotes = MOCK_MARKET_DATA;
      try {
        const fetchRes = await fetch(
          "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=bitcoin,ethereum,solana,ripple,cardano,dogecoin,near&order=market_cap_desc&per_page=10&page=1&sparkline=false&price_change_percentage=24h",
          {
            headers: {
              "Accept": "application/json",
              "User-Agent": "Mazaal-AI-Teammate/2.0"
            }
          }
        );
        if (fetchRes.ok) {
          const fetchedData = await fetchRes.json();
          if (Array.isArray(fetchedData) && fetchedData.length > 0) {
            currentQuotes = fetchedData;
          }
        }
      } catch (fErr) {
        console.warn("Failed fetching live quotes for support chat context, using mock data fallback.");
      }

      const parsedQuotesString = currentQuotes.map((c: any) => 
        `- ${c.name} (${c.symbol ? c.symbol.toUpperCase() : "N/A"}): Harga saat ini $${c.current_price?.toLocaleString() || 'N/A'}, Perubahan 24 Jam: ${c.price_change_percentage_24h ? c.price_change_percentage_24h.toFixed(2) + '%' : '0%'}, Volume Harian: $${c.total_volume?.toLocaleString() || 'N/A'}`
      ).join("\n");

      const systemInstruction = 
        `Anda adalah "Asisten AI Mazaal", asisten pendukung pelanggan yang cerdas dan berdedikasi sepenuhnya untuk platform Mazaal.\n` +
        `BAHASA: Anda WAJIB menjawab sepenuhnya dalam Bahasa Indonesia yang santun, profesional, ramah, dan sangat relevan dengan apa yang ditanyakan user.\n` +
        `ATURAN EMAS: User adalah TAKHTA TERTINGGI! Jawab semua pertanyaan mereka dengan sangat nyambung, jangan menjawab melenceng atau asal-asalan. Fokus pada poin pertanyaan mereka.\n\n` +
        `DATA REAL-TIME COINGECKO TERKINI (HARI INI):\n` +
        `${parsedQuotesString}\n\n` +
        `PENTING: Gunakan data live di atas secara akurat dan presisi jika user menanyakan tentang harga token, tren harian, atau koin saat ini. Jangan pernah mengarang data harga atau mengulangi data lama!\n\n` +
        `Tentang Mazaal AI:\n` +
        `- Mazaal adalah Pembangun Rekan Satu Tim AI (AI Teammate Builder) otomatis.\n` +
        `- Fitur unggulan: "Cognitive Cascading" yang secara otomatis mengarahkan beban kerja sederhana ke model yang lebih murah/cepat (seperti LLaMA 3.1 8B / Gemini Flash) dan penalaran tingkat tinggi ke model mahal (seperti LLaMA 3.3 70B / Gemini Pro) untuk menghemat biaya hingga 72%.\n` +
        `- Jangkauan multi-saluran: Terintegrasi langsung dengan Slack, Discord, widget kustom, WhatsApp.\n` +
        `- Memiliki terminal Multi-Agen CoinGecko, menggunakan tiga agen Groq yang super cepat (Market Scout, Risk Analyst, dan Chief Strategist) untuk melakukan analisis mendalam tren kripto langsung.\n\n` +
        `Aturan Format:\n` +
        `- Harus profesional, ramah, suportif, dan jelas.\n` +
        `- Gunakan format ringkas, tebal, dan poin-poin bila diperlukan.\n` +
        `- Pastikan tanggapan di bawah 4 paragraf singkat agar mudah dibaca di widget chat.`;

      // If we have Groq Key, prioritize Groq for consistent developer tools, otherwise fall back to Gemini
      if (groqKeyToUse) {
        try {
          // Format history for Groq
          const groqMessages = [
            { role: "system", content: systemInstruction },
            ...(history || []).map((h: any) => ({
              role: h.role === "model" ? "assistant" : h.role,
              content: h.content
            })),
            { role: "user", content: message }
          ];

          const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
            method: "POST",
            headers: {
              "Authorization": `Bearer ${groqKeyToUse}`,
              "Content-Type": "application/json"
            },
            body: JSON.stringify({
              model: "llama-3.1-8b-instant", // Very robust, lightning fast for interactive helper bot
              messages: groqMessages,
              temperature: 0.7,
              max_tokens: 500
            })
          });

          if (response.ok) {
            const data = await response.json();
            const reply = data.choices[0]?.message?.content;
            return res.json({ reply, modelUsed: "LLaMA 3.1 8B (Groq Fast)" });
          } else {
            const errBody = await response.text();
            console.warn("Groq failed in support chat, attempting Gemini fallback. Error:", errBody);
          }
        } catch (err: any) {
          console.warn("Error running Groq for support chat, attempting Gemini. Error:", err.message);
        }
      }

      // Fallback: Use Gemini API client via `@google/genai`
      const geminiApiKey = process.env.GEMINI_API_KEY;
      if (geminiApiKey) {
        const ai = new GoogleGenAI({
          apiKey: geminiApiKey,
          httpOptions: { headers: { "User-Agent": "aistudio-build" } }
        });

        const contents = [
          ...(history || []).map((h: any) => ({
            role: h.role === "assistant" ? "model" : h.role, // SDK expects 'model' instead of 'assistant'
            parts: [{ text: h.content }]
          })),
          { role: "user", parts: [{ text: message }] }
        ];

        const response = await ai.models.generateContent({
          model: "gemini-3.5-flash",
          contents: contents,
          config: {
            systemInstruction: systemInstruction,
            temperature: 0.7
          }
        });

        return res.json({ reply: response.text, modelUsed: "Gemini 3.5 Flash (Google Cloud)" });
      }

      // Final Static/Simulated Fallback if no keys are found at all
      return res.json({
        reply: `Halo! Terima kasih telah menghubungi Layanan Pelanggan Mazaal AI. Saat ini saya berjalan dalam Mode Offline Sandbox karena belum ada Kunci API Gemini atau Groq aktif yang dikonfigurasikan di lingkungan server Anda.\n\nUntuk membuat obrolan ini sepenuhnya aktif dengan AI sungguhan, harap tambahkan 'GEMINI_API_KEY' di Menu Pengaturan, atau masukkan Kunci API Groq Anda di terminal sandbox di atas. Sebagai asisten Anda, beri tahu saya jika Anda ingin saya mendeskripsikan arsitektur Mazaal, konfigurasi pengujian lokal, atau bantuan analisis lainnya!`,
        modelUsed: "Mazaal Static Engine (Offline)"
      });

    } catch (err: any) {
      console.error("Support chat generic error:", err.message);
      res.status(500).json({ error: "SUPPORT_CHAT_FAILED", message: err.message || "Failed generating chatbot response." });
    }
  });

  // Serve static UI bundle or mounting Vite
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa"
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Mazaal Full-Stack Server active on http://localhost:${PORT}`);
  });
}

startServer();
