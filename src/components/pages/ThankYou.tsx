import React from 'react';
import { motion } from 'motion/react';
import { CheckCircle2, ArrowRight, ShoppingBag, Headphones } from 'lucide-react';

const ThankYou = () => {
  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-emerald-500/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[10%] right-[-10%] w-[40%] h-[40%] bg-violet-500/10 blur-[120px] rounded-full" />
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="max-w-xl w-full bg-slate-900/50 backdrop-blur-xl border border-white/10 p-12 rounded-[3rem] text-center relative z-10"
      >
        <div className="w-24 h-24 bg-emerald-500 rounded-[2rem] flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-emerald-500/20">
          <CheckCircle2 className="w-12 h-12 text-slate-950" />
        </div>
        
        <h1 className="text-4xl font-bold text-white mb-4 font-display">شكراً لثقتك بنا!</h1>
        <p className="text-slate-400 text-lg mb-10 leading-relaxed">
          تم استلام طلبك بنجاح. سيبدأ نظامنا الآلي في معالجة طلبك فوراً. ستصلك رسالة تأكيد على بريدك الإلكتروني قريباً.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
          <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
            <div className="text-emerald-400 font-bold text-xl mb-1">فوري</div>
            <div className="text-slate-500 text-xs uppercase font-bold tracking-wider">بدء التنفيذ</div>
          </div>
          <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
            <div className="text-emerald-400 font-bold text-xl mb-1">24/7</div>
            <div className="text-slate-500 text-xs uppercase font-bold tracking-wider">دعم فني</div>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <button 
            onClick={() => window.location.href = '/'}
            className="w-full bg-emerald-500 text-slate-950 py-4 rounded-2xl font-bold text-lg hover:bg-emerald-400 transition-all active:scale-95 flex items-center justify-center gap-2 group"
          >
            العودة للرئيسية <ArrowRight className="w-5 h-5 rotate-180 group-hover:-translate-x-1 transition-transform" />
          </button>
          <button 
            onClick={() => window.open('https://wa.me/966536229261', '_blank')}
            className="w-full bg-white/5 text-white py-4 rounded-2xl font-bold hover:bg-white/10 transition-all flex items-center justify-center gap-2"
          >
            <Headphones className="w-5 h-5" /> تواصل مع الدعم
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default ThankYou;
