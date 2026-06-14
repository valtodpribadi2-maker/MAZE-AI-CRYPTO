import { Sparkles, Play, ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';

interface HeroProps {
  onStartClick: () => void;
  onWatchClick: () => void;
}

export default function Hero({ onStartClick, onWatchClick }: HeroProps) {
  return (
    <section className="relative overflow-hidden pt-12 pb-16 md:py-24 bg-[#FAF8F5] bg-dots">
      
      {/* Decorative gradient blur in background */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[300px] bg-gradient-to-r from-orange-200/30 to-amber-100/30 blur-3xl pointer-events-none rounded-full" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        
        {/* New Badge */}
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-[#E8E3D9] text-xs font-semibold text-neutral-800 shadow-sm mb-8 hover:border-orange-300 transition-all cursor-pointer group"
          onClick={onStartClick}
        >
          <span className="px-1.5 py-0.5 rounded-full bg-orange-600 text-[10px] text-white font-bold leading-none animate-pulse">
            NEW
          </span>
          <span className="text-neutral-600 font-medium flex items-center gap-1 group-hover:text-black transition-colors">
            Mazaal v2, your agents on every channel 
            <ArrowRight className="w-3 h-3 text-orange-600 group-hover:translate-x-1 transition-transform" />
          </span>
        </motion.div>

        {/* Display Heading */}
        <motion.h1 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="text-5xl sm:text-6xl md:text-7xl font-light text-neutral-900 tracking-tight leading-none mb-8 font-sans max-w-4xl mx-auto"
        >
          Build the AI <span className="font-serif italic text-orange-600 font-medium font-serif relative">
            teammate
            <svg className="absolute left-0 -bottom-1 w-full h-[6px] text-orange-200" viewBox="0 0 100 10" preserveAspectRatio="none">
              <path d="M0,7 C30,2 70,2 100,7" stroke="currentColor" strokeWidth="3" fill="none" strokeLinecap="round" />
            </svg>
          </span> <br className="hidden sm:inline" />
          <span className="font-serif italic font-medium relative">your business</span> has been hiring for.
        </motion.h1>

        {/* Subtitle */}
        <motion.p 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-base sm:text-lg md:text-xl text-neutral-600 max-w-2xl mx-auto mb-10 leading-relaxed font-normal font-sans"
        >
          Build autonomous AI agents for sales, support, ops, or anything you'd otherwise hire a person for. 
          Deploy live on every channel your customers already use.
        </motion.p>

        {/* Action Buttons */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12"
        >
          <button
            onClick={onStartClick}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 bg-neutral-950 hover:bg-neutral-900 text-white font-medium text-base rounded-full shadow-lg hover:shadow-xl transition-all cursor-pointer group hover:-translate-y-0.5 active:translate-y-0"
          >
            Start building free
            <ArrowRight className="w-4 h-4 text-orange-400 group-hover:translate-x-1 transition-transform" />
          </button>

          <button
            onClick={onWatchClick}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 bg-white hover:bg-neutral-50 text-neutral-800 font-medium text-base rounded-full border border-[#DCD6CA] shadow-sm hover:shadow transition-all cursor-pointer group hover:-translate-y-0.5 active:translate-y-0"
          >
            <div className="w-5 h-5 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 group-hover:bg-orange-500 group-hover:text-white transition-colors duration-300">
              <Play className="w-2.5 h-2.5 fill-current ml-0.5" />
            </div>
            Watch a 90-second tour
          </button>
        </motion.div>

        {/* Highlight details */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.4 }}
          className="flex flex-wrap items-center justify-center gap-y-2 gap-x-8 text-xs text-neutral-500 font-medium font-sans"
        >
          <div className="flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-orange-500" />
            Free forever plan
          </div>
          <span className="hidden sm:inline text-neutral-300">•</span>
          <div className="flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-orange-500" />
            No credit card
          </div>
          <span className="hidden sm:inline text-neutral-300">•</span>
          <div className="flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-orange-500" />
            Working agent in 15 minutes
          </div>
        </motion.div>

      </div>
    </section>
  );
}
