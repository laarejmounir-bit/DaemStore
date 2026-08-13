import React from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { Zap, Clock, ShieldCheck, ArrowRight, CheckCircle2, AlertCircle, RefreshCw } from 'lucide-react';
import { businessConfig } from '../../businessConfig';

export const ShippingPolicy = () => {
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
              <Zap className="text-slate-950 w-8 h-8 fill-slate-950" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-white font-display">سياسة التوصيل والتنفيذ الرقمي</h1>
              <p className="text-emerald-400 text-sm mt-1 font-medium">آلية ومدد تنفيذ الخدمات لمتجر {businessConfig.storeName}</p>
            </div>
          </div>

          <div className="space-y-10 text-right">
            {/* Nature of Products */}
            <section className="space-y-3">
              <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                <span className="w-2 h-7 bg-emerald-500 rounded-full inline-block" />
                1. طبيعة التسليم والخدمات
              </h2>
              <p className="text-slate-300 leading-relaxed text-base">
                جميع المنتجات والخدمات المعروضة في متجر <strong className="text-emerald-400">{businessConfig.storeName}</strong> هي خدمات رقمية بالكامل (Digital Services). يتم التنفيذ والتسليم عبر الإنترنت مباشرة إلى الحساب أو الرابط الذي يزوده العميل أثناء إجراء الطلب.
              </p>
              <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-300 text-sm flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 shrink-0" />
                <span>رسوم التوصيل الشحن الرقمي هي <strong>0 ريال (مجاناً بالكامل)</strong> لكافة الطلبات والخدمات.</span>
              </div>
            </section>

            {/* Delivery Time & Execution Window */}
            <section className="space-y-3">
              <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                <span className="w-2 h-7 bg-emerald-500 rounded-full inline-block" />
                2. وقت بدء المعالجة ومدة التنفيذ
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                <div className="p-5 bg-slate-950/60 border border-white/5 rounded-xl space-y-2">
                  <div className="flex items-center gap-2 text-emerald-400 font-bold text-base">
                    <Clock className="w-5 h-5" />
                    وقت بدء التنفيذ
                  </div>
                  <p className="text-slate-400 text-sm leading-relaxed">
                    يبدأ النظام الآلي بمعالجة الطلب خلال فترة تتراوح بين <strong>فورية إلى 24 ساعة</strong> من تاريخ تأكيد الشراء واستلام المبلغ.
                  </p>
                </div>

                <div className="p-5 bg-slate-950/60 border border-white/5 rounded-xl space-y-2">
                  <div className="flex items-center gap-2 text-emerald-400 font-bold text-base">
                    <Zap className="w-5 h-5 fill-emerald-400" />
                    مدة اكتمل الخدمة
                  </div>
                  <p className="text-slate-400 text-sm leading-relaxed">
                    تختلف مدة الاكتمل حسب حجم الباقة المطلوبة وسعة المنصة، حيث يستغرق تنفيذ أغلب الباقات ما بين <strong>24 ساعة إلى 72 ساعة</strong>.
                  </p>
                </div>
              </div>
            </section>

            {/* Requirements for Successful Delivery */}
            <section className="space-y-3">
              <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                <span className="w-2 h-7 bg-emerald-500 rounded-full inline-block" />
                3. شروط التوصيل والتنفيذ الناجح
              </h2>
              <ul className="space-y-3 text-slate-300 text-sm">
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  <span>أن يكون الحساب المستهدف على المنصة <strong>عاماً (Public)</strong> وليس خاصاً (Private) طوال فترة تنفيذ الطلب.</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  <span>إدخال اسم المستخدم (Username) أو رابط المقطع بشكل صحيح ودقيق بدون أخطاء إملائية.</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  <span>عدم تغيير اسم الحساب (Handle) أو تحويله إلى خاص أثناء فترة معالجة وإكمال التنفيذ.</span>
                </li>
              </ul>
            </section>

            {/* Delays & Support */}
            <section className="space-y-3 p-6 bg-slate-950/80 border border-white/5 rounded-2xl">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-emerald-400" />
                4. إجراءات التأخير أو التعثر في التوصيل
              </h2>
              <p className="text-slate-400 text-sm leading-relaxed">
                في حال وجود تحديثات في خوارزميات المنصة أو ضغط تشغيلي وتأخر تنفيذ طلبك لأكثر من 48 ساعة، يرجى التواصل فوراً مع الدعم الفني عبر البريد 
                <a href={`mailto:${businessConfig.supportEmail}`} className="text-emerald-400 underline font-mono mx-1">{businessConfig.supportEmail}</a> 
                أو تقديم طلب عبر صفحة <Link to="/refill" className="text-emerald-400 underline font-bold">طلب تعويض نقص</Link>.
              </p>
            </section>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ShippingPolicy;
