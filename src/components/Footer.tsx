import { useState, FormEvent } from 'react';
import { Infinity, Send, Github, Twitter, Linkedin, Heart } from 'lucide-react';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubscribe = (e: FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setSubmitted(true);
    setEmail('');
    setTimeout(() => setSubmitted(false), 3000);
  };

  return (
    <footer className="bg-neutral-950 text-neutral-400 py-16 md:py-24 border-t border-neutral-900 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top block: Brand grid and newsletter */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 pb-16 border-b border-neutral-900 items-start">
          
          {/* Brand Col */}
          <div className="lg:col-span-5 space-y-6">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-orange-600 shadow-md">
                <Infinity className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold tracking-tight text-white flex items-baseline">
                mazaal
                <span className="text-orange-500 ml-1 italic font-serif text-3xl">.</span>
                <span className="text-[10px] font-bold text-white bg-orange-600 px-1 py-0.5 rounded leading-none ml-1 uppercase">AI</span>
              </span>
            </div>
            
            <p className="text-xs text-neutral-400 max-w-sm font-normal leading-relaxed">
              Mazaal recruits, deploys, and Cascades autonomous AI teammates that integrate into your 
              Slack channels, company email address books, and internal databases on day one.
            </p>
            
            <div className="flex items-center gap-4 text-neutral-500">
              <a href="#" className="hover:text-white transition-colors duration-300">
                <Github className="w-4 h-4" />
              </a>
              <a href="#" className="hover:text-white transition-colors duration-300">
                <Twitter className="w-4 h-4" />
              </a>
              <a href="#" className="hover:text-white transition-colors duration-300">
                <Linkedin className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick links group (3 cols) */}
          <div className="lg:col-span-3 grid grid-cols-2 gap-8">
            <div className="space-y-4">
              <span className="text-[10px] font-mono tracking-widest text-[#8F816D] uppercase block font-semibold">
                SYSTEM MODULES
              </span>
              <ul className="space-y-2.5 text-xs">
                <li><a href="#workspace-section" className="hover:text-white transition-colors">Workspace (01)</a></li>
                <li><a href="#channels-section" className="hover:text-white transition-colors">Channels (02)</a></li>
                <li><a href="#routing-section" className="hover:text-white transition-colors">Cascading (03)</a></li>
                <li><a href="#pricing-section" className="hover:text-white transition-colors">Pricing Options</a></li>
              </ul>
            </div>

            <div className="space-y-4">
              <span className="text-[10px] font-mono tracking-widest text-[#8F816D] uppercase block font-semibold">
                DOCUMENTATION
              </span>
              <ul className="space-y-2.5 text-xs">
                <li><a href="#" className="hover:text-white transition-colors">MCP Protocols</a></li>
                <li><a href="#" className="hover:text-white transition-colors">REST API Spec</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Integrations list</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Developer Sandbox</a></li>
              </ul>
            </div>
          </div>

          {/* Newsletter Input Section (4 cols) */}
          <div className="lg:col-span-4 space-y-4">
            <span className="text-[10px] font-mono tracking-widest text-[#8F816D] uppercase block font-semibold">
              JOIN THE MAZAAL PIPELINE
            </span>
            <p className="text-xs text-neutral-400">
              Subscribe to receive updates when new cascading models, agent nodes, or database connectors drop.
            </p>

            <form onSubmit={handleSubscribe} className="flex gap-2">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter workspace email..."
                className="bg-neutral-900 border border-neutral-800 text-neutral-100 text-xs rounded-xl px-4 py-3 outline-none focus:border-orange-500 hover:border-neutral-700 transition-colors flex-1"
              />
              <button
                type="submit"
                className="p-3 bg-orange-600 hover:bg-orange-700 text-white rounded-xl transition-all cursor-pointer flex items-center justify-center"
              >
                <Send className="w-4 h-4 fill-current" />
              </button>
            </form>
            
            {submitted && (
              <p className="text-[10px] font-mono text-orange-400 leading-none">
                ✓ Success! Check your inbox for confirmation.
              </p>
            )}
          </div>

        </div>

        {/* Bottom copyright row */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-500 font-medium">
          <p>© {new Date().getFullYear()} Mazaal AI Inc. Intelligent Cascading Automation. All rights reserved.</p>
          
          <div className="flex items-center gap-5">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <span>•</span>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
            <span>•</span>
            <div className="flex items-center gap-1">
              <span>Made with</span>
              <Heart className="w-3.5 h-3.5 text-orange-600 fill-current animate-pulse" />
              <span>for AI Teammates</span>
            </div>
          </div>
        </div>

      </div>
    </footer>
  );
}
