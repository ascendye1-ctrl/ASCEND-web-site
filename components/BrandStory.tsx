
import React from 'react';
import { ArrowRight } from 'lucide-react';

const BrandStory: React.FC = () => {
  return (
    <div className="relative w-full h-[600px] overflow-hidden flex items-center justify-center bg-black">
      {/* Background Image with Parallax Effect */}
      <div 
        className="absolute inset-0 z-0 bg-fixed bg-center bg-cover opacity-60"
        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1469334031218-e382a71b716b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80')" }}
      ></div>
      
      {/* Overlay Gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent z-10"></div>

      {/* Content */}
      <div className="relative z-20 max-w-4xl mx-auto px-6 text-center text-white">
        <span className="inline-block py-1 px-3 border border-white/30 rounded-full text-xs font-bold tracking-[0.2em] uppercase mb-6 backdrop-blur-md">
           Our Philosophy
        </span>
        <h2 className="text-4xl md:text-6xl font-black tracking-tighter mb-6 leading-tight">
           CRAFTED FOR THE <br/> <span className="text-brand-lime">EXTRAORDINARY.</span>
        </h2>
        <p className="text-lg md:text-xl text-gray-300 mb-10 leading-relaxed max-w-2xl mx-auto">
           We believe that what you wear defines where you go. Our pieces are engineered for those who refuse to settle for the average, blending high-performance materials with uncompromising aesthetic.
        </p>
        <button className="group bg-white text-black px-8 py-4 rounded-full font-bold text-sm hover:bg-brand-lime transition-colors flex items-center gap-2 mx-auto">
           Read Our Story <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  );
};

export default BrandStory;
