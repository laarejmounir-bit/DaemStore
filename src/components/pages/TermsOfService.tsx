import React from 'react';
import { motion } from 'motion/react';
import { ShieldCheck, ArrowRight } from 'lucide-react';

const TermsOfService = () => {
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
            <h1 className="text-4xl font-bold text-white font-display">شروط الخدمة</h1>
          </div>

          <div className="space-y-10 text-right">
            <section>
              <h2 className="text-2xl font-bold text-white mb-4">1. قبول الشروط</h2>
              <p className="text-slate-400 leading-relaxed text-lg">
                باستخدامك لموقع داعم ستور، فإنك توافق على الالتزام بشروط الخدمة هذه وجميع القوانين واللوائح المعمول بها. إذا كنت لا توافق على أي من هذه الشروط، فيُحظر عليك استخدام هذا الموقع أو الوصول إليه.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">2. ترخيص الاستخدام</h2>
              <p className="text-slate-400 leading-relaxed text-lg">
                يُمنح الإذن بتنزيل نسخة واحدة مؤقتة من المواد (المعلومات أو البرامج) الموجودة على موقع داعم ستور للاستخدام الشخصي غير التجاري فقط. هذا هو منح ترخيص، وليس نقل ملكية.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">3. إخلاء المسؤولية</h2>
              <p className="text-slate-400 leading-relaxed text-lg">
                يتم توفير المواد الموجودة على موقع داعم ستور "كما هي". لا يقدم داعم ستور أي ضمانات، صريحة أو ضمنية، وتخلي مسؤوليتها بموجب هذا وتنفي جميع الضمانات الأخرى، بما في ذلك على سبيل المثال لا الحصر، الضمانات الضمنية أو شروط القابلية للتسويق أو الملاءمة لغرض معين.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">4. القيود</h2>
              <p className="text-slate-400 leading-relaxed text-lg">
                لا يتحمل داعم ستور أو موردوه بأي حال من الأحوال المسؤولية عن أي أضرار (بما في ذلك، على سبيل المثال لا الحصر، الأضرار الناجمة عن فقدان البيانات أو الأرباح، أو بسبب انقطاع الأعمال) الناشئة عن استخدام أو عدم القدرة على استخدام المواد الموجودة على موقع داعم ستور.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">5. سياسة الاسترجاع</h2>
              <p className="text-slate-400 leading-relaxed text-lg">
                نظراً لطبيعة الخدمات الرقمية التي نقدمها، فإن جميع المبيعات نهائية. لا يتم إصدار استرداد للأموال بمجرد بدء معالجة الطلب. في حال وجود نقص في العدد، نلتزم بتعويض النقص وفقاً لسياسة الضمان الموضحة في كل خدمة.
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

export default TermsOfService;
