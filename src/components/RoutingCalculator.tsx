import { useState } from 'react';
import { motion } from 'motion/react';
import { ROUTE_STEPS } from '../data';
import { Zap, DollarSign, Brain, MoveRight, Layers, HelpCircle, Split } from 'lucide-react';

export default function RoutingCalculator() {
  const [useMazaal, setUseMazaal] = useState(true);

  // Math totals calculation
  const totalSingleModelCost = ROUTE_STEPS.reduce((acc, curr) => acc + curr.singleModel.cost, 0);
  const totalMazaalModelCost = ROUTE_STEPS.reduce((acc, curr) => acc + curr.mazaalModel.cost, 0);
  
  const totalSingleModelLatency = ROUTE_STEPS.reduce((acc, curr) => acc + curr.singleModel.latency, 0);
  const totalMazaalModelLatency = ROUTE_STEPS.reduce((acc, curr) => acc + curr.mazaalModel.latency, 0);

  const percentCostSavings = Math.round(((totalSingleModelCost - totalMazaalModelCost) / totalSingleModelCost) * 100);
  const percentLatencySavings = Math.round(((totalSingleModelLatency - totalMazaalModelLatency) / totalSingleModelLatency) * 100);

  return (
    <section id="routing-section" className="py-20 lg:py-28 bg-[#FAF8F5] border-b border-[#E8E3D9]/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Label */}
        <div className="flex items-center gap-4 mb-2">
          <span className="font-serif italic font-medium text-4xl text-orange-600 block leading-none">03</span>
          <div>
            <span className="block text-[10px] tracking-[0.2em] font-bold text-[#A29783] uppercase leading-none">50+ MODELS, ZERO LOCK-IN</span>
            <span className="block text-[9px] font-mono tracking-wider text-neutral-500 uppercase mt-0.5">Automated Model Cascading</span>
          </div>
        </div>

        {/* Heading Block */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end mb-16">
          <div className="lg:col-span-8">
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-light text-neutral-900 tracking-tight leading-tight font-sans">
              Use the right brain <span className="font-serif italic text-orange-600 font-medium">for each step.</span>
            </h2>
            <p className="text-base text-neutral-600 max-w-2xl mt-4 font-normal leading-relaxed">
              Route the cheap stuff to a lightning-fast model. Send complex reasoning to Claude or o4. Format outputs with whatever model is cheapest this week. 
              Mazaal handles streaming, retries, schemas, and credit accounting across providers.
            </p>
          </div>
          
          <div className="lg:col-span-4 flex justify-start lg:justify-end">
            {/* Toggle Switch Selector */}
            <div className="p-1.5 rounded-full bg-[#EFECE5] flex items-center gap-1 border border-[#E3DCD0] shadow-inner select-none">
              <button
                onClick={() => setUseMazaal(false)}
                className={`px-5 py-2 rounded-full text-xs font-semibold uppercase tracking-wider transition-all duration-300 cursor-pointer ${
                  !useMazaal 
                    ? 'bg-white text-neutral-900 shadow-sm font-bold' 
                    : 'text-neutral-500 hover:text-neutral-800'
                }`}
              >
                Single Heavy Model
              </button>
              <button
                onClick={() => setUseMazaal(true)}
                className={`px-5 py-2 rounded-full text-xs font-semibold uppercase tracking-wider transition-all duration-300 cursor-pointer ${
                  useMazaal 
                    ? 'bg-orange-600 text-white shadow-sm font-bold' 
                    : 'text-neutral-500 hover:text-neutral-800'
                }`}
              >
                Mazaal Cascading
              </button>
            </div>
          </div>
        </div>

        {/* Interactive Comparison Dashboard */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left panel: Cascading steps list (7 cols) */}
          <div className="lg:col-span-7 space-y-4">
            {ROUTE_STEPS.map((step, idx) => (
              <div 
                key={step.task}
                className={`p-5 rounded-2xl border transition-all duration-300 bg-white shadow-sm flex items-start gap-4 relative overflow-hidden ${
                  useMazaal 
                    ? 'border-[#E8E3D9] hover:border-orange-300' 
                    : 'border-neutral-200'
                }`}
              >
                {/* Visual marker */}
                <div className="relative flex flex-col items-center">
                  <div className={`w-8 h-8 rounded-full border flex items-center justify-center text-xs font-mono font-bold ${
                    useMazaal ? 'border-orange-200 text-orange-600 bg-orange-50' : 'border-neutral-200 text-neutral-500 bg-neutral-50'
                  }`}>
                    {idx + 1}
                  </div>
                  {idx < ROUTE_STEPS.length - 1 && (
                    <div className="w-0.5 h-16 border-l border-dashed border-neutral-300 mt-2" />
                  )}
                </div>

                {/* Text attributes */}
                <div className="flex-1">
                  <span className="text-[10px] uppercase tracking-wider font-mono font-bold text-neutral-400">
                    PIPELINE TASK STEP
                  </span>
                  <h4 className="text-sm font-bold text-neutral-900 font-sans mt-0.5">
                    {step.task}
                  </h4>
                  <p className="text-xs text-neutral-500 mt-1 uppercase leading-normal pr-4">
                    {step.description}
                  </p>

                  {/* Adaptive routing visual pills */}
                  <div className="mt-4 flex flex-wrap items-center gap-2">
                    <div className="text-[10px] font-mono text-neutral-400">ROUTED TO:</div>
                    {useMazaal ? (
                      <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-orange-50 rounded border border-orange-200 text-[10px] font-bold text-orange-700 font-mono">
                        <Brain className="w-3 h-3 text-orange-500" />
                        {step.mazaalModel.name}
                        <span className="text-[9px] font-normal text-orange-400 ml-1">• ${step.mazaalModel.cost.toFixed(4)} / {step.mazaalModel.latency}s</span>
                      </div>
                    ) : (
                      <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-neutral-100 rounded border border-neutral-200 text-[10px] font-bold text-neutral-700 font-mono">
                        <Layers className="w-3 h-3 text-neutral-500" />
                        {step.singleModel.name}
                        <span className="text-[9px] font-normal text-neutral-400 ml-1">• ${step.singleModel.cost.toFixed(4)} / {step.singleModel.latency}s</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Right panel: Aggregated metrics display and savings proof (5 cols) */}
          <div className="lg:col-span-5 bg-[#FFFDFB] rounded-2xl border border-[#ECE5D9] p-8 shadow-sm hover:shadow-md transition-shadow">
            
            <div className="text-center mb-8">
              <span className="text-[10px] font-mono tracking-widest text-[#B5A68E] uppercase block mb-1">AGGREGATED PIPELINE RUN METRICS</span>
              <h3 className="text-xl font-bold text-neutral-950 font-sans">
                Scenario Performance Analysis
              </h3>
            </div>

            {/* Simulated bar charts */}
            <div className="space-y-6">
              
              {/* Cost bar comparison */}
              <div>
                <div className="flex justify-between text-xs font-mono font-bold text-neutral-700 mb-2">
                  <span>TOTAL EXECUTION COST (per 1,000 runs)</span>
                  <span className={`${useMazaal ? 'text-orange-600' : 'text-neutral-500'}`}>
                    ${(useMazaal ? totalMazaalModelCost : totalSingleModelCost).toFixed(2)}
                  </span>
                </div>
                <div className="relative h-4 rounded-full bg-[#EFECE5] border border-[#DDD5C7] overflow-hidden">
                  {/* Single heavy cost line */}
                  <div 
                    className="absolute top-0 bottom-0 left-0 bg-neutral-400 rounded-full transition-all duration-700" 
                    style={{ width: '100%' }} 
                  />
                  {/* Cascading savings comparison value */}
                  <div 
                    className="absolute top-0 bottom-0 left-0 bg-orange-600 rounded-full transition-all duration-700 shadow-md"
                    style={{ width: useMazaal ? `${(totalMazaalModelCost / totalSingleModelCost) * 100}%` : '100%' }}
                  />
                </div>
              </div>

              {/* Latency / Speed bar comparison */}
              <div>
                <div className="flex justify-between text-xs font-mono font-bold text-neutral-700 mb-2">
                  <span>ACCUMULATED SYSTEM LATENCY (average)</span>
                  <span className={`${useMazaal ? 'text-orange-600' : 'text-neutral-500'}`}>
                    {(useMazaal ? totalMazaalModelLatency : totalSingleModelLatency).toFixed(1)} seconds
                  </span>
                </div>
                <div className="relative h-4 rounded-full bg-[#EFECE5] border border-[#DDD5C7] overflow-hidden">
                  <div 
                    className="absolute top-0 bottom-0 left-0 bg-neutral-400 rounded-full transition-all duration-700"
                    style={{ width: '100%' }}
                  />
                  <div 
                    className="absolute top-0 bottom-0 left-0 bg-orange-500 rounded-full transition-all duration-700"
                    style={{ width: useMazaal ? `${(totalMazaalModelLatency / totalSingleModelLatency) * 100}%` : '100%' }}
                  />
                </div>
              </div>

            </div>

            <div className="h-px bg-[#EFEFE9] w-full my-8" />

            {/* Saved metric badge inside box */}
            <div className="p-5 rounded-2xl bg-orange-50/70 border border-orange-100 text-center relative overflow-hidden">
              <div className="absolute top-0 right-0 -translate-y-2 translate-x-2 w-14 h-14 bg-orange-100/50 rounded-full blur pointer-events-none" />
              
              <span className="text-[10px] font-mono tracking-widest text-orange-800 uppercase block mb-1 font-bold">
                CASCADING ROUTER HIGHLIGHTS
              </span>
              
              {useMazaal ? (
                <div>
                  <div className="text-5xl font-bold text-orange-600 font-sans tracking-tight">
                    {percentCostSavings}% Savings
                  </div>
                  <p className="text-xs text-orange-800 font-medium mt-2 max-w-sm mx-auto">
                    Mazaal automatically bypasses heavy reasoning LLMs for simple classifying or DB lookups.
                  </p>
                  <div className="mt-4 inline-flex items-center gap-1.5 px-3 py-1 bg-white border border-orange-200 text-[10px] font-mono text-orange-700 rounded-full font-bold">
                    <Split className="w-3.5 h-3.5" />
                    Cascaded over {percentLatencySavings}% faster response threads
                  </div>
                </div>
              ) : (
                <div>
                  <div className="text-4xl font-extrabold text-[#705F49] font-sans tracking-tight">
                    No Savings Active
                  </div>
                  <p className="text-xs text-neutral-500 font-normal mt-2 max-w-sm mx-auto">
                    Toggle to "Mazaal Cascading" to enable intelligent cost routing and latency bypasses.
                  </p>
                </div>
              )}
            </div>

            {/* Live CTA button */}
            <div className="mt-8">
              <button 
                onClick={() => alert('Launching agent configuration creator... Selected routing is active.')}
                className="w-full text-center py-3 px-5 bg-neutral-950 hover:bg-neutral-900 text-white text-xs font-semibold rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer shadow"
              >
                <span>Provision Cascading Pipeline</span>
                <MoveRight className="w-4 h-4 text-orange-400" />
              </button>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
