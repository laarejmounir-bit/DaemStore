import React from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { ShieldCheck, ArrowRight, Lock, CheckCircle2 } from 'lucide-react';
import { businessConfig } from '../../businessConfig';

export const PrivacyPolicy = () => {
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
              <ShieldCheck className="text-slate-950 w-8 h-8" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-white font-display">سياسة الخصوصية وسرية البيانات</h1>
              <p className="text-emerald-400 text-sm mt-1 font-medium">التزام متجر {businessConfig.storeName} بحماية أمان وخصوصية مستخدمينا</p>
            </div>
          </div>

          <div className="space-y-10 text-right">
            <section className="space-y-3">
              <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                <span className="w-2 h-7 bg-emerald-500 rounded-full inline-block" />
                1. جمع المعلومات والبيانات
              </h2>
              <p className="text-slate-300 leading-relaxed text-base">
                نقوم في <strong className="text-emerald-400">{businessConfig.storeName}</strong> بجمع البيانات الضرورية اللازمة فقط لمعالجة وتنفيذ طلباتك. تشمل البيانات المجموعة: اسم المستخدم أو رابط المقطع المطلوب معالجته (بدون كلمة المرور)، عنوان البريد الإلكتروني، ورقم التواصل عند تزويده.
              </p>
              <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-300 text-sm flex items-center gap-3">
                <Lock className="w-5 h-5 shrink-0" />
                <span><strong>ضمان الأمان المطلق:</strong> نحن لا نطلب إطلاقاً كلمات المرور الحساباتكم ولا نحفظ أي بيانات دخول سرية.</span>
              </div>
            </section>

            <section className="space-y-3">
              <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                <span className="w-2 h-7 bg-emerald-500 rounded-full inline-block" />
                2. كيفية استخدام البيانات المعالجة
              </h2>
              <p className="text-slate-300 leading-relaxed text-base">
                نستخدم المعلومات التي نجمعها لغايات:
              </p>
              <ul className="space-y-2 text-slate-300 text-sm">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>تأكيد ومعالجة الطلبات وتنفيذ الخدمات الرقمية المطلوبة.</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>إرسال الفواتير الإلكترونية وتحديثات حالة الطلب عبر البريد الإلكتروني.</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>تقديم الدعم الفني والرد على استفسارات العملاء.</span>
                </li>
              </ul>
            </section>

            <section className="space-y-3">
              <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                <span className="w-2 h-7 bg-emerald-500 rounded-full inline-block" />
                3. معالجة عمليات الدفع الإلكتروني
              </h2>
              <p className="text-slate-300 leading-relaxed text-base">
                تتم عمليات الدفع الإلكتروني عن طريق مزودي بوابات الدفع المعتمدين بالمرخصين (مثل بوابة Payzaty وبطاقات مدى وفيزا وماستركارد وApple Pay). نحن لا نخزن أي بيانات لبطاقات الائتمان أو أرقام المدى على خوادمنا نهائياً.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                <span className="w-2 h-7 bg-emerald-500 rounded-full inline-block" />
                4. مشاركة وحماية البيانات مع أطراف ثالثة
              </h2>
              <p className="text-slate-300 leading-relaxed text-base">
                نحن نلتزم بعدم بيع أو تأجير أو مشاركة بيانات العميل مع أي طرف ثالث لأغراض تجارية أو تسويقية. يتم كشف البيانات فقط عند الحاجة التنفيذية المباشرة للطلب أو الامتثال للأنظمة واللوائح الرسمية بالمملكة العربية السعودية.
              </p>
            </section>

            <section className="pt-4 border-t border-white/10">
              <p className="text-slate-400 text-sm">
                لأي استفسار بخصوص سياسة الخصوصية وحماية البيانات، يرجى التواصل عبر البريد الرسمي: 
                <a href={`mailto:${businessConfig.supportEmail}`} className="text-emerald-400 font-mono underline mx-1">{businessConfig.supportEmail}</a>
              </p>
            </section>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
