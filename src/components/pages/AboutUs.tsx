import React from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { Zap, ShieldCheck, Headphones, ArrowRight, Award, CheckCircle2, FileText, Phone, Mail, MapPin } from 'lucide-react';
import { businessConfig } from '../../businessConfig';

export const AboutUs = () => {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 py-16 px-6">
      <div className="max-w-5xl mx-auto">
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
              <h1 className="text-3xl md:text-4xl font-bold text-white font-display">من نحن - {businessConfig.storeName}</h1>
              <p className="text-emerald-400 text-sm mt-1 font-medium">منصة متخصصة للخدمات التسويقية والحلول الرقمية بالمملكة العربية السعودية</p>
            </div>
          </div>

          <div className="space-y-10 text-right">
            {/* Overview Section */}
            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                <span className="w-2 h-7 bg-emerald-500 rounded-full inline-block" />
                نبذة عن المتجر
              </h2>
              <p className="text-slate-300 leading-relaxed text-lg">
                متجر <strong className="text-emerald-400">{businessConfig.storeName}</strong> هو منصة متخصصة تقدم حلولاً احترافية في مجال التسويق الرقمي وتعزيز التواجد الرقمي لصناع المحتوى والأنشطة التجارية عبر وسائل التواصل الاجتماعي.
              </p>
              <p className="text-slate-400 leading-relaxed">
                نهدف إلى توفير أدوات وسرعة تنفيذ آمنة تساعد صناع المحتوى والأنشطة التجارية على تحسين انتشار محتواهم وبناء قاعدة جمهور متفاعلة وفق أعلى معايير الشفافية والأمان الرقمي.
              </p>
            </section>

            {/* Core Pillars */}
            <section className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
              <div className="p-6 bg-slate-950/60 border border-white/5 rounded-2xl space-y-3">
                <div className="w-10 h-10 bg-emerald-500/10 rounded-xl flex items-center justify-center text-emerald-400">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <h3 className="text-white font-bold text-lg">أمان موثوق</h3>
                <p className="text-slate-400 text-sm leading-relaxed">
                  لا نطلب كلمة المرور الخاصة بحسابك مطلقاً. جميع المعاملات محميّة بأحدث بروتوكولات التشفير.
                </p>
              </div>

              <div className="p-6 bg-slate-950/60 border border-white/5 rounded-2xl space-y-3">
                <div className="w-10 h-10 bg-emerald-500/10 rounded-xl flex items-center justify-center text-emerald-400">
                  <Zap className="w-6 h-6 fill-emerald-400" />
                </div>
                <h3 className="text-white font-bold text-lg">سرعة التنفيذ</h3>
                <p className="text-slate-400 text-sm leading-relaxed">
                  نظام تنفيذ آلي يستلم الطلبات فور تأكيد عملية الدفع ويبدأ بالمعالجة بمرونة فائقة.
                </p>
              </div>

              <div className="p-6 bg-slate-950/60 border border-white/5 rounded-2xl space-y-3">
                <div className="w-10 h-10 bg-emerald-500/10 rounded-xl flex items-center justify-center text-emerald-400">
                  <Headphones className="w-6 h-6" />
                </div>
                <h3 className="text-white font-bold text-lg">دعم متواصل</h3>
                <p className="text-slate-400 text-sm leading-relaxed">
                  فريق خدمة عملاء متخصص متاح للرد على استفساراتكم ومتابعة طلباتكم بشكل فوري.
                </p>
              </div>
            </section>

            {/* Official Registration & Legal Credentials */}
            <section className="p-8 bg-slate-950/80 border border-emerald-500/20 rounded-2xl space-y-4">
              <h2 className="text-xl font-bold text-white flex items-center gap-3">
                <FileText className="text-emerald-400 w-6 h-6" />
                التوثيق والبيانات القانونية للنشاط
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm pt-2">
                <div className="flex items-center gap-3 p-4 bg-slate-900/50 rounded-xl border border-white/5">
                  <CheckCircle2 className="text-emerald-400 w-5 h-5 shrink-0" />
                  <div>
                    <span className="text-slate-400 block text-xs">الاسم التجاري الرسمي:</span>
                    <span className="text-white font-bold">{businessConfig.legalName}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-4 bg-slate-900/50 rounded-xl border border-white/5">
                  <CheckCircle2 className="text-emerald-400 w-5 h-5 shrink-0" />
                  <div>
                    <span className="text-slate-400 block text-xs">الرقم الضريبي المسجل:</span>
                    <span className="text-white font-mono font-bold">{businessConfig.vatNumber}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-4 bg-slate-900/50 rounded-xl border border-white/5">
                  <CheckCircle2 className="text-emerald-400 w-5 h-5 shrink-0" />
                  <div>
                    <span className="text-slate-400 block text-xs">رقم وثيقة العمل الحر:</span>
                    <span className="text-white font-mono font-bold">{businessConfig.freelanceDocNumber}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-4 bg-slate-900/50 rounded-xl border border-white/5">
                  <MapPin className="text-emerald-400 w-5 h-5 shrink-0" />
                  <div>
                    <span className="text-slate-400 block text-xs">دولة المقر التجاري:</span>
                    <span className="text-white font-bold">{businessConfig.country}</span>
                  </div>
                </div>
              </div>
            </section>

            {/* Direct Contact Links */}
            <section className="pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-4">
              <div className="space-y-1">
                <h3 className="text-white font-bold">هل لديك أي استفسار قبل الشراء؟</h3>
                <p className="text-slate-400 text-sm">يسعدنا تواصلك مع فريق الدعم الفني في أي وقت.</p>
              </div>
              <Link 
                to="/contact" 
                className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 px-6 py-3 rounded-xl font-bold transition-all flex items-center gap-2"
              >
                تواصل معنا <ArrowRight className="w-4 h-4 rotate-180" />
              </Link>
            </section>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AboutUs;
