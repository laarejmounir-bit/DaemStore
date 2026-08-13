import React from 'react';
import { motion } from 'motion/react';
import { TrendingUp, Music2, Zap, ShieldCheck, Headphones } from 'lucide-react';

export const SEOSection = () => {
  return (
    <section className="py-24 bg-slate-950/50 border-y border-white/5">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-8 leading-tight font-display">
              لماذا تختار <span className="text-emerald-500">داعم ستور</span> لتنمية حسابك؟
            </h2>
            <div className="space-y-6">
              <p className="text-slate-400 text-lg leading-relaxed">
                في عالم التواصل الاجتماعي المتسارع، الحضور الرقمي القوي هو مفتاح النجاح. نحن في داعم ستور نوفر لك الأدوات والخدمات اللازمة للتميز والوصول لجمهور أكبر في وقت قياسي.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-emerald-500/10 rounded-lg flex items-center justify-center shrink-0">
                    <TrendingUp className="w-5 h-5 text-emerald-400" />
                  </div>
                  <div>
                    <h4 className="text-white font-bold mb-1">نمو حقيقي</h4>
                    <p className="text-slate-500 text-sm">استراتيجيات مدروسة لزيادة التفاعل الطبيعي.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-emerald-500/10 rounded-lg flex items-center justify-center shrink-0">
                    <ShieldCheck className="w-5 h-5 text-emerald-400" />
                  </div>
                  <div>
                    <h4 className="text-white font-bold mb-1">أمان تام</h4>
                    <p className="text-slate-500 text-sm">نظامنا يحمي خصوصيتك وحسابك دائماً.</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="absolute inset-0 bg-emerald-500/20 blur-[100px] rounded-full" />
            <div className="relative bg-slate-900/80 backdrop-blur-xl border border-white/10 p-8 rounded-[2.5rem] shadow-2xl">
              <div className="space-y-6">
                <div className="flex items-center gap-4 p-4 bg-white/5 rounded-2xl border border-white/5">
                  <div className="w-12 h-12 bg-emerald-500 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/20">
                    <Music2 className="text-slate-950 w-6 h-6" />
                  </div>
                  <div>
                    <div className="text-white font-bold">خدمات تيك توك المتكاملة</div>
                    <div className="text-slate-500 text-sm">متابعين، لايكات، مشاهدات، إكسبلور</div>
                  </div>
                </div>
                <div className="flex items-center gap-4 p-4 bg-white/5 rounded-2xl border border-white/5">
                  <div className="w-12 h-12 bg-violet-500 rounded-xl flex items-center justify-center shadow-lg shadow-violet-500/20">
                    <Zap className="text-slate-950 w-6 h-6" />
                  </div>
                  <div>
                    <div className="text-white font-bold">سرعة التنفيذ الفائقة</div>
                    <div className="text-slate-500 text-sm">نظام آلي يعمل على مدار الساعة</div>
                  </div>
                </div>
                <div className="flex items-center gap-4 p-4 bg-white/5 rounded-2xl border border-white/5">
                  <div className="w-12 h-12 bg-emerald-500 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/20">
                    <Headphones className="text-slate-950 w-6 h-6" />
                  </div>
                  <div>
                    <div className="text-white font-bold">دعم فني متخصص</div>
                    <div className="text-slate-500 text-sm">جاهزون للرد على استفساراتكم فوراً</div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
