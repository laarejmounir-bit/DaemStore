import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, ShieldCheck, FileText, Zap, Clock, Globe } from 'lucide-react';
import { businessConfig } from '../businessConfig';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-950 border-t border-white/10 py-12 px-6 text-slate-400 text-sm dir-rtl">
      <div className="max-w-7xl mx-auto space-y-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 pb-8 border-b border-white/5">
          {/* Section 1: Store Identity */}
          <div className="space-y-4 lg:col-span-1">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 bg-emerald-500 rounded-xl flex items-center justify-center text-slate-950 font-bold shadow-md shadow-emerald-500/20">
                <Zap className="w-5 h-5 fill-slate-950" />
              </div>
              <span className="text-xl font-bold text-white font-display">{businessConfig.storeName}</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              منصة متخصصة لتقديم الحلول الرقمية والخدمات التسويقية وحلول نمو الحسابات بالمملكة العربية السعودية.
            </p>
            <div className="space-y-1 text-xs text-slate-300">
              <div className="flex items-center gap-2">
                <Globe className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>الدولة: <strong className="text-white">{businessConfig.country}</strong></span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-emerald-400 font-bold text-xs">SAR</span>
                <span>العملة الرسمية: <strong className="text-white">{businessConfig.currencySymbol} ({businessConfig.currency})</strong></span>
              </div>
            </div>
          </div>

          {/* Section 2: Store Quick Links */}
          <div className="space-y-3">
            <h4 className="text-white font-bold text-sm">روابط المتجر</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/" className="hover:text-emerald-400 transition-colors">الصفحة الرئيسية</Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-emerald-400 transition-colors">من نحن (عن المتجر)</Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-emerald-400 transition-colors">اتصل بنا (خدمة العملاء)</Link>
              </li>
              <li>
                <Link to="/refill" className="hover:text-emerald-400 transition-colors">تقديم طلب تعويض نقص</Link>
              </li>
            </ul>
          </div>

          {/* Section 3: Policies */}
          <div className="space-y-3">
            <h4 className="text-white font-bold text-sm">سياسات المتجر</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/terms" className="hover:text-emerald-400 transition-colors">شروط وأحكام الاستخدام</Link>
              </li>
              <li>
                <Link to="/privacy-policy" className="hover:text-emerald-400 transition-colors">سياسة الخصوصية وسرية البيانات</Link>
              </li>
              <li>
                <Link to="/shipping" className="hover:text-emerald-400 transition-colors">سياسة التوصيل والتنفيذ الرقمي</Link>
              </li>
              <li>
                <Link to="/returns" className="hover:text-emerald-400 transition-colors">سياسة الاسترجاع والاسترداد</Link>
              </li>
              <li>
                <Link to="/cookie-policy" className="hover:text-emerald-400 transition-colors">سياسة ملفات تعريف الارتباط</Link>
              </li>
            </ul>
          </div>

          {/* Section 4: Contact Information */}
          <div className="space-y-3">
            <h4 className="text-white font-bold text-sm">التواصل والدعم</h4>
            <ul className="space-y-2.5 text-xs">
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-emerald-400 shrink-0" />
                <a href={`mailto:${businessConfig.supportEmail}`} className="font-mono hover:text-emerald-400 dir-ltr text-right">
                  {businessConfig.supportEmail}
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                <a href={`tel:${businessConfig.phone}`} className="font-mono hover:text-emerald-400 dir-ltr text-right">
                  {businessConfig.phone}
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{businessConfig.supportHours}</span>
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{businessConfig.address}</span>
              </li>
            </ul>
          </div>

          {/* Section 5: Legal & Tax Credentials */}
          <div className="space-y-3">
            <h4 className="text-white font-bold text-sm">بيانات التوثيق والضريبة</h4>
            <div className="space-y-2 text-xs">
              <div className="p-3 bg-white/[0.03] border border-white/5 rounded-xl space-y-1">
                <div className="flex items-center gap-1.5 text-emerald-400 font-bold">
                  <FileText className="w-3.5 h-3.5" />
                  <span>الرقم الضريبي المسجل:</span>
                </div>
                <div className="text-white font-mono font-bold pr-5">{businessConfig.vatNumber}</div>
              </div>

              <div className="p-3 bg-white/[0.03] border border-white/5 rounded-xl space-y-1">
                <div className="flex items-center gap-1.5 text-emerald-400 font-bold">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>وثيقة العمل الحر:</span>
                </div>
                <div className="text-white font-mono font-bold pr-5">{businessConfig.freelanceDocNumber}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Payment badges & Copyright */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 text-xs text-slate-500">
          <div className="space-y-2 text-center md:text-right">
            <p className="text-slate-400 font-bold">© 2026 {businessConfig.storeName}. جميع الحقوق محفوظة.</p>
            <p className="text-slate-600 text-[11px]">
              جميع المعاملات المالية محمية ومشفّرة وفق معايير الأمان البنكي.
            </p>
          </div>

          {/* Payment Badges */}
          <div className="flex flex-wrap items-center justify-center gap-2">
            <div className="bg-white/[0.04] border border-white/10 px-3 py-1.5 rounded-lg text-white/80 text-xs font-bold">
              مدى
            </div>
            <div className="bg-white/[0.04] border border-white/10 px-3 py-1.5 rounded-lg text-white/80 text-xs font-bold">
              فيزا
            </div>
            <div className="bg-white/[0.04] border border-white/10 px-3 py-1.5 rounded-lg text-white/80 text-xs font-bold">
              ماستركارد
            </div>
            <div className="bg-white/[0.04] border border-white/10 px-3 py-1.5 rounded-lg text-white/80 text-xs font-bold">
              Apple Pay
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
