import { useState } from 'react';
import { Infinity, Puzzle, Menu, X, ArrowRight } from 'lucide-react';

interface NavbarProps {
  onNavClick: (sectionId: string) => void;
  onOpenCalculator: () => void;
}

export default function Navbar({ onNavClick, onOpenCalculator }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-[#FAF8F5]/90 backdrop-blur-md border-b border-[#E8E3D9]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => onNavClick('hero')}>
            <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-orange-600 shadow-md">
              <Infinity className="w-6 h-6 text-white" />
              <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-red-500 border-2 border-[#FAF8F5]" />
            </div>
            <span className="text-2xl font-bold tracking-tight text-neutral-900 font-sans flex items-baseline">
              mazaal
              <span className="text-orange-600 ml-1 italic font-serif text-3xl font-medium">.</span>
              <span className="text-[10px] font-bold text-white bg-orange-600 px-1 py-0.5 rounded leading-none ml-1 uppercase">AI</span>
            </span>
          </div>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-8">
            <button 
              onClick={() => onNavClick('workspace')} 
              className="text-neutral-600 hover:text-neutral-900 font-medium text-sm transition-colors cursor-pointer"
            >
              Workspace
            </button>
            <button 
              onClick={() => onNavClick('channels')} 
              className="text-neutral-600 hover:text-neutral-900 font-medium text-sm transition-colors cursor-pointer"
            >
              Channels
            </button>
            <button 
              onClick={() => onNavClick('routing')} 
              className="text-neutral-600 hover:text-neutral-900 font-medium text-sm transition-colors cursor-pointer"
            >
              Cascade Route
            </button>
            <button 
              onClick={() => onNavClick('pricing')} 
              className="text-neutral-600 hover:text-orange-600 font-medium text-sm transition-colors cursor-pointer"
            >
              Pricing
            </button>
          </nav>

          {/* Action Buttons */}
          <div className="hidden md:flex items-center gap-4">
            <button 
              onClick={onOpenCalculator}
              className="text-neutral-700 hover:text-neutral-900 font-medium text-sm px-4 py-2 hover:bg-neutral-100 rounded-lg transition-colors cursor-pointer"
            >
              Live Demo
            </button>
            <a 
              href="#pricing"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-orange-600 hover:bg-orange-700 text-white font-medium text-sm rounded-full shadow-sm hover:shadow-md transition-all cursor-pointer"
            >
              <Puzzle className="w-4 h-4" />
              Get Extension
              <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-lg text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 transition-colors"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden border-t border-[#E8E3D9] bg-[#FAF8F5] px-4 pt-4 pb-6 space-y-3 animate-fadeIn">
          <button
            onClick={() => { onNavClick('workspace'); setIsOpen(false); }}
            className="block w-full text-left px-3 py-2.5 rounded-lg text-base font-medium text-neutral-800 hover:bg-neutral-100 transition-colors"
          >
            Workspace (01)
          </button>
          <button
            onClick={() => { onNavClick('channels'); setIsOpen(false); }}
            className="block w-full text-left px-3 py-2.5 rounded-lg text-base font-medium text-neutral-800 hover:bg-neutral-100 transition-colors"
          >
            Channels (02)
          </button>
          <button
            onClick={() => { onNavClick('routing'); setIsOpen(false); }}
            className="block w-full text-left px-3 py-2.5 rounded-lg text-base font-medium text-neutral-800 hover:bg-neutral-100 transition-colors"
          >
            Cascade Route (03)
          </button>
          <button
            onClick={() => { onNavClick('pricing'); setIsOpen(false); }}
            className="block w-full text-left px-3 py-2.5 rounded-lg text-base font-medium text-neutral-800 hover:bg-neutral-100 transition-colors"
          >
            Pricing
          </button>
          <div className="pt-4 border-t border-[#E8E3D9] flex flex-col gap-3">
            <button
              onClick={() => { onOpenCalculator(); setIsOpen(false); }}
              className="w-full text-center py-2.5 rounded-lg font-medium text-neutral-800 hover:bg-neutral-100 transition-colors border border-neutral-300"
            >
              Cost Saving Demo
            </button>
            <a
              href="#pricing"
              onClick={() => setIsOpen(false)}
              className="w-full text-center py-2.5 bg-orange-600 hover:bg-orange-700 text-white font-medium rounded-lg flex items-center justify-center gap-2 shadow-sm"
            >
              <Puzzle className="w-4 h-4" />
              Get Extension
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
