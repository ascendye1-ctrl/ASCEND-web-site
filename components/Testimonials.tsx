import React from 'react';
import { Star } from 'lucide-react';

const Testimonials = () => {
  return (
    <div className="bg-brand-navy/5 dark:bg-white/5 py-16 sm:py-24 transition-colors duration-300">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <h2 className="text-center text-3xl font-bold tracking-tight text-brand-navy dark:text-white sm:text-4xl mb-12">
          Loved by Locals
        </h2>
        <div className="mx-auto grid max-w-2xl grid-cols-1 gap-8 lg:mx-0 lg:max-w-none lg:grid-cols-3">
           {[1, 2, 3].map((i) => (
             <div key={i} className="flex flex-col justify-between bg-white dark:bg-brand-dark p-6 shadow-sm rounded-2xl ring-1 ring-gray-200 dark:ring-slate-800 transition-colors">
                <div>
                    <div className="flex gap-1 mb-4">
                        {[...Array(5)].map((_, idx) => (
                            <Star key={idx} className="w-4 h-4 fill-brand-lime text-brand-lime" />
                        ))}
                    </div>
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed italic">
                        "Absolutely blown away by the quality. The attention to detail is unmatched in the market right now. ASCEND has truly elevated my daily routine."
                    </p>
                </div>
                <div className="mt-6 flex items-center gap-x-4">
                    <div className="h-10 w-10 rounded-full bg-gradient-to-br from-brand-lime to-brand-sky"></div>
                    <div>
                        <div className="font-semibold text-gray-900 dark:text-white">Alex Johnson</div>
                        <div className="text-sm text-gray-500">Verified Buyer</div>
                    </div>
                </div>
             </div>
           ))}
        </div>
      </div>
    </div>
  );
};

export default Testimonials;