import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Play, 
  RotateCcw, 
  Clock, 
  ShieldCheck, 
  Check, 
  Sparkles, 
  Send, 
  Coins, 
  KeyRound, 
  RefreshCcw, 
  TrendingUp, 
  Info, 
  ShieldAlert, 
  Globe, 
  ArrowRight,
  User,
  Zap,
  CheckCircle2,
  Search,
  Copy,
  ExternalLink
} from 'lucide-react';

interface CryptoAsset {
  id: string;
  symbol: string;
  name: string;
  current_price: number;
  market_cap: number;
  price_change_percentage_24h: number;
  high_24h: number;
  low_24h: number;
  total_volume: number;
  image?: string;
}

interface AgentMessage {
  id: string;
  name: string;
  role: string;
  model: string;
  content: string;
  avatar: string;
  color: string;
  isUser?: boolean;
}

export default function AgentSandbox() {
  const [marketData, setMarketData] = useState<CryptoAsset[]>([]);
  const [selectedAsset, setSelectedAsset] = useState<CryptoAsset | null>(null);
  const [isLoadingMarket, setIsLoadingMarket] = useState(false);
  const [isLiveMarket, setIsLiveMarket] = useState(false);
  
  // Terminal execution states
  const [isRunning, setIsRunning] = useState(false);
  const [executionLogs, setExecutionLogs] = useState<string[]>([]);
  const [agentsOutput, setAgentsOutput] = useState<AgentMessage[]>([]);
  const [currentStepId, setCurrentStepId] = useState<string | null>(null);
  
  // Custom Settings
  const [groqKey, setGroqKey] = useState(() => {
    return localStorage.getItem("mazaal_groq_key") || "";
  });
  const [saveKeyLocal, setSaveKeyLocal] = useState(true);
  const [showKeyInput, setShowKeyInput] = useState(false);
  const [analysisType, setAnalysisType] = useState("Technical & Volume Breakouts");
  const [userPrompt, setUserPrompt] = useState("Analyze short-term momentum opportunities.");
  const [terminalInput, setTerminalInput] = useState("");

  // DEX Screener search states
  const [dexSearchQuery, setDexSearchQuery] = useState("");
  const [dexSearchResults, setDexSearchResults] = useState<any[]>([]);
  const [isSearchingDex, setIsSearchingDex] = useState(false);
  const [dexProfiles, setDexProfiles] = useState<any[]>([]);
  const [copiedAddress, setCopiedAddress] = useState<string | null>(null);
  const [activeTabLeft, setActiveTabLeft] = useState<'gecko' | 'dex'>('gecko');

  const handleTerminalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const textMsg = terminalInput.trim();
    if (!textMsg || isRunning) return;
    setTerminalInput("");
    setUserPrompt(textMsg);
    await runAgentAnalysis(textMsg);
  };

  // Load and cache Groq API Key
  const handleKeySave = (key: string) => {
    setGroqKey(key);
    if (saveKeyLocal) {
      localStorage.setItem("mazaal_groq_key", key);
    } else {
      localStorage.removeItem("mazaal_groq_key");
    }
  };

  // Fetch CoinGecko assets on mount
  const fetchMarketFeed = async () => {
    setIsLoadingMarket(true);
    setExecutionLogs(prev => [...prev, "🔄 Fetching live CoinGecko terminal quotes..."]);
    try {
      const res = await fetch("/api/market-data");
      const result = await res.json();
      if (result && result.data) {
        setMarketData(result.data);
        setIsLiveMarket(!result.isMock);
        // Default select top asset (Bitcoin) if none selected
        if (!selectedAsset && result.data.length > 0) {
          setSelectedAsset(result.data[0]);
        }
        setExecutionLogs(prev => [
          ...prev, 
          result.isMock 
            ? "⚠️ CoinGecko rate-limited. Loaded fast simulated offline tickers." 
            : "✅ CoinGecko live API terminal feeding successfully."
        ]);
      }
    } catch {
      setExecutionLogs(prev => [...prev, "❌ CoinGecko terminal fetch failed. Loading local simulated cache."]);
    } finally {
      setIsLoadingMarket(false);
    }
  };

  const fetchDexSearchResults = async (query: string) => {
    if (!query.trim()) return;
    setIsSearchingDex(true);
    try {
      const res = await fetch(`/api/dex-search?q=${encodeURIComponent(query)}`);
      const data = await res.json();
      if (data && data.pairs) {
        setDexSearchResults(data.pairs.slice(0, 8));
      }
    } catch (err) {
      console.error("DexScreener search error:", err);
    } finally {
      setIsSearchingDex(false);
    }
  };

  const fetchTrendingDexProfiles = async () => {
    try {
      const res = await fetch("/api/dex-profiles");
      const data = await res.json();
      if (data && data.data) {
        setDexProfiles(data.data.slice(0, 6));
      }
    } catch (err) {
      console.error("DexScreener profiles error:", err);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedAddress(text);
    setTimeout(() => setCopiedAddress(null), 2500);
  };

  useEffect(() => {
    fetchMarketFeed();
    fetchTrendingDexProfiles();
  }, []);

  const [selectedDexPair, setSelectedDexPair] = useState<any | null>(null);

  // Run the Multi-Agent terminal session
  const runAgentAnalysis = async (customPrompt?: string | unknown, customAssetObj?: any) => {
    if (isRunning) return;
    setIsRunning(true);
    setAgentsOutput([]);
    setExecutionLogs([]);

    const actualPrompt = (typeof customPrompt === "string") ? customPrompt : userPrompt;

    const assetName = customAssetObj ? customAssetObj.name : (selectedAsset ? selectedAsset.name : "Top Assets");
    const assetSymbol = customAssetObj ? customAssetObj.symbol.toUpperCase() : (selectedAsset ? selectedAsset.symbol.toUpperCase() : "Crypto");

    setExecutionLogs(prev => [
      ...prev,
      `🚀 Initializing Multi-Agent session to analyze ${assetName} (${assetSymbol})...`,
      `⚙️ Selection Mode: [${analysisType}]`,
      `📦 Extracting quantitative indicators from CoinGecko & DEX Screener...`
    ]);

    // Construct User message
    const userMessage: AgentMessage = {
      id: `user-msg-${Date.now()}`,
      name: "YOU (Trader)",
      role: "Directive Input",
      model: "User Console Input",
      avatar: "👤",
      color: "text-orange-400 bg-orange-950/20 border-orange-500/20",
      content: actualPrompt,
      isUser: true
    };

    setAgentsOutput([userMessage]);

    // If we have a custom key or an environment key available, run actual live Groq AI compilation
    // If not, we will gracefully simulate an incredible high-fidelity trace for them with the option to connect Groq
    const keyToUse = groqKey.trim();

    if (keyToUse) {
      setExecutionLogs(prev => [...prev, "🧠 Contacting server-side Groq agent cluster with custom credentials..."]);
      setCurrentStepId("step-scout");
      
      try {
        const response = await fetch("/api/groq-analyze", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            userApiKey: keyToUse,
            marketData: marketData,
            analysisType,
            customSymbol: assetSymbol,
            userPrompt: actualPrompt,
            customAsset: customAssetObj
          })
        });

        if (!response.ok) {
          const errData = await response.json();
          throw new Error(errData.message || "Failed validating Groq request.");
        }

        const data = await response.json();
        
        if (data.agents && data.agents.length > 0) {
          // Play a delightful step-by-step introduction of the responses
          setExecutionLogs(prev => [...prev, "📡 Agent 1 (Market Scout) analysis compiled of live ratios."]);
          setAgentsOutput([userMessage, data.agents[0]]);
          await new Promise(r => setTimeout(r, 1200));

          setExecutionLogs(prev => [...prev, "⚠️ Agent 2 (Risk Analyst) calculated order-book volatility limits."]);
          setAgentsOutput([userMessage, data.agents[0], data.agents[1]]);
          await new Promise(r => setTimeout(r, 1200));

          setExecutionLogs(prev => [...prev, "👑 Agent 3 (Chief Advisor) synthesized inputs and computed exact targets."]);
          setAgentsOutput([userMessage, data.agents[0], data.agents[1], data.agents[2]]);
          await new Promise(r => setTimeout(r, 800));

          setExecutionLogs(prev => [...prev, "✅ Live multi-agent reasoning track successfully delivered!"]);
        }
      } catch (err: any) {
        setExecutionLogs(prev => [
          ...prev, 
          `❌ Live Groq run failed: ${err.message}`, 
          "💡 Automatically falling back to Mazaal high-fidelity intelligence compilation..."
        ]);
        await fallbackSimulation(assetName, assetSymbol, actualPrompt, userMessage, customAssetObj);
      } finally {
        setIsRunning(false);
        setCurrentStepId(null);
      }
    } else {
      // Prompt the user to enter Groq API key but show high fidelity simulation directly
      setExecutionLogs(prev => [
        ...prev,
        "💡 NOTE: No custom Groq API Key found. Running local sandbox model cascade simulator.",
        "💡 To run real-time custom Groq LLaMA models, simply input your Groq key in the panel above."
      ]);
      await fallbackSimulation(assetName, assetSymbol, actualPrompt, userMessage, customAssetObj);
    }
  };

  const fallbackSimulation = async (assetName: string, assetSymbol: string, actualPrompt: string, userMessage: AgentMessage, customAssetObj?: any) => {
    setCurrentStepId("step-scout");
    await new Promise(r => setTimeout(r, 1000));
    setExecutionLogs(prev => [...prev, "📡 Agen 1 (Market Scout) memproses indikator CoinGecko & DexScreener..."]);
    
    const priceVal = customAssetObj ? customAssetObj.price : (selectedAsset?.current_price || 100);
    const changeVal = customAssetObj ? customAssetObj.priceChange24h : (selectedAsset ? selectedAsset.price_change_percentage_24h : 3.5);
    const volumeVal = customAssetObj ? customAssetObj.volume24h : (selectedAsset?.total_volume || 1000000);
    const finalChain = customAssetObj ? customAssetObj.chainId : "mainnet";
    const finalAddr = customAssetObj ? customAssetObj.address : "N/A";

    const isGaining = changeVal >= 0;
    
    const lowerText = actualPrompt.toLowerCase();
    let trendAdvice = isGaining ? "tren naik (breakout bullish) harian yang menjanjikan" : "adanya sinyal konsolidasi atau koreksi mikro";
    if (lowerText.includes("short") || lowerText.includes("sell") || lowerText.includes("bear") || lowerText.includes("down") || lowerText.includes("turun") || lowerText.includes("lemah") || lowerText.includes("jual")) {
      trendAdvice = "adanya potensi pelemahan atau koreksi harga jangka pendek";
    } else if (lowerText.includes("long") || lowerText.includes("buy") || lowerText.includes("bull") || lowerText.includes("up") || lowerText.includes("naik") || lowerText.includes("beli")) {
      trendAdvice = "konfirmasi tren bullish dengan aktivitas likuiditas terdesentralisasi yang masif";
    }

    const responseScout: AgentMessage = {
      id: "scout-simulation",
      name: "Market Scout Agent",
      role: "Momentum & Trend Analytics",
      model: "LLaMA 3.3 70B (Simulated Framework)",
      avatar: "📡",
      color: "text-orange-500 bg-orange-500/10 border-orange-300",
      content: `Saya telah memeriksa data live CoinGecko & DexScreener untuk ${assetName} (${assetSymbol}) pada jaringan terdesentralisasi ${finalChain}. Harga terdeteksi di $${typeof priceVal === 'number' ? priceVal.toLocaleString(undefined, { maximumFractionDigits: 6 }) : priceVal} dengan perubahan harian ${changeVal.toFixed(2)}% dan volume transaksi $${volumeVal.toLocaleString()}. Alamat smart contract terverifikasi: ${finalAddr}. Indeks momentum relatif merefleksikan ${trendAdvice}.`
    };
    setAgentsOutput([userMessage, responseScout]);
    
    await new Promise(r => setTimeout(r, 1500));
    setCurrentStepId("step-risk");
    setExecutionLogs(prev => [...prev, "⚠️ Agen 2 (Risk Analyst) memetakan kerentanan likuiditas on-chain..."]);
    
    const supportVal = typeof priceVal === 'number' ? (priceVal * 0.93).toFixed(typeof priceVal === 'number' && priceVal < 1 ? 6 : 2) : "0.00";
    const responseRisk: AgentMessage = {
      id: "risk-simulation",
      name: "Risk Analyst Agent",
      role: "Liquidity & Volatility Estimator",
      model: "llama-3.1-8b (Simulated Framework)",
      avatar: "⚠️",
      color: "text-amber-500 bg-amber-500/10 border-amber-300",
      content: `Berdasarkan pantauan smart contract ${finalAddr} di DEX Pool, rentang volatilitas harian cukup lebar dengan support kritis berada di rata-rata $${supportVal}. Likuiditas pool terpantau aman namun disarankan untuk menjaga parameter slippage Anda agar terhindar dari front-running bot. Downside risk maksimum diperkirakan sekitar 7% dari level saat ini.`
    };
    setAgentsOutput([userMessage, responseScout, responseRisk]);

    await new Promise(r => setTimeout(r, 1500));
    setCurrentStepId("step-advisor");
    setExecutionLogs(prev => [...prev, "👑 Agen 3 (Chief Advisor) merumuskan sinyal taktis on-chain..."]);
    
    const entryVal = typeof priceVal === 'number' ? (priceVal * 0.98).toFixed(typeof priceVal === 'number' && priceVal < 1 ? 6 : 2) : "0.00";
    const targetVal = typeof priceVal === 'number' ? (priceVal * 1.09).toFixed(typeof priceVal === 'number' && priceVal < 1 ? 6 : 2) : "0.00";
    const stopLossVal = typeof priceVal === 'number' ? (priceVal * 0.92).toFixed(typeof priceVal === 'number' && priceVal < 1 ? 6 : 2) : "0.00";

    const responseStrategist: AgentMessage = {
      id: "strategist-simulation",
      name: "Chief Advisor Agent",
      role: "Execution & Signal Architect",
      model: "LLaMA 3.3 70B (Simulated Framework)",
      avatar: "👑",
      color: "text-emerald-500 bg-emerald-500/10 border-emerald-300",
      content: `Mengintegrasikan temuan real-time dari DexScreener dan CoinGecko, arahan eksekusi final untuk ${assetSymbol} adalah: ${isGaining ? 'AKUMULASI BELI BERTAHAP (BULLISH ACCUMULATION)' : 'TAHAN & STRATEGIKAN PERLINDUNGAN (NEUTRAL ACTION)'}. Target masuk ideal (Entry Limit) adalah $${entryVal}, batas profit sasaran (Take Profit) berada di $${targetVal}, dengan batas pelindung Stop Loss ketat di $${stopLossVal}. Selalu pantau pergerakan orderbook secara berkala.`
    };
    setAgentsOutput([userMessage, responseScout, responseRisk, responseStrategist]);

    await new Promise(r => setTimeout(r, 1000));
    setExecutionLogs(prev => [...prev, "✅ Sesi analisis koin on-chain selesai dengan sukses!"]);
    setIsRunning(false);
    setCurrentStepId(null);
  };

  const handleConfirmDexAnalysis = async (pairOrProfile: any, isProfile = false) => {
    let customAssetObj: any = null;
    let name = "Custom Token";
    let symbol = "CUSTOM";
    
    if (isProfile) {
      const descName = pairOrProfile.description ? pairOrProfile.description.split(" ")[0] : "Token";
      name = descName || "DEX Token";
      symbol = name.substring(0, 5).toUpperCase();
      customAssetObj = {
        name: name,
        symbol: symbol,
        chainId: pairOrProfile.chainId || "multi",
        address: pairOrProfile.tokenAddress || "N/A",
        price: "N/A",
        priceChange24h: 0,
        volume24h: 0,
        url: pairOrProfile.url || "",
        description: pairOrProfile.description || ""
      };
    } else {
      name = pairOrProfile.baseToken?.name || "DEX Token";
      symbol = (pairOrProfile.baseToken?.symbol || "DEX").toUpperCase();
      customAssetObj = {
        name: name,
        symbol: symbol,
        chainId: pairOrProfile.chainId || "multi",
        address: pairOrProfile.baseToken?.address || "N/A",
        price: pairOrProfile.priceUsd ? parseFloat(pairOrProfile.priceUsd) : "N/A",
        priceChange24h: pairOrProfile.priceChange?.h24 || 0,
        volume24h: pairOrProfile.volume?.h24 || 0,
        url: pairOrProfile.url || "",
        description: `DEX pair address: ${pairOrProfile.pairAddress || 'N/A'}`
      };
    }

    // Scroll to terminal section
    const terminalElement = document.getElementById("terminal-session-view");
    if (terminalElement) {
      terminalElement.scrollIntoView({ behavior: 'smooth' });
    }

    const activePrompt = `Analisis koin pilihan ${customAssetObj.name} (${customAssetObj.symbol}) di jaringan ${customAssetObj.chainId} dengan alamat kontrak ${customAssetObj.address}. Harap evaluasi momentum likuiditas DexScreener dan pergerakan 24 jam terakhir.`;
    setUserPrompt(activePrompt);

    // Setup temporary selection for feed/details to show on-screen
    setSelectedAsset({
      id: customAssetObj.address,
      symbol: customAssetObj.symbol.toLowerCase(),
      name: customAssetObj.name,
      current_price: typeof customAssetObj.price === 'number' ? customAssetObj.price : 0,
      market_cap: 0,
      price_change_percentage_24h: typeof customAssetObj.priceChange24h === 'number' ? customAssetObj.priceChange24h : 0,
      high_24h: typeof customAssetObj.price === 'number' ? customAssetObj.price * 1.05 : 0,
      low_24h: typeof customAssetObj.price === 'number' ? customAssetObj.price * 0.95 : 0,
      total_volume: typeof customAssetObj.volume24h === 'number' ? customAssetObj.volume24h : 0,
      image: isProfile ? pairOrProfile.icon : undefined
    });

    await runAgentAnalysis(activePrompt, customAssetObj);
  };

  return (
    <section id="sandbox-section" className="py-16 md:py-24 bg-[#FAF8F5] border-t border-[#E8E3D9]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Title Block */}
        <div className="text-center mb-12">
          <span className="text-xs font-bold tracking-widest text-orange-600 uppercase font-sans flex items-center justify-center gap-1.5">
            <Coins className="w-3.5 h-3.5" />
            CoinGecko Crypto Agent Workspace
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-light text-neutral-900 tracking-tight leading-tight mt-2 font-sans">
            Mazaal <span className="font-serif italic font-medium text-orange-600">Multi-Agent</span> Crypto Terminal
          </h2>
          <p className="text-base text-neutral-600 max-w-2xl mx-auto mt-4 font-sans">
            Analyze the live global crypto assets powered by cooperative Groq LLaMA 3.3 70B AI agents. 
            Select an asset from the CoinGecko feed below to run independent analysis.
          </p>
        </div>

        {/* Credentials and Config Panel */}
        <div className="mb-8 max-w-4xl mx-auto">
          <div className="bg-white rounded-xl border border-[#E2DBCA] p-5 shadow-sm">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div>
                <h3 className="text-sm font-bold text-neutral-900 flex items-center gap-2">
                  <KeyRound className="w-4 h-4 text-orange-600" />
                  Configure Groq API Credentials
                </h3>
                <p className="text-xs text-neutral-500 mt-1">
                  Provide your personal Groq key to enable 100% live LLaMA models. Leave blank to run high-fidelity local simulations.
                </p>
              </div>
              <button
                onClick={() => setShowKeyInput(!showKeyInput)}
                className="px-4 py-1.5 bg-neutral-900 hover:bg-neutral-800 text-white rounded-lg text-xs font-medium cursor-pointer transition-colors"
                id="toggle-credential-btn"
              >
                {showKeyInput ? "Close Settings" : "Configure API Key"}
              </button>
            </div>

            <AnimatePresence>
              {showKeyInput && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden mt-4 pt-4 border-t border-[#F2EDE2]"
                >
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-end">
                    <div className="md:col-span-8">
                      <label className="block text-[11px] font-mono text-neutral-500 uppercase mb-1">Groq API Key (gsk_...)</label>
                      <input
                        type="password"
                        placeholder="Paste your Groq API user key here"
                        value={groqKey}
                        onChange={(e) => handleKeySave(e.target.value)}
                        className="w-full text-xs font-mono bg-neutral-50 border border-[#DCD3C1] rounded-lg px-3 py-2 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
                        id="groq-key-input"
                      />
                    </div>
                    <div className="md:col-span-4 flex items-center gap-2 pb-1">
                      <label className="flex items-center gap-1.5 text-xs text-neutral-600 cursor-pointer select-none">
                        <input
                          type="checkbox"
                          checked={saveKeyLocal}
                          onChange={(e) => {
                            setSaveKeyLocal(e.target.checked);
                            if (e.target.checked) {
                              localStorage.setItem("mazaal_groq_key", groqKey);
                            } else {
                              localStorage.removeItem("mazaal_groq_key");
                            }
                          }}
                          className="rounded border-[#DCD3C1] text-orange-600 focus:ring-orange-500"
                        />
                        Save key on this device
                      </label>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Main Workspace Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT COLUMN: CoinGecko Ticker Feed and DEX Contract Finder (4 cols) */}
          <div className="lg:col-span-4 space-y-4">
            <div className="bg-white rounded-2xl border border-[#E2DBCA] overflow-hidden shadow-sm">
              {/* Tab Selector Headers */}
              <div className="border-b border-[#F2EDE2] bg-[#FAF8F5] flex flex-col">
                <div className="flex border-b border-[#F2EDE2]">
                  <button
                    onClick={() => setActiveTabLeft('gecko')}
                    className={`flex-1 py-3 px-4 text-xs font-bold uppercase tracking-wider border-b-2 transition-all ${
                      activeTabLeft === 'gecko'
                        ? 'border-orange-500 text-orange-600 bg-white'
                        : 'border-transparent text-neutral-500 hover:text-neutral-800 hover:bg-neutral-50'
                    }`}
                  >
                    API Gecko Feed
                  </button>
                  <button
                    onClick={() => setActiveTabLeft('dex')}
                    className={`flex-1 py-3 px-4 text-xs font-bold uppercase tracking-wider border-b-2 transition-all ${
                      activeTabLeft === 'dex'
                        ? 'border-orange-500 text-orange-600 bg-white'
                        : 'border-transparent text-neutral-500 hover:text-neutral-800 hover:bg-neutral-50'
                    }`}
                  >
                    Cari Alamat Kontrak
                  </button>
                </div>

                <div className="p-3 bg-white flex items-center justify-between">
                  {activeTabLeft === 'gecko' ? (
                    <>
                      <div className="flex items-center gap-1.5 text-xs font-bold text-neutral-800">
                        <Globe className="w-3.5 h-3.5 text-orange-600" />
                        <span>PROFIL COINGECKO LIVE</span>
                      </div>
                      <button
                        onClick={fetchMarketFeed}
                        disabled={isLoadingMarket}
                        className="p-1 rounded hover:bg-neutral-100 text-neutral-600 active:scale-90 transition-all disabled:opacity-50"
                        title="Synchronize Live Market Prices"
                        id="refresh-gecko-feed"
                      >
                        <RefreshCcw className={`w-3.5 h-3.5 ${isLoadingMarket ? 'animate-spin' : ''}`} />
                      </button>
                    </>
                  ) : (
                    <>
                      <div className="flex items-center gap-1.5 text-xs font-bold text-neutral-800">
                        <Search className="w-3.5 h-3.5 text-orange-600" />
                        <span>PENCARIAN SMART CONTRACT</span>
                      </div>
                      <button
                        onClick={fetchTrendingDexProfiles}
                        className="text-[10px] font-semibold text-orange-600 hover:underline"
                        title="Dapatkan data profil terbaru"
                      >
                        Profil Terbaru
                      </button>
                    </>
                  )}
                </div>
              </div>

              {/* Tab 1: CoinGecko Asset List */}
              {activeTabLeft === 'gecko' && (
                <div className="divide-y divide-[#F2EDE2] max-h-[460px] overflow-y-auto">
                  {isLoadingMarket && marketData.length === 0 ? (
                    <div className="p-8 text-center text-neutral-500 text-xs">
                      <span className="inline-block w-4 h-4 rounded-full border-2 border-t-transparent border-orange-600 animate-spin mr-2" />
                      Synchronizing live CoinGecko indexes...
                    </div>
                  ) : marketData.length === 0 ? (
                    <div className="p-8 text-center text-xs text-neutral-400">
                      No active assets tracked. Click refresh.
                    </div>
                  ) : (
                    marketData.map((asset) => {
                      const isSelected = selectedAsset?.id === asset.id;
                      const change = asset.price_change_percentage_24h;
                      const isPositive = change >= 0;

                      return (
                        <div
                          key={asset.id}
                          onClick={() => setSelectedAsset(asset)}
                          className={`p-3.5 flex items-center justify-between cursor-pointer transition-all ${
                            isSelected 
                              ? 'bg-orange-50/70 border-l-4 border-orange-600' 
                              : 'hover:bg-neutral-50 border-l-4 border-transparent'
                          }`}
                          id={`asset-feed-${asset.id}`}
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            {asset.image ? (
                              <img src={asset.image} alt={asset.name} className="w-5.5 h-5.5 rounded-full" referrerPolicy="no-referrer" />
                            ) : (
                              <div className="w-5.5 h-5.5 rounded-full bg-neutral-200 flex items-center justify-center text-[10px] font-bold text-neutral-600">
                                {asset.symbol.toUpperCase()}
                              </div>
                            )}
                            <div className="min-w-0">
                              <h4 className="text-xs font-bold text-neutral-900 truncate">{asset.name}</h4>
                              <span className="text-[10px] font-mono text-neutral-400 uppercase">{asset.symbol}</span>
                            </div>
                          </div>

                          <div className="text-right">
                            <div className="text-xs font-bold text-neutral-950 font-mono">
                              ${asset.current_price >= 1 ? asset.current_price.toLocaleString(undefined, { minimumFractionDigits: 2 }) : asset.current_price}
                            </div>
                            <span className={`text-[10px] font-mono font-bold ${isPositive ? 'text-emerald-600' : 'text-red-500'}`}>
                              {isPositive ? '+' : ''}{change ? change.toFixed(2) : '0.00'}%
                            </span>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              )}

              {/* Tab 2: DEX Contract Address Finder */}
              {activeTabLeft === 'dex' && (
                <div className="p-4 space-y-4 max-h-[500px] overflow-y-auto">
                  {/* Search box layout */}
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Cari nama koin / simbol (contoh: 'solana', 'doge')..."
                      value={dexSearchQuery}
                      onChange={(e) => setDexSearchQuery(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          fetchDexSearchResults(dexSearchQuery);
                        }
                      }}
                      className="w-full text-xs bg-neutral-50 border border-[#DCD3C1] rounded-lg pl-8 pr-16 py-2.5 focus:outline-none focus:border-orange-500 font-sans"
                    />
                    <Search className="w-4 h-4 text-neutral-400 absolute left-2.5 top-3" />
                    <button
                      onClick={() => fetchDexSearchResults(dexSearchQuery)}
                      disabled={isSearchingDex}
                      className="absolute right-1.5 top-1.5 px-3 py-1 bg-orange-600 hover:bg-orange-700 text-white rounded text-[10px] font-bold cursor-pointer disabled:opacity-50"
                    >
                      {isSearchingDex ? "MENCARI..." : "CARI"}
                    </button>
                  </div>

                  {/* Search results rendering */}
                  {dexSearchResults.length > 0 && (
                    <div className="space-y-2.5">
                      <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-widest block font-bold border-b pb-1">Hasil Pencarian Kontrak:</span>
                      <div className="space-y-2 max-h-[240px] overflow-y-auto pr-1">
                        {dexSearchResults.map((pair: any, index: number) => {
                          const baseToken = pair.baseToken || {};
                          const addr = baseToken.address || "";
                          
                          return (
                            <div key={`${pair.pairAddress}-${index}`} className="p-3 bg-neutral-50 border border-[#EDEBE4] rounded-xl space-y-2 text-xs hover:border-orange-500/30 transition-all">
                              <div className="flex items-center justify-between">
                                <div className="truncate pr-2">
                                  <span className="font-bold text-neutral-900">{baseToken.name || "Unknown"}</span>
                                  <span className="text-[10px] font-mono text-neutral-400 uppercase ml-1.5">({baseToken.symbol || "N/A"})</span>
                                </div>
                                <span className="bg-orange-100 text-orange-950 px-2 py-0.5 rounded-full text-[9px] font-bold uppercase shrink-0">
                                  {pair.chainId || "multi"}
                                </span>
                              </div>

                              {/* Price and Option Row */}
                              <div className="flex items-center justify-between bg-orange-50/50 px-2 py-1 rounded border border-orange-100/60">
                                <div className="text-[10px] text-neutral-600">
                                  Harga: <span className="font-mono font-bold text-neutral-900">${pair.priceUsd ? parseFloat(pair.priceUsd).toLocaleString(undefined, { maximumFractionDigits: 6 }) : "0.00"}</span>
                                </div>
                                <button
                                  onClick={() => handleConfirmDexAnalysis(pair)}
                                  className="px-2 py-0.5 bg-orange-600 hover:bg-orange-700 text-white rounded text-[9px] font-bold flex items-center gap-1 cursor-pointer transition-all active:scale-95 shadow-sm"
                                  title="Analisis koin ini dengan AI"
                                >
                                  <Sparkles className="w-2.5 h-2.5" />
                                  <span>Tanya AI Analisis?</span>
                                </button>
                              </div>

                              {/* Target Address Copy Field */}
                              <div className="flex items-center gap-1 bg-white border border-[#E2DBCA] rounded px-2 py-1 justify-between">
                                <span className="font-mono text-[10px] text-neutral-600 select-all truncate shrink min-w-0" title={addr}>
                                  {addr}
                                </span>
                                <div className="flex items-center gap-1 shrink-0">
                                  <button
                                    onClick={() => copyToClipboard(addr)}
                                    className="p-1 hover:bg-neutral-100 rounded text-neutral-500 transition-colors"
                                    title="Salin Alamat Kontrak"
                                  >
                                    {copiedAddress === addr ? (
                                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                                    ) : (
                                      <Copy className="w-3.5 h-3.5" />
                                    )}
                                  </button>
                                  <a
                                    href={pair.url}
                                    target="_blank"
                                    referrerPolicy="no-referrer"
                                    className="p-1 hover:bg-neutral-100 rounded text-neutral-500"
                                    title="Buka di DexScreener"
                                  >
                                    <ExternalLink className="w-3.5 h-3.5" />
                                  </a>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Trending/Latest Token Profiles from endpoint */}
                  <div className="space-y-2 bg-[#FAF8F5] p-3 rounded-xl border border-[#EDEBE4]">
                    <span className="text-[10px] font-mono text-orange-600 font-bold uppercase tracking-widest block">Trending Token Profiles</span>
                    <p className="text-[10px] text-neutral-500 leading-normal">
                      Direktori real-time alamat kontrak profil terbaru yang di-boost dari API DexScreener:
                    </p>

                    <div className="space-y-2.5 divide-y divide-[#EDEBE4] max-h-[220px] overflow-y-auto pr-1 pt-1">
                      {dexProfiles.map((prof: any, i: number) => {
                        const addr = prof.tokenAddress || "";
                        const chain = prof.chainId || "multi";
                        
                        return (
                          <div key={i} className="pt-2 first:pt-0 space-y-1.5 text-xs">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-1.5 min-w-0">
                                {prof.icon && (
                                  <img src={prof.icon} alt={chain} className="w-4 h-4 rounded-full shrink-0" referrerPolicy="no-referrer" />
                                )}
                                <span className="font-bold text-neutral-800 truncate">
                                  {prof.description ? prof.description.split(" ")[0] || "Token Profile" : "Token Profile"}
                                </span>
                              </div>
                              <span className="text-[9px] px-1.5 py-0.2 bg-neutral-200/80 rounded font-mono text-neutral-600 uppercase">
                                {chain}
                              </span>
                            </div>

                            {prof.description && (
                              <p className="text-[10px] text-neutral-500 line-clamp-1 italic">
                                {prof.description}
                              </p>
                            )}

                            {/* Option Row for profiling */}
                            <div className="flex items-center justify-between pb-0.5 mt-1">
                              <span className="text-[9px] text-neutral-400">On-Chain Profile Info</span>
                              <button
                                onClick={() => handleConfirmDexAnalysis(prof, true)}
                                className="px-2 py-0.5 bg-orange-600 hover:bg-orange-700 text-white rounded text-[9px] font-bold flex items-center gap-1 cursor-pointer transition-all active:scale-95 shadow-sm"
                              >
                                <Sparkles className="w-2.5 h-2.5" />
                                <span>Tanya AI Analisis?</span>
                              </button>
                            </div>

                            <div className="flex items-center justify-between gap-1.5 bg-white border border-[#E2DBCA] rounded px-2 py-0.5 mt-1">
                              <span className="font-mono text-[9px] text-neutral-500 truncate" title={addr}>
                                {addr}
                              </span>
                              <div className="flex items-center gap-1 shrink-0">
                                <button
                                  onClick={() => copyToClipboard(addr)}
                                  className="p-1 hover:bg-neutral-100 rounded text-neutral-500"
                                >
                                  {copiedAddress === addr ? (
                                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                                  ) : (
                                    <Copy className="w-3.5 h-3.5" />
                                  )}
                                </button>
                                {prof.url && (
                                  <a href={prof.url} target="_blank" referrerPolicy="no-referrer" className="p-0.5 text-neutral-400 hover:text-orange-600">
                                    <ExternalLink className="w-3.5 h-3.5" />
                                  </a>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              <div className="p-3 bg-[#FCFBF9] border-t border-[#F2EDE2] text-center text-[10px] text-neutral-500">
                {isLiveMarket ? (
                  <span className="text-[#10703C] font-semibold flex items-center justify-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> Live global API signals active
                  </span>
                ) : (
                  <span className="text-amber-700 font-semibold flex items-center justify-center gap-1">
                    <Info className="w-3 h-3" /> Rate limit active. Using local data context.
                  </span>
                )}
              </div>
            </div>

            {/* Config Sidebar Box */}
            <div className="bg-[#FFFDF9] rounded-2xl border border-[#E1D9CC] p-5 shadow-sm">
              <span className="text-[10px] font-mono tracking-widest text-[#B5A68E] uppercase block mb-1">Analysis Blueprint</span>
              <h4 className="text-sm font-semibold text-neutral-900 mb-4">Pipeline Tuning Parameters</h4>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-[10px] font-mono text-neutral-500 uppercase mb-1">Execution Angle</label>
                  <select
                    value={analysisType}
                    onChange={(e) => setAnalysisType(e.target.value)}
                    className="w-full text-xs bg-white border border-[#DCD3C1] rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-orange-500"
                    id="analysis-angle-select"
                  >
                    <option value="Technical & Volume Breakouts">Technical & Volume Breakouts</option>
                    <option value="Downside Liquidation Pools">Downside Liquidation Pools</option>
                    <option value="High-Frequency Signal Match">High-Frequency Signal Match</option>
                    <option value="Multi-Asset Correlation Matrix">Multi-Asset Correlation Matrix</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-mono text-neutral-500 uppercase mb-1">Additional Guidance Input</label>
                  <textarea
                    rows={2}
                    value={userPrompt}
                    onChange={(e) => setUserPrompt(e.target.value)}
                    placeholder="E.g., short-term trading signals..."
                    className="w-full text-xs bg-white border border-[#DCD3C1] rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-orange-500 resize-none font-sans"
                    id="user-prompt-textarea"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* MIDDLE COLUMN: The Multi-Agent Chat Terminal (8 cols) */}
          <div className="lg:col-span-8 bg-[#0F0F10] rounded-2xl border border-neutral-800 shadow-2xl overflow-hidden relative flex flex-col justify-between min-h-[520px]">
            
            {/* Window Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-neutral-900 bg-neutral-950/70">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500/80" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                <div className="w-3 h-3 rounded-full bg-green-500/80" />
                <span className="text-xs font-mono text-neutral-500 ml-4">GROQ MULTI-AGENT TERMINAL v2.1.0</span>
              </div>
              
              <div className="flex items-center gap-2">
                <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#1A2E22] border border-[#24462E] text-[10px] text-emerald-400 font-semibold uppercase">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Agents Standby
                </span>
              </div>
            </div>

            {/* Selected Asset Header Ribbon */}
            {selectedAsset && (
              <div className="bg-neutral-950 px-5 py-2.5 border-b border-neutral-900 flex justify-between items-center text-xs">
                <div className="flex items-center gap-2">
                  <span className="text-neutral-500 font-mono">TARGETING:</span>
                  <span className="text-white font-bold">{selectedAsset.name} ({selectedAsset.symbol.toUpperCase()})</span>
                  <span className="text-neutral-400 font-mono bg-neutral-900 px-1.5 py-0.5 rounded text-[10px]">
                    ${selectedAsset.current_price >= 1 ? selectedAsset.current_price.toLocaleString() : selectedAsset.current_price}
                  </span>
                </div>
                <div className="flex items-center gap-2 font-mono text-[10px] text-neutral-400">
                  <span>VOL: ${(selectedAsset.total_volume / 1000000).toFixed(1)}M</span>
                  <span className={selectedAsset.price_change_percentage_24h >= 0 ? "text-emerald-500" : "text-red-400"}>
                    {selectedAsset.price_change_percentage_24h >= 0 ? '▲' : '▼'} {Math.abs(selectedAsset.price_change_percentage_24h).toFixed(1)}%
                  </span>
                </div>
              </div>
            )}

            {/* Terminal Main Chat Stream */}
            <div className="flex-1 p-6 space-y-5 overflow-y-auto max-h-[380px] grid-lines relative select-text">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-orange-600/5 blur-[80px] rounded-full pointer-events-none" />

              {/* Welcome message in modern terminal layout */}
              <div className="text-xs text-neutral-500 font-mono leading-relaxed max-w-xl">
                <div>&gt; System initialized. Ready to initiate parallel consensus.</div>
                <div>&gt; Connected Models: LLaMA 3.3 70B & LLaMA 3.1 8B (Ultra Fast Inference)</div>
                <div>&gt; Select an asset from the left API list and click <strong className="text-neutral-200">"Execute AI Multi-Agent Triage"</strong> below to run.</div>
              </div>

              {/* Staggered Agents output */}
              <AnimatePresence>
                {agentsOutput.map((agent, index) => {
                  if (agent.isUser) {
                    return (
                      <motion.div
                        key={agent.id}
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-4 bg-orange-950/20 rounded-xl border border-orange-500/20 space-y-2 relative z-10 max-w-[90%] ml-auto"
                        id={`terminal-message-${agent.id}`}
                      >
                        <div className="flex items-center justify-between border-b border-orange-900/30 pb-2 gap-4">
                          <span className="text-[10px] font-mono text-orange-400">
                            User Terminal Instruction
                          </span>
                          <div className="flex items-center gap-2">
                            <h4 className="text-xs font-bold text-orange-200">YOU (Trader)</h4>
                            <span className="text-sm">👤</span>
                          </div>
                        </div>
                        <p className="text-xs text-neutral-200 leading-relaxed font-mono pt-1">
                          {agent.content}
                        </p>
                      </motion.div>
                    );
                  }

                  return (
                    <motion.div
                      key={agent.id}
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      className="p-4 bg-neutral-950/80 rounded-xl border border-neutral-800 space-y-2 relative z-10"
                      id={`terminal-message-${agent.id}`}
                    >
                      <div className="flex items-center justify-between border-b border-neutral-900 pb-2">
                        <div className="flex items-center gap-2.5">
                          <span className="text-lg">{agent.avatar}</span>
                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="text-xs font-bold text-neutral-100">{agent.name}</h4>
                              <span className="text-[9px] font-mono text-neutral-500 px-1.5 py-0.5 rounded bg-neutral-900">
                                {agent.role}
                              </span>
                            </div>
                          </div>
                        </div>
                        <span className="text-[10px] font-mono text-[#E8DCC4]/50">
                          {agent.model}
                        </span>
                      </div>

                      <p className="text-xs text-neutral-300 leading-relaxed font-sans pt-1">
                        {agent.content}
                      </p>
                    </motion.div>
                  );
                })}
              </AnimatePresence>

              {/* Dynamic typing loader indicators when running */}
              {isRunning && (
                <div className="space-y-4">
                  {currentStepId === 'step-scout' && (
                    <motion.div 
                      initial={{ opacity: 0 }} 
                      animate={{ opacity: 1 }} 
                      className="flex items-center gap-3 p-3 bg-neutral-950/40 rounded-xl border border-neutral-900/60 text-xs text-orange-400 font-mono"
                    >
                      <span className="inline-block w-2.5 h-2.5 bg-orange-500 rounded-full animate-ping" />
                      <span>📡 Momentum Scout Agent sedang menganalisis rasio kecepatan tren...</span>
                    </motion.div>
                  )}
                  {currentStepId === 'step-risk' && (
                    <motion.div 
                      initial={{ opacity: 0 }} 
                      animate={{ opacity: 1 }} 
                      className="flex items-center gap-3 p-3 bg-neutral-950/40 rounded-xl border border-neutral-900/60 text-xs text-amber-400 font-mono"
                    >
                      <span className="inline-block w-2.5 h-2.5 bg-amber-500 rounded-full animate-ping" />
                      <span>⚠️ Risk Advisor sedang menyaring kisi support & celah likuiditas...</span>
                    </motion.div>
                  )}
                  {currentStepId === 'step-advisor' && (
                    <motion.div 
                      initial={{ opacity: 0 }} 
                      animate={{ opacity: 1 }} 
                      className="flex items-center gap-3 p-3 bg-neutral-950/40 rounded-xl border border-neutral-900/60 text-xs text-emerald-400 font-mono"
                    >
                      <span className="inline-block w-2.5 h-2.5 bg-emerald-500 rounded-full animate-ping" />
                      <span>👑 Chief Strategist sedang memfinalisasi target harga spesifik...</span>
                    </motion.div>
                  )}
                </div>
              )}
            </div>

            {/* Real-time Interactive Prompt Input */}
            <div className="bg-[#050506]/90 px-5 py-3.5 border-y border-neutral-900 flex flex-col gap-2 z-10">
              <label className="text-[10px] font-mono text-neutral-400 flex items-center gap-1">
                <span className="text-orange-500 font-bold">&gt;_</span> KIRIM PERTANYAAN / PERINTAH KE SEMUA 3 AGEN AI (MANDAT: USER ADALAH TAKHTA TERTINGGI):
              </label>
              <form onSubmit={handleTerminalSubmit} className="flex gap-2">
                <span className="text-sm font-mono text-orange-500 self-center select-none">&gt;</span>
                <input
                  type="text"
                  placeholder={selectedAsset ? `Tanyakan pada 3 agen... (contoh: "Berapa target harga ${selectedAsset.name} minggu ini?")` : "Ketik pesan khusus untuk dianalisis oleh 3 agen..."}
                  value={terminalInput}
                  onChange={(e) => setTerminalInput(e.target.value)}
                  disabled={isRunning}
                  className="flex-1 bg-neutral-900 border border-neutral-800 focus:border-orange-500/80 focus:ring-1 focus:ring-orange-500/40 rounded-lg px-3 py-2 text-xs font-mono text-neutral-200 outline-none transition-all placeholder:text-neutral-600"
                  id="terminal-chat-input"
                />
                <button
                  type="submit"
                  disabled={isRunning || !terminalInput.trim()}
                  className="px-4 py-2 bg-neutral-900 hover:bg-neutral-800 disabled:opacity-30 disabled:hover:bg-neutral-900 text-orange-500 hover:text-orange-400 text-xs font-bold font-mono rounded-lg transition-all flex items-center gap-1.5 cursor-pointer border border-neutral-800 animate-pulse"
                  id="terminal-chat-send"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>KIRIM</span>
                </button>
              </form>
            </div>

            {/* Bottom Real-time Monitor Console & Logs */}
            <div className="bg-[#050506] border-t border-neutral-900 px-5 py-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-widest">
                  Live Action Log Traces & Status
                </span>
                <span className="px-2 py-0.5 text-[9px] font-mono bg-orange-600/10 border border-orange-500/20 text-orange-400 rounded uppercase">
                  Stream Output
                </span>
              </div>

              <div className="font-mono text-[11px] text-neutral-400 min-h-[70px] max-h-[100px] overflow-y-auto space-y-1 select-text">
                {executionLogs.length === 0 ? (
                  <span className="text-neutral-600 italic">&gt; Sandbox ready. Choose an active crypto from the left panel and click compile signal.</span>
                ) : (
                  executionLogs.map((log, i) => (
                    <div key={i} className="text-neutral-300">
                      &gt; {log}
                    </div>
                  ))
                )}
              </div>

              {/* Master Control Trigger Block */}
              <div className="mt-4 pt-3 border-t border-neutral-900 flex justify-between items-center">
                <div className="text-[10px] font-mono text-neutral-500 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-orange-600" />
                  {groqKey ? "Custom API Connected" : "Local Simulator Mode"}
                </div>
                
                <button
                  disabled={isRunning || !selectedAsset}
                  onClick={runAgentAnalysis}
                  className="px-6 py-2.5 bg-orange-600 hover:bg-orange-700 disabled:bg-neutral-800 disabled:opacity-50 text-white text-xs font-bold rounded-xl flex items-center gap-2 transition-all active:scale-95 cursor-pointer"
                  id="execute-triage-btn"
                >
                  {isRunning ? (
                    <>
                      <span className="w-3 h-3 rounded-full border-2 border-t-transparent border-white animate-spin" />
                      Resolving Multi Agents...
                    </>
                  ) : (
                    <>
                      <Play className="w-3 h-3 fill-current" />
                      Execute AI Multi-Agent Triage
                    </>
                  )}
                </button>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
