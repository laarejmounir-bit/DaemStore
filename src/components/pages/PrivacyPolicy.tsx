import React from 'react';
import { motion } from 'motion/react';
import { ShieldCheck, ArrowRight } from 'lucide-react';

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 py-24 px-6">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-slate-900/50 backdrop-blur-xl border border-white/10 p-12 rounded-[3rem]"
        >
          <div className="flex items-center gap-4 mb-12">
            <div className="w-16 h-16 bg-emerald-500 rounded-[1.5rem] flex items-center justify-center shadow-lg shadow-emerald-500/20">
              <ShieldCheck className="text-slate-950 w-8 h-8" />
            </div>
            <h1 className="text-4xl font-bold text-white font-display">سياسة الخصوصية</h1>
          </div>

          <div className="space-y-10 text-right">
            <section>
              <h2 className="text-2xl font-bold text-white mb-4">1. جمع المعلومات</h2>
              <p className="text-slate-400 leading-relaxed text-lg">
                نقوم بجمع المعلومات الضرورية فقط لمعالجة طلباتك وتقديم أفضل خدمة ممكنة. يشمل ذلك اسم المستخدم الخاص بك على منصات التواصل الاجتماعي (بدون كلمة المرور)، وعنوان البريد الإلكتروني، ومعلومات الدفع الضرورية.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">2. استخدام المعلومات</h2>
              <p className="text-slate-400 leading-relaxed text-lg">
                نستخدم المعلومات التي نجمعها لتنفيذ طلباتك، والتواصل معك بشأن حالة الطلب، وتحسين خدماتنا وتجربة المستخدم على موقعنا.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">3. حماية المعلومات</h2>
              <p className="text-slate-400 leading-relaxed text-lg">
                نحن نطبق مجموعة متنوعة من الإجراءات الأمنية للحفاظ على سلامة معلوماتك الشخصية. نستخدم تقنيات التشفير المتقدمة لحماية البيانات الحساسة المنقولة عبر الإنترنت.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">4. ملفات تعريف الارتباط (Cookies)</h2>
              <p className="text-slate-400 leading-relaxed text-lg">
                نستخدم ملفات تعريف الارتباط لتحسين الوصول إلى موقعنا وتحديد الزوار المتكررين. كما تساعدنا ملفات تعريف الارتباط في تتبع واستهداف اهتمامات مستخدمينا لتعزيز تجربتهم على موقعنا.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">5. الإفصاح لأطراف ثالثة</h2>
              <p className="text-slate-400 leading-relaxed text-lg">
                نحن لا نبيع أو نتاجر أو ننقل معلوماتك الشخصية إلى أطراف خارجية. لا يشمل ذلك الأطراف الثالثة الموثوقة التي تساعدنا في تشغيل موقعنا أو إجراء أعمالنا، طالما وافقت هذه الأطراف على الحفاظ على سرية هذه المعلومات.
              </p>
            </section>
          </div>

          <div className="mt-16 pt-8 border-t border-white/5">
            <button 
              onClick={() => window.location.href = '/'}
              className="bg-emerald-500 text-slate-950 px-8 py-4 rounded-2xl font-bold text-lg hover:bg-emerald-400 transition-all flex items-center gap-2 group mx-auto"
            >
              العودة للرئيسية <ArrowRight className="w-5 h-5 rotate-180 group-hover:-translate-x-1 transition-transform" />
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
