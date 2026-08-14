import React from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { ShieldCheck, ArrowRight, FileText, CheckCircle2 } from 'lucide-react';
import { businessConfig } from '../../businessConfig';

export const TermsOfService = () => {
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
              <FileText className="text-slate-950 w-8 h-8" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-white font-display">شروط وأحكام الاستخدام</h1>
              <p className="text-emerald-400 text-sm mt-1 font-medium">اتفاقية استخدام متجر {businessConfig.storeName}</p>
            </div>
          </div>

          <div className="space-y-10 text-right">
            <section className="space-y-3">
              <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                <span className="w-2 h-7 bg-emerald-500 rounded-full inline-block" />
                1. قبول الشروط والأحكام
              </h2>
              <p className="text-slate-300 leading-relaxed text-base">
                مرحباً بك في متجر <strong className="text-emerald-400">{businessConfig.storeName}</strong>. بإجراء أي طلب أو استخدام خدمات هذا الموقع، فإنك توافق التامة على الالتزام بشروط وأحكام الاستخدام الموضحة هنا وجميع اللوائح والأنظمة المعمول بها في المملكة العربية السعودية.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                <span className="w-2 h-7 bg-emerald-500 rounded-full inline-block" />
                2. طبيعة الخدمات والتنفيذ الرقمي
              </h2>
              <p className="text-slate-300 leading-relaxed text-base">
                جميع المنتجات المتاحة هي خدمات رقمية وحلول تسويقية عبر الإنترنت. يخضع تنفيذ الشحنات الرقمية لضوابط مدة معالجة الطلبات الموضحة في <Link to="/shipping" className="text-emerald-400 font-bold underline">سياسة التوصيل والتنفيذ الرقمي</Link>.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                <span className="w-2 h-7 bg-emerald-500 rounded-full inline-block" />
                3. التزامات العميل ومسؤولية البيانات
              </h2>
              <ul className="space-y-2 text-slate-300 text-sm">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>يتعهد العميل بتزويد المتجر باسم الحساب أو الرابط الصحيح والدقيق.</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>يلتزم العميل بالحفاظ على الحساب عاماً (Public) أثناء فترة تنفيذ الطلب.</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>يتعهد العميل بعدم استخدام الخدمات لأي أغراض تخالف القوانين أو الآداب العامة.</span>
                </li>
              </ul>
            </section>

            <section className="space-y-3">
              <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                <span className="w-2 h-7 bg-emerald-500 rounded-full inline-block" />
                4. سياسة إلغاء الطلبات والاسترداد والتعويض
              </h2>
              <p className="text-slate-300 leading-relaxed text-base">
                تخضع طلبات الإلغاء والاسترداد المالي والتعويض لـ <Link to="/returns" className="text-emerald-400 font-bold underline">سياسة الاسترجاع والاسترداد الرسمية</Link>. يلتزم المتجر بضمان تعويض النقص في حال حدوثه وفق مدة الضمان المحددة لكل باقة.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                <span className="w-2 h-7 bg-emerald-500 rounded-full inline-block" />
                5. الأسعار والضرائب وسائل الدفع
              </h2>
              <p className="text-slate-300 leading-relaxed text-base">
                جميع الأسعار المعروضة بالعملة المحلية ({businessConfig.currencySymbol}) وتشمل كافة الضرائب المطبقة دون أي رسوم إضافية مخفية عند السداد.
              </p>
            </section>

            <section className="pt-4 border-t border-white/10">
              <p className="text-slate-400 text-sm">
                لأي استفسار بخصوص شروط الخدمة، يمكنك التواصل مع فريق الدعم عبر البريد: 
                <a href={`mailto:${businessConfig.supportEmail}`} className="text-emerald-400 font-mono underline mx-1">{businessConfig.supportEmail}</a>
              </p>
            </section>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default TermsOfService;
