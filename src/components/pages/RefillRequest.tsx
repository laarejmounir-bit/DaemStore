import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ShieldCheck, ArrowRight, Send, CheckCircle2 } from 'lucide-react';

const RefillRequest = () => {
  const [orderId, setOrderId] = useState('');
  const [username, setUsername] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would send to a backend
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 py-24 px-6">
      <div className="max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-slate-900/50 backdrop-blur-xl border border-white/10 p-12 rounded-[3rem]"
        >
          <div className="flex items-center gap-4 mb-12">
            <div className="w-16 h-16 bg-emerald-500 rounded-[1.5rem] flex items-center justify-center shadow-lg shadow-emerald-500/20">
              <ShieldCheck className="text-slate-950 w-8 h-8" />
            </div>
            <h1 className="text-4xl font-bold text-white font-display">طلب تعويض نقص</h1>
          </div>

          {!submitted ? (
            <form onSubmit={handleSubmit} className="space-y-6 text-right">
              <p className="text-slate-400 mb-8 leading-relaxed">
                إذا لاحظت نقصاً في العدد المطلوب خلال فترة الضمان (30 يوماً)، يرجى تزويدنا بالمعلومات التالية وسنقوم بتعويض النقص فوراً.
              </p>

              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-400 block">رقم الطلب</label>
                <input
                  type="text"
                  required
                  value={orderId}
                  onChange={(e) => setOrderId(e.target.value)}
                  placeholder="مثال: #12345"
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-emerald-500 transition-colors text-right"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-400 block">اسم المستخدم أو رابط المقطع</label>
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="مثال: @daemstore"
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-emerald-500 transition-colors text-right"
                />
              </div>

              <button 
                type="submit"
                className="w-full bg-emerald-500 text-slate-950 py-4 rounded-2xl font-bold text-lg hover:bg-emerald-400 transition-all active:scale-95 flex items-center justify-center gap-2"
              >
                إرسال الطلب <Send className="w-5 h-5 rotate-180" />
              </button>
            </form>
          ) : (
            <div className="text-center py-8">
              <div className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 className="w-10 h-10 text-emerald-500" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-4">تم استلام طلبك!</h2>
              <p className="text-slate-400 mb-8">
                سنقوم بمراجعة طلبك وتعويض النقص في أقرب وقت ممكن. عادة ما يستغرق ذلك من 24 إلى 48 ساعة.
              </p>
              <button 
                onClick={() => window.location.href = '/'}
                className="bg-white/5 text-white px-8 py-4 rounded-2xl font-bold hover:bg-white/10 transition-all flex items-center gap-2 mx-auto"
              >
                العودة للرئيسية <ArrowRight className="w-5 h-5 rotate-180" />
              </button>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default RefillRequest;
