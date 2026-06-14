import { useState } from 'react';
import { motion } from 'motion/react';
import { PRICING_PLANS } from '../data';
import { Check, Info, ShieldAlert } from 'lucide-react';

export default function PricingSection() {
  const [isYearly, setIsYearly] = useState(false);

  return (
    <section id="pricing-section" className="py-20 lg:py-28 bg-[#FAF8F5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Title Block */}
        <div className="text-center mb-16">
          <span className="text-xs font-bold tracking-widest text-orange-600 uppercase font-sans">
            Simple & Transparent
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-light text-neutral-900 tracking-tight leading-tight mt-2 font-sans">
            A plan for <span className="font-serif italic font-medium text-orange-600">every stage</span> of growth.
          </h2>
          <p className="text-base text-neutral-600 max-w-xl mx-auto mt-4 font-sans font-normal">
            Start completely free. Upgrade when your volume scales or when you need robust third-party integrations and database outputs.
          </p>

          {/* Monthly / Yearly Toggle Selector */}
          <div className="mt-8 inline-flex items-center gap-3 p-1 rounded-full bg-[#EFECE5] border border-[#E3DCD0] select-none">
            <button
              onClick={() => setIsYearly(false)}
              className={`px-4.5 py-2 rounded-full text-xs font-bold transition-all duration-300 cursor-pointer ${
                !isYearly 
                  ? 'bg-neutral-900 text-white shadow-sm' 
                  : 'text-neutral-500 hover:text-neutral-800'
              }`}
            >
              Monthly Billing
            </button>
            <button
              onClick={() => setIsYearly(true)}
              className={`px-4.5 py-2 rounded-full text-xs font-bold flex items-center gap-1.5 transition-all duration-300 cursor-pointer ${
                isYearly 
                  ? 'bg-orange-600 text-white shadow-sm' 
                  : 'text-neutral-500 hover:text-neutral-800'
              }`}
            >
              <span>Yearly Billing</span>
              <span className="text-[9px] font-sans bg-white/20 px-1.5 py-0.5 rounded-full font-extrabold uppercase shrink-0">
                Save 20%
              </span>
            </button>
          </div>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
          {PRICING_PLANS.map((plan, idx) => {
            const finalPrice = isYearly ? plan.priceYearly : plan.priceMonthly;
            return (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: idx * 0.15 }}
                className={`bg-[#FFFDFB] rounded-2xl border p-8 flex flex-col justify-between relative transition-all duration-300 hover:shadow-xl ${
                  plan.isPopular 
                    ? 'border-orange-500 ring-1 ring-orange-500/20 md:scale-[1.03] z-10 shadow-lg' 
                    : 'border-[#ECE5D9] hover:border-neutral-400'
                }`}
              >
                
                {/* Popular Badge */}
                {plan.isPopular && (
                  <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4.5 py-1 bg-orange-600 text-white text-[10px] font-extrabold tracking-widest uppercase rounded-full shadow-md z-15">
                    MOST DEPLOYED
                  </span>
                )}

                <div>
                  {/* Plan Identifier */}
                  <span className="text-xs font-mono font-bold tracking-widest text-[#B4A48C] uppercase block mb-1">
                    {plan.name} Plan
                  </span>
                  <div className="flex items-baseline gap-1 mt-2 mb-4">
                    <span className="text-5xl font-light text-neutral-900 font-sans tracking-tight">
                      ${finalPrice}
                    </span>
                    <span className="text-xs font-mono text-neutral-500 font-medium">
                      / month {isYearly && '(billed annually)'}
                    </span>
                  </div>
                  
                  <p className="text-xs text-neutral-600 leading-relaxed font-normal mb-8">
                    {plan.description}
                  </p>

                  <div className="h-px bg-[#EFEFE9] w-full mb-8" />

                  {/* Features Checklist */}
                  <span className="text-[10px] font-mono tracking-wider text-[#B4A48C] uppercase block mb-4">
                    FEATURES INCLUDED
                  </span>
                  <ul className="space-y-3.5 mb-8">
                    {plan.features.map((feat) => (
                      <li key={feat} className="flex items-start gap-3 text-xs text-neutral-700">
                        <div className="w-4 h-4 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 mt-0.5 shrink-0">
                          <Check className="w-2.5 h-2.5 stroke-[3]" />
                        </div>
                        <span className="font-normal">{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Buy Button */}
                <div className="mt-auto">
                  <button
                    onClick={() => alert(`Starting setup flow for: ${plan.name}`)}
                    className={`w-full text-center py-3.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                      plan.isPopular 
                        ? 'bg-orange-600 hover:bg-orange-700 text-white shadow-md active:scale-98' 
                        : 'bg-neutral-900 hover:bg-neutral-800 text-white active:scale-98'
                    }`}
                  >
                    {plan.buttonText}
                  </button>
                  <p className="text-[10px] text-neutral-400 text-center mt-2.5 font-mono select-none">
                    No hidden credit card fees • Active instantly
                  </p>
                </div>

              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
