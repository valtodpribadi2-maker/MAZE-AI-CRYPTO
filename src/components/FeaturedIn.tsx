import { BRAND_REVIEWS } from '../data';
import { Quote } from 'lucide-react';
import { motion } from 'motion/react';

export default function FeaturedIn() {
  return (
    <section className="py-12 bg-[#FAF8F5] border-t border-b border-[#E8E3D9]/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Logos Header */}
        <p className="text-center text-xs font-semibold tracking-wider text-[#A29783] uppercase mb-8">
          as featured in
        </p>

        {/* Logos Flexbox Row */}
        <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-6 md:gap-x-20 opacity-75 grayscale hover:grayscale-0 transition-all duration-500 mb-12">
          
          <div className="text-center">
            <span className="text-base font-bold tracking-tight text-neutral-800 font-sans">The ABJ</span>
            <span className="block text-[8px] tracking-widest text-neutral-500 font-semibold uppercase">Australian Journal</span>
          </div>

          <div className="text-center">
            <span className="text-lg font-extrabold tracking-widest text-neutral-800 font-mono">TECH</span>
            <span className="block text-[8px] tracking-[0.2em] text-neutral-500 font-semibold uppercase">Business News</span>
          </div>

          <div className="text-center">
            <span className="text-lg font-serif italic font-bold text-neutral-800">Digital</span>
            <span className="inline text-xs font-semibold text-neutral-500 font-sans ml-1">Journal</span>
          </div>

          <div className="text-center">
            <span className="text-base font-black tracking-tight text-[#FF6B35] font-sans">Tech</span>
            <span className="text-base font-light text-neutral-800 font-sans">Bullion</span>
          </div>

        </div>

        {/* Testimonials Inline Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-10">
          {BRAND_REVIEWS.map((review, idx) => (
            <motion.div 
              key={review.publication}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1, duration: 0.6 }}
              className="bg-[#FFFDFB] rounded-xl border border-[#ECE6DB] p-5 relative hover:border-orange-200 transition-all duration-300 shadow-sm"
            >
              <Quote className="w-6 h-6 text-orange-200 absolute top-4 right-4 opacity-50" />
              <p className="text-sm font-semibold text-neutral-800 pr-6 leading-relaxed mb-4">
                "{review.text}"
              </p>
              <div>
                <span className="text-xs font-bold text-neutral-950 font-mono">
                  {review.publication}
                </span>
                {review.desc && (
                  <span className="block text-[8px] text-neutral-500 tracking-wider">
                    {review.desc}
                  </span>
                )}
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
