import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShoppingCart, Headphones, TrendingUp, Menu, X, Zap, ArrowRight, Music2, CheckCircle2, ChevronDown } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';
import { FEATURES, FAQS } from '../../constants';
import { FAQItem } from '../FAQItem';
import { SEOSection } from '../SEOSection';
import { Modals } from '../Modals';
import { useAppServices, ICON_MAP } from '../../contexts/ServicesContext';

const Home = () => {
  const {
    cart,
    selectedOption, setSelectedOption,
    setSelectedPlan,
    modalStep, setModalStep,
    setTargetLink,
    scrolled,
    isMenuOpen, setIsMenuOpen,
    customTotalPrice,
    customViews
  } = useAppContext();

  const { services, loading } = useAppServices();
  const activeService = services[0] || { options: [], specials: [] };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans selection:bg-emerald-500/30 selection:text-emerald-200 overflow-x-hidden">
      <AnimatePresence>
        {modalStep === 'payment-processing' && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-950/90 backdrop-blur-md"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="relative bg-slate-900 border border-white/10 p-12 rounded-[3rem] text-center max-w-md w-full shadow-2xl"
            >
              <div className="w-24 h-24 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin mx-auto mb-8" />
              <h3 className="text-2xl font-bold text-white mb-4">جاري معالجة طلبك...</h3>
              <p className="text-slate-400">يرجى عدم إغلاق الصفحة، يتم توجيهك الآن لبوابة الدفع الآمنة.</p>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      
      {/* Floating Action Buttons */}
      <div className="fixed bottom-6 left-6 z-[100] flex flex-col gap-4">
        <AnimatePresence>
          {scrolled && (
            <motion.button
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="w-12 h-12 bg-white/10 backdrop-blur-md border border-white/10 rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-all"
            >
              <ChevronDown className="w-6 h-6 rotate-180" />
            </motion.button>
          )}
        </AnimatePresence>
        <button 
          onClick={() => {
            setSelectedOption({ name: 'سلة المشتريات', icon: ShoppingCart, plans: [], label: 'سلة المشتريات' });
            setModalStep('cart-view');
          }}
          className="w-14 h-14 bg-white/10 backdrop-blur-md border border-white/10 rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-all active:scale-95 group relative"
        >
          <ShoppingCart className="w-7 h-7" />
          {cart.length > 0 && (
            <span className="absolute -top-1 -right-1 w-6 h-6 bg-emerald-500 text-slate-950 text-xs font-bold rounded-full flex items-center justify-center border-2 border-slate-950">
              {cart.length}
            </span>
          )}
        </button>
        <button 
          onClick={() => window.open('https://wa.me/966536229261', '_blank')}
          className="w-14 h-14 bg-emerald-500 rounded-full flex items-center justify-center text-slate-950 shadow-2xl shadow-emerald-500/40 hover:scale-110 transition-all active:scale-95 group relative"
        >
          <Headphones className="w-7 h-7" />
          <span className="absolute left-full ml-4 bg-slate-900 text-white px-3 py-1 rounded-lg text-xs font-bold whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity border border-white/10">
            تحدث معنا
          </span>
          <span className="absolute top-0 left-0 w-4 h-4 bg-emerald-400 border-2 border-slate-950 rounded-full animate-pulse" />
        </button>
      </div>

      {/* Navbar */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled ? 'bg-slate-950/80 backdrop-blur-md border-b border-white/5 py-4' : 'bg-transparent py-6'}`}>
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
          <div className="flex items-center gap-2 group cursor-pointer">
            <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/20 group-hover:scale-110 transition-transform">
              <Zap className="text-slate-950 w-6 h-6 fill-slate-950" />
            </div>
            <span className="text-2xl font-bold tracking-tight text-white">داعم <span className="text-emerald-500">ستور</span></span>
          </div>

          <div className="hidden md:flex items-center gap-8">
            {[
              { name: 'الخدمات', id: 'services' },
              { name: 'المميزات', id: 'features' },
              { name: 'الأسئلة الشائعة', id: 'faq' }
            ].map((item) => (
              <a key={item.id} href={`#${item.id}`} className="text-sm font-medium hover:text-emerald-400 transition-colors">
                {item.name}
              </a>
            ))}
            <div className="flex items-center gap-4 border-r border-white/10 pr-8">
              <button 
                onClick={() => {
                  setSelectedOption({ name: 'سلة المشتريات', icon: ShoppingCart, plans: [], label: 'سلة المشتريات' });
                  setModalStep('cart-view');
                }}
                className="relative p-2 text-white hover:text-emerald-400 transition-colors"
              >
                <ShoppingCart className="w-5 h-5" />
                {cart.length > 0 && (
                  <span className="absolute top-0 right-0 w-4 h-4 bg-emerald-500 text-slate-950 text-[10px] font-bold rounded-full flex items-center justify-center">
                    {cart.length}
                  </span>
                )}
              </button>
            </div>
          </div>

          <button className="md:hidden text-white" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X /> : <Menu />}
          </button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="absolute top-full left-0 w-full bg-slate-900 border-b border-white/5 p-6 md:hidden"
            >
              <div className="flex flex-col gap-4">
                {[
                  { name: 'الخدمات', id: 'services' },
                  { name: 'المميزات', id: 'features' },
                  { name: 'الأسئلة الشائعة', id: 'faq' }
                ].map((item) => (
                  <a key={item.id} href={`#${item.id}`} className="text-lg font-medium" onClick={() => setIsMenuOpen(false)}>
                    {item.name}
                  </a>
                ))}
                <button 
                  onClick={() => {
                    setSelectedOption({ name: 'سلة المشتريات', icon: ShoppingCart, plans: [], label: 'سلة المشتريات' });
                    setModalStep('cart-view');
                    setIsMenuOpen(false);
                  }}
                  className="flex items-center justify-between text-lg font-medium text-white"
                >
                  <span>سلة المشتريات</span>
                  <div className="flex items-center gap-2">
                    <ShoppingCart className="w-5 h-5" />
                    {cart.length > 0 && (
                      <span className="bg-emerald-500 text-slate-950 text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center">
                        {cart.length}
                      </span>
                    )}
                  </div>
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-emerald-500/10 blur-[120px] rounded-full" />
          <div className="absolute bottom-[10%] right-[-10%] w-[40%] h-[40%] bg-violet-500/10 blur-[120px] rounded-full" />
        </div>

        <div className="max-w-7xl mx-auto px-6 relative">
          <div className="max-w-3xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-6">
                <Zap className="w-3 h-3" /> يثق بنا أكثر من 50,000 صانع محتوى
              </span>
              <h1 className="text-5xl md:text-8xl font-bold text-white leading-[1.05] mb-8 tracking-tight font-display text-right">
                عزز حضورك <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-emerald-500 to-violet-500">الرقمي فوراً</span>
              </h1>
              <p className="text-lg md:text-xl text-slate-400 mb-10 leading-relaxed max-w-2xl text-right">
                المنصة الأكثر موثوقية لزيادة المتابعين والإعجابات والتفاعل عبر جميع شبكات التواصل الرقمي الرئيسية. سريع وآمن ومضمون.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-end">
                <button 
                  onClick={() => document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' })}
                  className="bg-emerald-500 text-slate-950 px-8 py-4 rounded-2xl font-bold text-lg hover:bg-emerald-400 hover:shadow-lg hover:shadow-emerald-500/20 transition-all active:scale-95 flex items-center justify-center gap-2 group"
                >
                  ابدأ النمو الآن <ArrowRight className="w-5 h-5 group-hover:-translate-x-1 transition-transform rotate-180" />
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Trust Bar */}
      <div className="max-w-7xl mx-auto px-6 -mt-10 relative z-10">
        <div className="bg-slate-900/80 backdrop-blur-xl border border-white/5 rounded-3xl p-8 grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="text-center">
            <div className="text-3xl font-bold text-white mb-1 font-display">50k+</div>
            <div className="text-xs text-slate-500 uppercase tracking-widest font-bold">عملاء سعداء</div>
          </div>
          <div className="text-center border-r border-white/5">
            <div className="text-3xl font-bold text-white mb-1 font-display">1.2M+</div>
            <div className="text-xs text-slate-500 uppercase tracking-widest font-bold">طلبات مكتملة</div>
          </div>
          <div className="text-center border-r border-white/5">
            <div className="text-3xl font-bold text-white mb-1 font-display">4.9/5</div>
            <div className="text-xs text-slate-500 uppercase tracking-widest font-bold">متوسط التقييم</div>
          </div>
          <div className="text-center border-r border-white/5">
            <div className="text-3xl font-bold text-white mb-1 font-display">24/7</div>
            <div className="text-xs text-slate-500 uppercase tracking-widest font-bold">دعم نشط</div>
          </div>
        </div>
      </div>

      {/* Services Section */}
      <section id="services" className="py-24 relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 bg-slate-950" />
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="flex flex-col items-center text-center mb-16">
            <div className="max-w-2xl">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="inline-flex items-center gap-4 bg-slate-900/40 border border-white/10 px-6 md:px-10 py-4 md:py-6 rounded-[2.5rem] mb-8 shadow-2xl backdrop-blur-sm relative group"
              >
                <div className="absolute inset-0 bg-emerald-500/5 blur-2xl rounded-[2.5rem] -z-10 group-hover:bg-emerald-500/10 transition-colors" />
                <div className="w-12 h-12 md:w-16 md:h-16 bg-emerald-500 rounded-2xl md:rounded-[1.5rem] flex items-center justify-center shadow-lg shadow-emerald-500/20 shrink-0">
                  <Music2 className="text-slate-950 w-7 h-7 md:w-9 md:h-9" />
                </div>
                <h2 className="text-3xl md:text-5xl font-bold text-white font-display">خدمات <span className="text-emerald-500">تيك توك</span></h2>
              </motion.div>
              <p className="text-slate-400 text-lg leading-relaxed">اختر الخدمة المناسبة لتنمية حسابك وتعزيز حضورك الرقمي.</p>
            </div>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {activeService.options.map((option, idx) => (
              <motion.div
                key={option.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                onClick={() => {
                  setSelectedOption(option);
                  setModalStep('plans');
                  setSelectedPlan(option.plans[0]);
                  setTargetLink('');
                }}
                className={`relative flex items-center gap-2 sm:gap-4 p-3 sm:p-4 rounded-2xl border transition-all duration-300 group cursor-pointer hover:-translate-y-1 ${
                  selectedOption?.name === option.name 
                    ? 'bg-emerald-500/10 border-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.1)]' 
                    : 'bg-slate-900/50 border-white/10 hover:border-emerald-500/30'
                }`}
              >
                <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center shrink-0 transition-all duration-300 ${
                  selectedOption?.name === option.name 
                    ? 'bg-emerald-500 text-slate-950 scale-110' 
                    : 'bg-white/5 text-emerald-400 group-hover:bg-emerald-500/20'
                }`}>
                  {React.createElement(ICON_MAP[option.iconName] || Music2, { className: "w-5 h-5 sm:w-6 sm:h-6" })}
                </div>
                
                <div className="flex flex-col min-w-0">
                  <span className={`text-sm sm:text-lg font-bold transition-colors truncate ${
                    selectedOption?.name === option.name ? 'text-emerald-400' : 'text-white group-hover:text-emerald-400'
                  }`}>
                    {option.label}
                  </span>
                </div>

                {selectedOption?.name === option.name && (
                  <div className="absolute top-3 left-3">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 fill-emerald-500/20" />
                  </div>
                )}
              </motion.div>
            ))}

            {/* Special Cards */}
            {activeService.specials && activeService.specials.map((special, sIdx) => (
              <motion.div
                key={special.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: (activeService.options.length + sIdx) * 0.1 }}
                onClick={() => {
                  setSelectedOption(special);
                  setModalStep('plans');
                  if (special.isCustom) {
                    setSelectedPlan({
                      name: 'باقة مخصصة',
                      price: customTotalPrice,
                      quantity: customViews.quantity
                    });
                  } else {
                    setSelectedPlan(special.plans[0]);
                  }
                  setTargetLink('');
                }}
                className={`relative flex items-center gap-2 sm:gap-4 p-3 sm:p-4 rounded-2xl border-2 transition-all duration-500 group cursor-pointer hover:-translate-y-1 ${
                  special.isCustom ? 'animate-violet-pulse col-span-2 lg:col-span-1' : 'animate-orange-pulse'
                } ${
                  selectedOption?.name === special.name 
                    ? special.isCustom 
                      ? 'bg-violet-500/20 border-violet-500 shadow-[0_0_30px_rgba(139,92,246,0.4)]'
                      : 'bg-orange-500/20 border-orange-500 shadow-[0_0_30px_rgba(249,115,22,0.4)]' 
                    : special.isCustom
                      ? 'bg-slate-900/50 border-violet-500/40 hover:border-violet-500'
                      : 'bg-slate-900/50 border-orange-500/40 hover:border-orange-500'
                }`}
              >
                <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center shrink-0 transition-all duration-500 ${
                  selectedOption?.name === special.name 
                    ? special.isCustom
                      ? 'bg-violet-500 text-slate-950 scale-110 shadow-lg shadow-violet-500/40'
                      : 'bg-orange-500 text-slate-950 scale-110 shadow-lg shadow-orange-500/40' 
                    : special.isCustom
                      ? 'bg-violet-500/20 text-violet-500 group-hover:bg-violet-500/30'
                      : 'bg-orange-500/20 text-orange-500 group-hover:bg-orange-500/30'
                }`}>
                  {React.createElement(ICON_MAP[special.iconName] || Music2, { className: "w-5 h-5 sm:w-6 sm:h-6" })}
                </div>
                
                <div className="flex flex-col min-w-0 flex-1">
                  <span className={`text-sm sm:text-lg font-bold transition-colors ${
                    special.isCustom ? '' : 'truncate'
                  } ${
                    selectedOption?.name === special.name 
                      ? special.isCustom ? 'text-violet-400' : 'text-orange-400' 
                      : special.isCustom ? 'text-white group-hover:text-violet-400' : 'text-white group-hover:text-orange-400'
                  }`}>
                    {special.label}
                  </span>
                </div>

                {selectedOption?.name === special.name && (
                  <div className="absolute top-3 left-3">
                    <CheckCircle2 className={`w-4 h-4 ${special.isCustom ? 'text-violet-500 fill-violet-500/20' : 'text-orange-500 fill-orange-500/20'}`} />
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {FEATURES.map((feature, idx) => (
              <div key={idx} className="flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-emerald-500/10 rounded-2xl flex items-center justify-center mb-8 text-emerald-400">
                  <feature.icon className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4 font-display">{feature.title}</h3>
                <p className="text-slate-400 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <SEOSection />

      {/* FAQ Section */}
      <section id="faq" className="py-24 bg-slate-900/30">
        <div className="max-w-3xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-4 font-display">الأسئلة الشائعة</h2>
            <p className="text-slate-400">كل ما تحتاج لمعرفته حول خدماتنا.</p>
          </div>
          <div className="space-y-2">
            {FAQS.map((faq, idx) => (
              <FAQItem key={idx} faq={faq} />
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-950 border-t border-white/5 py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col items-center text-center">
            <div className="flex items-center justify-center gap-2 mb-8">
              <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/20">
                <Zap className="text-slate-950 w-6 h-6 fill-slate-950" />
              </div>
              <span className="text-2xl font-bold text-white">داعم <span className="text-emerald-500">ستور</span></span>
            </div>

            {/* Payment Methods */}
            <div className="mb-12 w-full">
              <div className="text-slate-500 text-[10px] md:text-xs font-bold mb-6 uppercase tracking-[0.2em]">طرق دفع آمنة</div>
              <div className="flex flex-wrap justify-center items-center gap-2 md:gap-3">
                <div className="bg-white/[0.03] border border-white/5 px-3 md:px-6 py-1.5 md:py-2.5 rounded-lg md:rounded-xl hover:bg-white/[0.06] transition-colors cursor-default group">
                  <span className="text-white/60 group-hover:text-white transition-colors text-xs md:text-sm font-bold">ابل باي</span>
                </div>

                <div className="bg-white/[0.03] border border-white/5 px-3 md:px-6 py-1.5 md:py-2.5 rounded-lg md:rounded-xl hover:bg-white/[0.06] transition-colors cursor-default group">
                  <span className="text-white/60 group-hover:text-white transition-colors text-xs md:text-sm font-bold">فيزا</span>
                </div>

                <div className="bg-white/[0.03] border border-white/5 px-3 md:px-6 py-1.5 md:py-2.5 rounded-lg md:rounded-xl hover:bg-white/[0.06] transition-colors cursor-default group">
                  <span className="text-white/60 group-hover:text-white transition-colors text-xs md:text-sm font-bold">ماستر كارد</span>
                </div>

                <div className="bg-white/[0.03] border border-white/5 px-3 md:px-6 py-1.5 md:py-2.5 rounded-lg md:rounded-xl hover:bg-white/[0.06] transition-colors cursor-default group">
                  <span className="text-white/60 group-hover:text-white transition-colors text-xs md:text-sm font-bold">مدى</span>
                </div>
              </div>
            </div>

            {/* Business Legal Info */}
            <div className="mb-6 flex flex-col items-center gap-3">
              <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-[10px] md:text-xs text-slate-500">
                <div className="flex items-center gap-1.5">
                  <span className="font-bold">رقم الضريبة:</span>
                  <span className="text-slate-300 font-mono">312923423500003</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="font-bold">رقم السجل التجاري:</span>
                  <span className="text-slate-300 font-mono">1010992342</span>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap justify-center gap-x-8 gap-y-4 text-sm font-medium text-slate-500">
              <a href="/terms" className="hover:text-emerald-400 transition-colors">شروط الخدمة</a>
              <a href="/privacy" className="hover:text-emerald-400 transition-colors">سياسة الخصوصية</a>
              <a href="/refill" className="hover:text-emerald-400 transition-colors">طلب تعويض نقص</a>
            </div>
            
            <div className="mt-12 text-slate-600 text-xs">
              © {new Date().getFullYear()} داعم ستور. جميع الحقوق محفوظة.
            </div>
          </div>
        </div>
      </footer>

      <Modals />
    </div>
  );
};

export default Home;
