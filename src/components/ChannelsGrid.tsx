import { useState, FormEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  CHANNELS 
} from '../data';
import { 
  ChannelItem 
} from '../types';
import { 
  MessageSquare, Smartphone, Code, GitPullRequest, Slack,
  Hash, Send, MessageCircle, Facebook, Instagram, Twitter, 
  Linkedin, Mail, Mic, Share2, HelpCircle, ArrowRight, Play, Check, AlertCircle
} from 'lucide-react';

export default function ChannelsGrid() {
  const [activeChannel, setActiveChannel] = useState<ChannelItem | null>(CHANNELS[0]);
  const [copied, setCopied] = useState(false);
  
  // Interactive Chat simulation variables
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState<Array<{ sender: 'user' | 'bot', text: string }>>([
    { sender: 'bot', text: 'Hi! I am your corporate Mazaal AI agent. I am live on this channel. How can I help you today?' }
  ]);
  const [isTyping, setIsTyping] = useState(false);

  // Helper to map icon name to Lucide icons
  const renderIcon = (name: string, className: string) => {
    switch(name) {
      case 'MessageSquare': return <MessageSquare className={className} />;
      case 'Smartphone': return <Smartphone className={className} />;
      case 'Code': return <Code className={className} />;
      case 'GitPullRequest': return <GitPullRequest className={className} />;
      case 'Slack': return <Slack className={className} />;
      case 'Hash': return <Hash className={className} />;
      case 'Send': return <Send className={className} />;
      case 'MessageCircle': return <MessageCircle className={className} />;
      case 'Facebook': return <Facebook className={className} />;
      case 'Instagram': return <Instagram className={className} />;
      case 'Twitter': return <Twitter className={className} />;
      case 'Linkedin': return <Linkedin className={className} />;
      case 'Mail': return <Mail className={className} />;
      case 'Mic': return <Mic className={className} />;
      case 'Share2': return <Share2 className={className} />;
      default: return <MessageSquare className={className} />;
    }
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const selectChannel = (channel: ChannelItem) => {
    setActiveChannel(channel);
    // Reset chat simulation context
    setChatMessages([
      { sender: 'bot', text: `Hi! I am your corporate Mazaal AI agent. I am live on this channel (${channel.title}). How can I help you today?` }
    ]);
    setChatInput('');
    setIsTyping(false);
  };

  const sendChatMessage = (e?: FormEvent) => {
    if (e) e.preventDefault();
    if (!chatInput.trim() || isTyping) return;

    const userMsg = chatInput.trim();
    setChatMessages(prev => [...prev, { sender: 'user', text: userMsg }]);
    setChatInput('');
    setIsTyping(true);

    // Dynamic mock response generations
    setTimeout(() => {
      let botResponse = "Checking database... Done. That has been successfully updated on our ledger. Can I assist with anything else?";
      if (userMsg.toLowerCase().includes('invoice') || userMsg.toLowerCase().includes('charge') || userMsg.toLowerCase().includes('bill')) {
        botResponse = "Searching Stripe... Found charge #ch_4912ha for $49.00. Refund approved. The reference ID is ref_mzl_91823. Sent confirmation!";
      } else if (userMsg.toLowerCase().includes('slug') || userMsg.toLowerCase().includes('api') || userMsg.toLowerCase().includes('auth')) {
        botResponse = "API Authorization granted for credentials mzl_prod_9918. Active rate limits: 10,000 req/min.";
      }
      setChatMessages(prev => [...prev, { sender: 'bot', text: botResponse }]);
      setIsTyping(false);
    }, 1200);
  };

  return (
    <section id="channels-section" className="py-20 lg:py-28 bg-[#FAF8F5] border-b border-[#E8E3D9]/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Label */}
        <div className="flex items-center gap-4 mb-2">
          <span className="font-serif italic font-medium text-4xl text-orange-600 block leading-none">02</span>
          <div>
            <span className="block text-[10px] tracking-[0.2em] font-bold text-[#A29783] uppercase leading-none">SIXTEEN CHANNELS</span>
            <span className="block text-[9px] font-mono tracking-wider text-neutral-500 uppercase mt-0.5">One dynamic centralized agent</span>
          </div>
        </div>

        {/* Heading */}
        <div className="mb-14">
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-light text-neutral-900 tracking-tight leading-tight font-sans">
            Build it once. It shows up <br className="sm:hidden" />
            <span className="font-serif italic text-orange-600 font-medium">everywhere</span> your customers do.
          </h2>
          <p className="text-base text-neutral-600 max-w-2xl mt-4 font-normal leading-relaxed">
            Customers don't all live in one inbox. Teammates don't either. Build the core agent logic once, 
            it deploys instantly across every channel below. No re-building code. No logic drift.
          </p>
        </div>

        {/* Two-Column Showcase Area */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Grid: 16 small channel blocks (7 cols) */}
          <div className="lg:col-span-7">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {CHANNELS.map((channel) => {
                const isActive = activeChannel?.id === channel.id;
                return (
                  <button
                    key={channel.id}
                    onClick={() => selectChannel(channel)}
                    className={`p-4 rounded-xl border flex flex-col justify-between text-left h-32 transition-all duration-300 relative cursor-pointer group ${
                      isActive 
                        ? `${channel.color} bg-white shadow-md ring-1 ring-neutral-300 scale-[1.02] z-10`
                        : 'border-[#E8E3D9] hover:border-neutral-400 bg-white/70 hover:bg-white hover:-translate-y-0.5'
                    }`}
                  >
                    {/* Top row with Category and Number */}
                    <div className="flex items-center justify-between w-full">
                      <span className={`text-[8px] font-extrabold tracking-widest uppercase font-mono px-1.5 py-0.5 rounded border ${
                        isActive ? channel.textCol : 'text-neutral-500 border-neutral-200'
                      }`}>
                        {channel.category}
                      </span>
                      <span className="text-[10px] font-mono text-neutral-400">
                        {channel.number}
                      </span>
                    </div>

                    {/* Content */}
                    <div className="mt-auto">
                      <div className="flex items-center gap-2 mb-1">
                        {renderIcon(channel.iconName, `w-4 h-4 ${isActive ? channel.textCol : 'text-neutral-500 group-hover:text-black transition-colors'}`)}
                        <h4 className="text-xs font-bold text-neutral-800 line-clamp-1">{channel.title}</h4>
                      </div>
                    </div>

                    {/* Accent border highlight on bottom */}
                    <div className={`absolute bottom-0 left-0 right-0 h-1 rounded-b-xl border-b border-t-0 border-l-0 border-r-0 ${channel.color} opacity-0 ${isActive ? 'opacity-100' : 'group-hover:opacity-50'} transition-opacity`} />
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right Showcase: Realtime Embedded Channel Simulation Previewer (5 cols) */}
          <div className="lg:col-span-5">
            <div className="bg-[#FFFDFB] rounded-2xl border border-[#ECE5D9] p-6 shadow-sm min-h-[500px] flex flex-col justify-between hover:shadow-md transition-shadow">
              
              {/* Simulator Header */}
              {activeChannel && (
                <div>
                  <div className="flex items-center justify-between pb-4 border-b border-[#ECE5D9] mb-5">
                    <div className="flex items-center gap-2.5">
                      <div className={`p-2 rounded-lg bg-orange-50 border ${activeChannel.color}`}>
                        {renderIcon(activeChannel.iconName, `w-5 h-5 ${activeChannel.textCol}`)}
                      </div>
                      <div>
                        <span className="text-[9px] font-mono tracking-widest text-[#B5A68E] block">CHANNEL SIMULATOR</span>
                        <h3 className="text-base font-bold text-neutral-900 font-sans leading-none mt-1">
                          {activeChannel.title} Integration
                        </h3>
                      </div>
                    </div>
                    <span className="text-xs font-mono font-medium text-neutral-400">Live test</span>
                  </div>

                  <p className="text-xs text-neutral-600 leading-relaxed mb-6 font-normal">
                    {activeChannel.description}
                  </p>

                  <div className="h-px bg-[#EFEFE9] w-full my-4" />

                  {/* CUSTOM DISPLAY BASED ON CHANNEL TYPE */}
                  {(activeChannel.category === 'EMBED' && activeChannel.title === 'Web widget') || activeChannel.category === 'MESSAGING' ? (
                    
                    /* Chat/Messaging Simulator Layout */
                    <div className="border border-[#E4DDD0] rounded-xl bg-[#FAF8F5] overflow-hidden">
                      {/* Sub header for internal mockup */}
                      <div className="bg-neutral-900 text-white px-4 py-2.5 flex items-center justify-between text-xs font-sans">
                        <div className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-emerald-500 breathing" />
                          <span className="font-semibold">{activeChannel.title} Sandbox Applet</span>
                        </div>
                        <span className="text-[10px] text-neutral-400 font-mono">Agent ID: mz_922</span>
                      </div>

                      {/* Mock Messages Flow Area */}
                      <div className="p-4 space-y-3 max-h-[220px] min-h-[170px] overflow-y-auto font-sans text-xs">
                        {chatMessages.map((msg, index) => (
                          <div 
                            key={index} 
                            className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                          >
                            <div 
                              className={`max-w-[85%] rounded-lg px-3 py-2 leading-relaxed ${
                                msg.sender === 'user' 
                                  ? 'bg-neutral-900 text-white rounded-br-none' 
                                  : 'bg-white border border-[#DDD5C7] text-neutral-800 rounded-bl-none shadow-sm'
                              }`}
                            >
                              <p className="font-sans font-medium">{msg.text}</p>
                            </div>
                          </div>
                        ))}
                        {isTyping && (
                          <div className="flex justify-start">
                            <div className="bg-white border border-[#DDD5C7] rounded-lg px-3 py-2 rounded-bl-none shadow-sm text-neutral-500 font-medium">
                              <span className="inline-flex gap-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-neutral-400 animate-bounce" />
                                <span className="w-1.5 h-1.5 rounded-full bg-neutral-400 animate-bounce [animation-delay:0.2s]" />
                                <span className="w-1.5 h-1.5 rounded-full bg-neutral-400 animate-bounce [animation-delay:0.4s]" />
                              </span>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Input Text Form inline inside simulator */}
                      <form onSubmit={sendChatMessage} className="p-2 border-t border-[#E4DDD0] bg-white flex items-center gap-2">
                        <input
                          type="text"
                          value={chatInput}
                          onChange={(e) => setChatInput(e.target.value)}
                          placeholder={`Ask agent in ${activeChannel.title}...`}
                          className="flex-1 bg-neutral-50 px-3 py-2 text-xs rounded-lg border border-neutral-200 outline-none focus:border-neutral-500 font-sans"
                        />
                        <button 
                          type="submit" 
                          className="p-2 bg-neutral-900 text-white rounded-lg hover:bg-neutral-800 transition-colors cursor-pointer"
                        >
                          <Send className="w-3.5 h-3.5 fill-current" />
                        </button>
                      </form>
                      
                    </div>

                  ) : (

                    /* API / Snippet code visualizer style */
                    <div className="border border-neutral-800 rounded-xl bg-neutral-950 text-neutral-200 font-mono text-xs overflow-hidden">
                      <div className="bg-neutral-900 border-b border-neutral-800 px-4 py-2 flex items-center justify-between">
                        <span className="text-[10px] uppercase font-bold text-neutral-400 tracking-wider">
                          DEPLOYMENT CODE / ENDPOINT PATH
                        </span>
                        <button 
                          onClick={() => handleCopy(activeChannel.interactiveSnippet)}
                          className="text-[10px] font-mono text-orange-400 hover:text-orange-300 font-semibold cursor-pointer active:scale-95"
                        >
                          {copied ? 'Copied' : 'Copy'}
                        </button>
                      </div>
                      <pre className="p-4 overflow-x-auto text-[11px] font-mono whitespace-pre leading-relaxed select-all text-neutral-300">
                        <code>{activeChannel.interactiveSnippet}</code>
                      </pre>
                    </div>

                  )}

                  {/* Connected parameters highlight */}
                  <div className="mt-6 p-4 rounded-xl bg-orange-50/40 border border-orange-100 flex items-start gap-3">
                    <Check className="w-4 h-4 text-orange-600 mt-0.5 shrink-0" />
                    <div>
                      <p className="text-xs font-semibold text-neutral-900">
                        Automatic synchronization across channels
                      </p>
                      <p className="text-[11px] text-[#A0937F] mt-0.5">
                        Mazaal hooks this endpoint. If you update the training or models, updates instantly synchronize down to all lines.
                      </p>
                    </div>
                  </div>

                </div>
              )}

              {/* Action buttons on footer of card */}
              <div className="mt-8 pt-4 border-t border-[#ECE5D9] flex items-center justify-between">
                <span className="text-[10px] font-mono text-neutral-400">CONNECT TO SERVICE IN ONE CLICK</span>
                <button 
                  onClick={() => alert(`Connect dialog popped for channel: ${activeChannel?.title}. Integration ready!`)}
                  className="inline-flex items-center gap-1.5 px-4.5 py-2.5 bg-neutral-950 hover:bg-neutral-900 text-white text-xs font-semibold rounded-full shadow-sm transition-all cursor-pointer whitespace-nowrap"
                >
                  Configure Connector
                  <ArrowRight className="w-3.5 h-3.5 text-orange-400" />
                </button>
              </div>

            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
