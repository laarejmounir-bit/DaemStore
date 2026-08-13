import React from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { ShieldCheck, ArrowRight, Cookie, CheckCircle2 } from 'lucide-react';
import { businessConfig } from '../../businessConfig';

export const CookiePolicy = () => {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 py-16 px-6">
      <div className="max-w-4xl mx-auto">
        {/* Navigation back */}
        <div className="mb-8">
          <Link 
            to="/" 
            className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-sm font-bold bg-white/5 hover:bg-white/10 px-5 py-2.5 rounded-xl border border-white/10"
          >
            <ArrowRight className="w-4 h-4" /> العودة للرئيسية
          </Link>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-slate-900/50 backdrop-blur-xl border border-white/10 p-8 md:p-12 rounded-[2.5rem]"
        >
          {/* Header */}
          <div className="flex items-center gap-4 mb-10 pb-8 border-b border-white/10">
            <div className="w-16 h-16 bg-emerald-500 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-500/20 shrink-0">
              <Cookie className="text-slate-950 w-8 h-8" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-white font-display">سياسة ملفات تعريف الارتباط (Cookies)</h1>
              <p className="text-emerald-400 text-sm mt-1 font-medium">شفافية استخدام التقنيات وملفات التتبع في متجر {businessConfig.storeName}</p>
            </div>
          </div>

          <div className="space-y-10 text-right">
            {/* What are cookies */}
            <section className="space-y-3">
              <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                <span className="w-2 h-7 bg-emerald-500 rounded-full inline-block" />
                1. ما هي ملفات تعريف الارتباط؟
              </h2>
              <p className="text-slate-300 leading-relaxed text-base">
                ملفات تعريف الارتباط (Cookies) والتقنيات المشابهة مثل (Local Storage & Session Storage) هي ملفات نصية صغيرة يتم حفظها على جهاز الكمبيوتر أو الهاتف الذكي الخاص بك عند زيارة متجر <strong className="text-emerald-400">{businessConfig.storeName}</strong>.
              </p>
            </section>

            {/* Types of cookies used */}
            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                <span className="w-2 h-7 bg-emerald-500 rounded-full inline-block" />
                2. ما هي الملفات التي نستخدمها ولماذا؟
              </h2>
              
              <div className="space-y-3">
                <div className="p-4 bg-slate-950/60 border border-white/5 rounded-xl space-y-1">
                  <h3 className="text-white font-bold text-sm flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    الملفات الأساسية لتشغيل المتجر (Essential Cookies)
                  </h3>
                  <p className="text-slate-400 text-xs leading-relaxed">
                    تُستخدم لحفظ محتويات سلة الشراء، وحالة التسجيل، والبيانات الضرورية لإكمال عملية الشراء عبر بوابات الدفع بأمان.
                  </p>
                </div>

                <div className="p-4 bg-slate-950/60 border border-white/5 rounded-xl space-y-1">
                  <h3 className="text-white font-bold text-sm flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    ملفات تحسين الأداء والتتبع (Analytics & Tracking)
                  </h3>
                  <p className="text-slate-400 text-xs leading-relaxed">
                    نستخدم تقنيات مثل Pixel / CAPI لقياس استجابة الحملات التسويقية وتحسين سرعة المتجر وتجربة المستخدم بشكل عام دون المساس ببياناتك الحساسة.
                  </p>
                </div>
              </div>
            </section>

            {/* How to control cookies */}
            <section className="space-y-3">
              <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                <span className="w-2 h-7 bg-emerald-500 rounded-full inline-block" />
                3. التحكم في ملفات تعريف الارتباط
              </h2>
              <p className="text-slate-300 text-sm leading-relaxed">
                يمكنك التحكم بملفات تعريف الارتباط أو مسحها في أي وقت من خلال إعدادات المتصفح الخاص بك. يرجى الملاحظة أن تعطيل ملفات تعريف الارتباط الأساسية قد يؤثر على القدرة على حفظ المنتجات بالسلة أو إكمال عملية الشراء في المتجر.
              </p>
            </section>

            {/* Contact */}
            <section className="pt-4 border-t border-white/10">
              <p className="text-slate-400 text-sm">
                لأي استفسارات حول الخصوصية وملفات التتبع، يسعدنا تواصلكم عبر البريد الإلكتروني: 
                <a href={`mailto:${businessConfig.supportEmail}`} className="text-emerald-400 font-mono underline mx-1">{businessConfig.supportEmail}</a>
              </p>
            </section>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default CookiePolicy;
