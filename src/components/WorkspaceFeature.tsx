import { CheckCircle2, ShieldCheck, Cpu, Zap, Link } from 'lucide-react';
import { motion } from 'motion/react';

export default function WorkspaceFeature() {
  const cards = [
    {
      num: '01',
      title: 'Agents that do the job.',
      description: 'Give it a prompt, give it tools, give it your company knowledge. Test safely in an interactive sandbox. Version-control every change. Switch models instantly whenever a better or cheaper option drops.',
      icon: Cpu,
      color: 'border-orange-500 bg-orange-500/5',
      accentColor: 'text-orange-600',
      tag: 'COGNITIVE'
    },
    {
      num: '02',
      title: 'Workflows that run while you sleep.',
      description: 'Drag-and-drop triggers, deep branches, and multi-step AI tasks into an autonomous cascading flow. Schedule executions, listen for webhooks, or chain multiple functional agents together without boilerplate.',
      icon: Zap,
      color: 'border-[#EFB641] bg-[#EFB641]/5',
      accentColor: 'text-[#EFB641]',
      tag: 'AUTOMATING'
    },
    {
      num: '03',
      title: 'Already connected to your stack.',
      description: 'Unlock 10,000+ connectors through Mazaal global app connectivity, plus native MCP integrations. Let your agent read and query CRM tables, write rows to databases, and ping Slack on day one.',
      icon: Link,
      color: 'border-[#4A90E2] bg-[#4A90E2]/5',
      accentColor: 'text-[#4A90E2]',
      tag: 'CONNECTED'
    }
  ];

  return (
    <section id="workspace-section" className="py-20 lg:py-28 bg-[#FAF8F5] border-b border-[#E8E3D9]/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Label */}
        <div className="flex items-center gap-4 mb-2 animate-fadeIn">
          <span className="font-serif italic font-medium text-4xl text-orange-600 block leading-none">01</span>
          <div>
            <span className="block text-[10px] tracking-[0.2em] font-bold text-[#A29783] uppercase leading-none">ONE PLATFORM</span>
            <span className="block text-[9px] font-mono tracking-wider text-neutral-500 uppercase mt-0.5">Not three disconnected tabs</span>
          </div>
        </div>

        {/* Header Block */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end mb-16">
          <div className="lg:col-span-7">
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-light text-neutral-900 tracking-tight leading-tight font-sans">
              Your agent. Your workflows.<br />
              Your tools. <span className="font-serif italic text-orange-600 font-medium">One workspace.</span>
            </h2>
          </div>
          <div className="lg:col-span-5">
            <p className="text-base text-neutral-600 leading-relaxed font-normal">
              Most teams piece together a model API, Zapier connections, and a raw chat widget – then spend a year 
              holding it together with digital duct tape. Mazaal provides absolute integration. No brittle glue code. No five bloated SaaS bills.
            </p>
          </div>
        </div>

        {/* Grid feature cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {cards.map((card, idx) => {
            const Icon = card.icon;
            return (
              <motion.div
                key={card.num}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: idx * 0.15 }}
                className="bg-[#FFFDFB] rounded-2xl border border-[#ECE5D9] p-8 relative flex flex-col justify-between transition-all duration-300 hover:border-orange-300 group hover:-translate-y-1.5 hover:shadow-lg"
              >
                {/* Large serial floating number */}
                <span className="absolute top-6 right-8 text-6xl font-serif italic font-extralight text-[#EFEDE7] select-none group-hover:text-orange-100 transition-colors duration-300">
                  .{card.num}
                </span>

                <div>
                  {/* Badge */}
                  <div className="inline-flex items-center gap-1.5 px-2 py-1 rounded bg-[#F6F3EC] border border-[#ECE5D9] text-[9px] font-mono font-bold tracking-widest text-[#8F816D] mb-8">
                    <Icon className={`w-3 h-3 ${card.accentColor}`} />
                    {card.tag}
                  </div>

                  {/* Title */}
                  <h3 className="text-xl font-semibold text-neutral-900 font-sans leading-snug mb-4">
                    {card.title}
                  </h3>

                  {/* Description */}
                  <p className="text-sm text-neutral-600 font-normal leading-relaxed pr-2">
                    {card.description}
                  </p>
                </div>

                {/* Arrow connector indicator */}
                <div className="mt-8 flex items-center gap-2 text-xs font-mono font-bold text-neutral-400 group-hover:text-orange-600 transition-colors cursor-pointer">
                  <span>DEPLOY BLUEPRINT</span>
                  <span className="group-hover:translate-x-1.5 transition-transform duration-300">→</span>
                </div>

                {/* Subtle colorful line indicator along border */}
                <div className={`absolute bottom-0 left-0 right-0 h-1 rounded-b-2xl border-b border-t-0 border-l-0 border-r-0 ${card.color} opacity-0 group-hover:opacity-100 transition-opacity`} />
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
