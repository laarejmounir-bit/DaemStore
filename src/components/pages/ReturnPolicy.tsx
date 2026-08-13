import React from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { ShieldCheck, RefreshCw, AlertCircle, ArrowRight, CheckCircle2, CreditCard, Mail } from 'lucide-react';
import { businessConfig } from '../../businessConfig';

export const ReturnPolicy = () => {
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
              <h1 className="text-3xl md:text-4xl font-bold text-white font-display">سياسة الاسترجاع والاسترداد والتعويض</h1>
              <p className="text-emerald-400 text-sm mt-1 font-medium">الشروط والأحكام الخاصة بالإلغاء والاسترداد بمتجر {businessConfig.storeName}</p>
            </div>
          </div>

          <div className="space-y-10 text-right">
            {/* Overview */}
            <section className="space-y-3">
              <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                <span className="w-2 h-7 bg-emerald-500 rounded-full inline-block" />
                1. مقدمة واسترجاع الخدمات الرقمية
              </h2>
              <p className="text-slate-300 leading-relaxed text-base">
                نظراً لأن جميع الخدمات والمنتجات المقدمة في متجر <strong className="text-emerald-400">{businessConfig.storeName}</strong> هي خدمات رقمية فورية ومباشرة، فإن الاسترجاع والتعويض يخضع لضوابط واضحة ومحددة لحماية حقوق العميل والمتجر على حد سواء.
              </p>
            </section>

            {/* Refund Eligibility */}
            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                <span className="w-2 h-7 bg-emerald-500 rounded-full inline-block" />
                2. الحالات التي يحق فيها للعميل استرداد كامل المبلغ
              </h2>
              <div className="space-y-3">
                <div className="p-4 bg-slate-950/60 border border-white/5 rounded-xl flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <h3 className="text-white font-bold text-sm">عدم بدء تنفيذ الخدمة</h3>
                    <p className="text-slate-400 text-xs mt-1">إذا لم يتم البدء في تنفيذ الطلب إطلاقاً خلال 72 ساعة من وقت السداد وبدون أي سبب تقني خارج عن الإرادة.</p>
                  </div>
                </div>

                <div className="p-4 bg-slate-950/60 border border-white/5 rounded-xl flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <h3 className="text-white font-bold text-sm">تكرار عملية الدفع بالخطأ</h3>
                    <p className="text-slate-400 text-xs mt-1">إذا تم خصم قيمة الطلب أكثر من مرة بسبب خلل في بوابة الدفع الإلكتروني، يتم استرداد المبلغ المخصوم بالزيادة فوراً.</p>
                  </div>
                </div>

                <div className="p-4 bg-slate-950/60 border border-white/5 rounded-xl flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <h3 className="text-white font-bold text-sm">إلغاء الطلب قبل معالجته</h3>
                    <p className="text-slate-400 text-xs mt-1">إذا تقدم العميل بطلب إلغاء الخدمة قبل تحول حالة الطلب إلى "قيد المعالجة" أو "تم البدء".</p>
                  </div>
                </div>
              </div>
            </section>

            {/* Non-Eligible Cases */}
            <section className="space-y-3">
              <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                <span className="w-2 h-7 bg-emerald-500 rounded-full inline-block" />
                3. الحالات الاستثنائية التي لا يحق فيها الاسترداد
              </h2>
              <ul className="space-y-3 text-slate-300 text-sm">
                <li className="flex items-start gap-3 p-3 bg-red-500/5 border border-red-500/10 rounded-xl">
                  <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                  <span>إدخال العميل لرابط أو اسم مستخدم خاطئ لا يخصه أو غير موجود.</span>
                </li>
                <li className="flex items-start gap-3 p-3 bg-red-500/5 border border-red-500/10 rounded-xl">
                  <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                  <span>تغيير اسم المستخدم (Handle) أو إغلاق الحساب أو تحويله إلى حساب خاص (Private) أثناء تنفيذ الخدمة.</span>
                </li>
                <li className="flex items-start gap-3 p-3 bg-red-500/5 border border-red-500/10 rounded-xl">
                  <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                  <span>بعد اكتمال تنفيذ الخدمة وتسليمها بالكامل وفق الكمية والمواصفات المطلوبة.</span>
                </li>
              </ul>
            </section>

            {/* Refill / Compensation Guarantee */}
            <section className="space-y-3 p-6 bg-slate-950/80 border border-white/5 rounded-2xl">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <RefreshCw className="w-5 h-5 text-emerald-400" />
                4. سياسة التعويض ونقص الأعداد (Refill Guarantee)
              </h2>
              <p className="text-slate-300 text-sm leading-relaxed">
                تتضمن الباقات المشمولة بضمان التعويض ضماناً لتعبئة واستكمال أي نقص قد يحدث خلال فترة الضمان الموضحة تفاصيلها في الباقة.
              </p>
              <div className="pt-2">
                <Link 
                  to="/refill" 
                  className="inline-flex items-center gap-2 text-emerald-400 font-bold hover:underline text-sm"
                >
                  اضغط هنا لتقديم طلب تعويض نقص أعداد <ArrowRight className="w-4 h-4 rotate-180" />
                </Link>
              </div>
            </section>

            {/* Refund Process & Timeline */}
            <section className="space-y-3">
              <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                <CreditCard className="w-6 h-6 text-emerald-400" />
                5. طريقة ومدة إرجاع الأموال المستردة
              </h2>
              <p className="text-slate-300 text-sm leading-relaxed">
                عند الموافقة على طلب الاسترداد المالي، يتم إصدار المبلغ المسترد لنفس بطاقة الدفع أو طريقة السداد الأصلية التي استخدمها العميل أثناء الشراء عبر بوابة الدفع الإلكتروني معالجة الطلب استرجاع المبلغ خلال <strong>3 إلى 7 أيام عمل</strong> حسب البنك المصدر للبطاقة.
              </p>
            </section>

            {/* Support contact */}
            <section className="pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-4">
              <div className="space-y-1">
                <h3 className="text-white font-bold">تواصل مع قسم المبالغ المرتجعة والدعم</h3>
                <p className="text-slate-400 text-sm">
                  للتقدم بطلب استرداد مالي، يرجى التواصل عبر البريد الرسمي: 
                  <a href={`mailto:${businessConfig.supportEmail}`} className="text-emerald-400 font-mono underline mx-1">{businessConfig.supportEmail}</a>
                </p>
              </div>
            </section>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ReturnPolicy;
