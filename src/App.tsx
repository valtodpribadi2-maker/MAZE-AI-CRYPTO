import { useState } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import AgentSandbox from './components/AgentSandbox';
import SupportChat from './components/SupportChat';
import FeaturedIn from './components/FeaturedIn';
import WorkspaceFeature from './components/WorkspaceFeature';
import ChannelsGrid from './components/ChannelsGrid';
import RoutingCalculator from './components/RoutingCalculator';
import PricingSection from './components/PricingSection';
import Footer from './components/Footer';
import { Play, Sparkles, X, ChevronRight, ChevronLeft, ShieldCheck, Heart, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  const [activeModal, setActiveModal] = useState<'tour' | 'demo' | null>(null);
  const [tourSlideIndex, setTourSlideIndex] = useState(0);

  // Guided Tour slides context
  const tourSlides = [
    {
      title: "Recruiting your AI teammate",
      subtitle: "Give the agent a role using natural letters. Upload documents or sync with Notion workspaces to establish high fidelity contextual training.",
      image: "🤖",
      details: ["Sync files & wikis in 1 click", "Specify response guidelines", "Attach API secrets safely"]
    },
    {
      title: "Connecting workspace steps",
      subtitle: "Map automated branches. When triggers fire, let the agent evaluate condition gates, query CRM databases, and output structured JSON packets.",
      image: "⛓️",
      details: ["Drag-and-drop flow branches", "Webhooks & database adapters", "Visual debugging playground"]
    },
    {
      title: "Broadcasting across channels",
      subtitle: "Mazaal hosts and serves the agent. Instantly reply to customers on Slack workspaces, Discord channels, WhatsApp APIs, or customized web chat widgets.",
      image: "📡",
      details: ["16 out-of-the-box integrations", "Shared inbox synchronization", "0-drift instant deploys"]
    },
    {
      title: "Intelligent cognitive cascading",
      subtitle: "Maximize cost savings by routing simple text chores to lightweight open source models, and heavy synthesis tasks directly to Claude 3.5 or o4.",
      image: "🧠",
      details: ["Cascades automatically in few MS", "Up to 72% cost savings", "Guaranteed structured logs"]
    }
  ];

  const handleNavScroll = (sectionId: string) => {
    if (sectionId === 'hero') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    const element = document.getElementById(`${sectionId}-section`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const nextSlide = () => {
    setTourSlideIndex((prev) => (prev + 1) % tourSlides.length);
  };

  const prevSlide = () => {
    setTourSlideIndex((prev) => (prev - 1 + tourSlides.length) % tourSlides.length);
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-neutral-900 selection:bg-orange-500 selection:text-white font-sans antialiased relative">
      
      {/* Top Notification Banner */}
      <div className="bg-neutral-900 text-white text-xs py-2.5 px-4 text-center font-medium font-sans flex items-center justify-center gap-2 relative z-50">
        <Sparkles className="w-3.5 h-3.5 text-orange-400 animate-pulse" />
        <span>Mazaal v2 is launched! Experience intelligent cascading models multi-channel coverage.</span>
        <button 
          onClick={() => setActiveModal('tour')}
          className="underline text-orange-400 hover:text-orange-300 font-bold ml-1 cursor-pointer"
        >
          Start guided walkthrough →
        </button>
      </div>

      {/* Navigation bar */}
      <Navbar 
        onNavClick={handleNavScroll} 
        onOpenCalculator={() => setActiveModal('demo')} 
      />

      {/* Hero section */}
      <Hero 
        onStartClick={() => {
          const pricingSection = document.getElementById('pricing-section');
          pricingSection?.scrollIntoView({ behavior: 'smooth' });
        }}
        onWatchClick={() => {
          setTourSlideIndex(0);
          setActiveModal('tour');
        }}
      />

      {/* Core Agent Sandbox Workspace Preview */}
      <AgentSandbox />

      {/* Silver featured logos bar */}
      <FeaturedIn />

      {/* Section 01: Your agent. Your workflows. One workspace. */}
      <WorkspaceFeature />

      {/* Section 02: Build it once. It shows up everywhere. */}
      <ChannelsGrid />

      {/* Section 03: Use the right brain for each step. */}
      <RoutingCalculator />

      {/* Subscription Pricing groups */}
      <PricingSection />

      {/* Polished Footnotes */}
      <Footer />

      {/* GUIDED TOUR LIGHTBOX MODAL */}
      <AnimatePresence>
        {activeModal === 'tour' && (
          <div className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-neutral-950/80 backdrop-blur-sm">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl border border-[#ECE5D9] max-w-2xl w-full p-6 md:p-8 shadow-2xl relative overflow-hidden"
            >
              {/* Header */}
              <div className="flex items-center justify-between pb-4 border-b border-neutral-100">
                <div className="flex items-center gap-2">
                  <Play className="w-4 h-4 text-orange-600 fill-current" />
                  <span className="text-xs font-mono font-bold tracking-wider text-neutral-400 uppercase">
                    Mazaal AI Guided Tour (Slide {tourSlideIndex + 1}/{tourSlides.length})
                  </span>
                </div>
                <button 
                  onClick={() => setActiveModal(null)}
                  className="p-1 rounded-full text-neutral-400 hover:text-black hover:bg-neutral-100 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Slider content */}
              <div className="my-8 grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                
                {/* Visual Left Badge (4 cols) */}
                <div className="md:col-span-4 flex justify-center">
                  <div className="w-32 h-32 rounded-2xl bg-orange-50 border border-orange-100 flex items-center justify-center text-5xl shadow-inner relative">
                    <span className="animate-bounce [animation-duration:3s]">{tourSlides[tourSlideIndex].image}</span>
                    <div className="absolute inset-0 bg-gradient-to-tr from-orange-400/10 to-transparent rounded-2xl pointer-events-none" />
                  </div>
                </div>

                {/* Text Right Attributes (8 cols) */}
                <div className="md:col-span-8 space-y-4 text-left">
                  <h3 className="text-xl font-bold text-neutral-950 font-sans leading-snug">
                    {tourSlides[tourSlideIndex].title}
                  </h3>
                  <p className="text-sm text-neutral-600 leading-relaxed font-normal">
                    {tourSlides[tourSlideIndex].subtitle}
                  </p>

                  <div className="pt-2">
                    <span className="text-[10px] uppercase font-mono tracking-wider text-[#A0937F] font-bold block mb-2">
                      HIGHLIGHTS & BENEFITS
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {tourSlides[tourSlideIndex].details.map((detail) => (
                        <div key={detail} className="flex items-center gap-2 text-xs text-neutral-800 font-medium">
                          <span className="w-1.5 h-1.5 rounded-full bg-orange-500" />
                          <span>{detail}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

              </div>

              {/* Slide Pagination Footer */}
              <div className="pt-4 border-t border-neutral-100 flex items-center justify-between">
                
                {/* Dots indicator */}
                <div className="flex gap-1.5">
                  {tourSlides.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setTourSlideIndex(idx)}
                      className={`w-2 h-2 rounded-full transition-all duration-300 ${
                        idx === tourSlideIndex ? 'bg-orange-600 w-5' : 'bg-neutral-200 hover:bg-neutral-400'
                      }`}
                    />
                  ))}
                </div>

                {/* Navigation Buttons */}
                <div className="flex gap-2">
                  <button
                    onClick={prevSlide}
                    className="p-2 border border-neutral-200 rounded-lg text-neutral-600 hover:text-black hover:bg-neutral-50 transition-colors"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  
                  {tourSlideIndex === tourSlides.length - 1 ? (
                    <button
                      onClick={() => {
                        setActiveModal(null);
                        const pricingSec = document.getElementById('pricing-section');
                        pricingSec?.scrollIntoView({ behavior: 'smooth' });
                      }}
                      className="px-4.5 py-2 bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-bold rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
                    >
                      Configure AI Teammate
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  ) : (
                    <button
                      onClick={nextSlide}
                      className="px-4.5 py-2 bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
                    >
                      Next Step
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* QUICK LIVE DEMO MODAL */}
      <AnimatePresence>
        {activeModal === 'demo' && (
          <div className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-neutral-950/80 backdrop-blur-sm">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl border border-[#ECE5D9] max-w-md w-full p-6 shadow-2xl relative"
            >
              <div className="flex items-center justify-between pb-3 border-b border-neutral-100 mb-5">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-orange-500" />
                  <h3 className="text-sm font-mono font-bold tracking-wider text-neutral-400 uppercase">
                    Launch Interactive AI Sandbox
                  </h3>
                </div>
                <button 
                  onClick={() => setActiveModal(null)}
                  className="p-1 rounded-full text-neutral-400 hover:text-black hover:bg-neutral-100 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Demo Content */}
              <div className="space-y-4 text-left">
                <p className="text-xs text-neutral-600 leading-relaxed font-normal">
                  Want to test Mazaal AI live on your own credentials? Our developers established a sandbox playground where you can try cascading models in real-time.
                </p>

                <div className="p-4 rounded-xl bg-orange-50 border border-orange-100">
                  <span className="text-[9px] font-mono font-bold text-orange-850 tracking-wide uppercase">
                    ACTIVE MOCKED SANDBOX CREDENTIALS
                  </span>
                  <div className="mt-2 text-xs text-orange-950 font-normal space-y-1.5 font-sans">
                    <div>• <strong>Database Node:</strong> connected_postgres_db</div>
                    <div>• <strong>Slack Hub:</strong> workspace-active-sandbox</div>
                    <div>• <strong>Primary Triage:</strong> cascades_route_v2</div>
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <button 
                    onClick={() => {
                      setActiveModal(null);
                      const sandbox = document.getElementById('workspace-section');
                      sandbox?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="w-full text-center py-3 bg-neutral-950 hover:bg-neutral-900 text-white text-xs font-extrabold tracking-widest uppercase rounded-xl shadow cursor-pointer active:scale-98 transition-all"
                  >
                    Start Building Now
                  </button>
                  <button 
                    onClick={() => setActiveModal(null)}
                    className="w-full text-center py-3 border border-neutral-200 text-neutral-600 hover:bg-neutral-50 text-xs font-bold rounded-xl cursor-pointer"
                  >
                    Cancel Setup
                  </button>
                </div>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Floating Customer AI Support Chat */}
      <SupportChat />

    </div>
  );
}
