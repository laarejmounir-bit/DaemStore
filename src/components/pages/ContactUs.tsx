import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Clock, Send, ArrowRight, CheckCircle2, ShieldCheck, FileText, Loader2 } from 'lucide-react';
import { businessConfig } from '../../businessConfig';

export const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 1000);
  };

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
          <div className="mb-10 pb-8 border-b border-white/10">
            <h1 className="text-3xl md:text-4xl font-bold text-white font-display">اتصل بنا - خدمة العملاء</h1>
            <p className="text-slate-400 text-sm mt-2">
              نحن هنا لمساعدتك والتأكد من حصولك على أفضل تجربة مع متجر <span className="text-emerald-400 font-bold">{businessConfig.storeName}</span>
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Business Contact Cards */}
            <div className="space-y-4 lg:col-span-1">
              <div className="p-6 bg-slate-950/80 border border-white/5 rounded-2xl space-y-2">
                <div className="w-10 h-10 bg-emerald-500/10 rounded-xl flex items-center justify-center text-emerald-400 mb-3">
                  <Mail className="w-5 h-5" />
                </div>
                <h3 className="text-slate-400 text-xs font-bold uppercase tracking-wider">البريد الإلكتروني المباشر</h3>
                <a 
                  href={`mailto:${businessConfig.supportEmail}`} 
                  className="text-white font-mono font-bold hover:text-emerald-400 transition-colors block text-sm break-all"
                >
                  {businessConfig.supportEmail}
                </a>
              </div>

              <div className="p-6 bg-slate-950/80 border border-white/5 rounded-2xl space-y-2">
                <div className="w-10 h-10 bg-emerald-500/10 rounded-xl flex items-center justify-center text-emerald-400 mb-3">
                  <Phone className="w-5 h-5" />
                </div>
                <h3 className="text-slate-400 text-xs font-bold uppercase tracking-wider">رقم الهاتف للدعم</h3>
                <a 
                  href={`tel:${businessConfig.phone}`} 
                  className="text-white font-mono font-bold hover:text-emerald-400 transition-colors block text-sm dir-ltr text-right"
                >
                  {businessConfig.phone}
                </a>
              </div>

              <div className="p-6 bg-slate-950/80 border border-white/5 rounded-2xl space-y-2">
                <div className="w-10 h-10 bg-emerald-500/10 rounded-xl flex items-center justify-center text-emerald-400 mb-3">
                  <Clock className="w-5 h-5" />
                </div>
                <h3 className="text-slate-400 text-xs font-bold uppercase tracking-wider">ساعات العمل والدعم</h3>
                <p className="text-white text-sm font-medium leading-relaxed">
                  {businessConfig.supportHours}
                </p>
              </div>

              <div className="p-6 bg-slate-950/80 border border-white/5 rounded-2xl space-y-2">
                <div className="w-10 h-10 bg-emerald-500/10 rounded-xl flex items-center justify-center text-emerald-400 mb-3">
                  <MapPin className="w-5 h-5" />
                </div>
                <h3 className="text-slate-400 text-xs font-bold uppercase tracking-wider">المقر التجاري</h3>
                <p className="text-white text-sm font-medium">
                  {businessConfig.address}
                </p>
              </div>

              {/* Legal documents references */}
              <div className="p-5 bg-emerald-500/5 border border-emerald-500/20 rounded-2xl text-xs space-y-1.5 text-slate-300">
                <p><strong className="text-white">الرقم الضريبي:</strong> {businessConfig.vatNumber}</p>
                <p><strong className="text-white">وثيقة العمل الحر:</strong> {businessConfig.freelanceDocNumber}</p>
              </div>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-2 bg-slate-950/60 border border-white/5 p-8 rounded-2xl">
              {submitted ? (
                <div className="text-center py-12 space-y-4">
                  <div className="w-16 h-16 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h3 className="text-2xl font-bold text-white">تم استلام رسالتك بنجاح</h3>
                  <p className="text-slate-400 max-w-md mx-auto text-sm leading-relaxed">
                    شكراً لتواصلك مع متجر {businessConfig.storeName}. سيرد عليك فريق الدعم عبر البريد الإلكتروني المرفق في أقرب وقت.
                  </p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="mt-4 px-6 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-xl text-sm font-bold transition-colors"
                  >
                    إرسال رسالة أخرى
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <h2 className="text-xl font-bold text-white mb-4">أرسل لنا استفسارك</h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-300">الاسم الكامل *</label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="اسمك الكامل"
                        className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-emerald-500 transition-colors"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-300">البريد الإلكتروني *</label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="yourname@domain.com"
                        className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-emerald-500 transition-colors text-left dir-ltr"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-300">رقم التواصل (اختياري)</label>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="05xxxxxxxx"
                        className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-emerald-500 transition-colors text-left dir-ltr"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-300">موضوع الرسالة *</label>
                      <input
                        type="text"
                        required
                        value={formData.subject}
                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                        placeholder="استفسار عن طلب، مشكلة، اقتراح..."
                        className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-emerald-500 transition-colors"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-300">نص الرسالة *</label>
                    <textarea
                      required
                      rows={5}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="اكتب تفاصيل استفسارك هنا..."
                      className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-emerald-500 transition-colors resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl transition-all shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 text-base"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        جاري الإرسال...
                      </>
                    ) : (
                      <>
                        إرسال الرسالة <Send className="w-4 h-4 rotate-180" />
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ContactUs;
