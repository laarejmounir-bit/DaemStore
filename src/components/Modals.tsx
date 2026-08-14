import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ChevronDown, ChevronUp, Check, ShoppingCart, Trash2, ArrowRight, CreditCard, ShieldCheck, Zap, Music2, TrendingUp, Headphones, Package, User, Bookmark, Share2, CheckCircle2, Eye, Heart } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { useAppServices, ICON_MAP } from '../contexts/ServicesContext';
import { CUSTOM_VIEWS_PLANS, CUSTOM_LIKES_PLANS, CUSTOM_SAVES_PLANS, CUSTOM_SHARES_PLANS } from '../constants';
import { CartItem } from '../types';

export const Modals = () => {
  const {
    cart, setCart,
    selectedOption, setSelectedOption,
    selectedPlan, setSelectedPlan,
    modalStep, setModalStep,
    targetLink, setTargetLink,
    customViews, setCustomViews,
    customLikes, setCustomLikes,
    customSaves, setCustomSaves,
    customShares, setCustomShares,
    customTotalPrice
  } = useAppContext();

  const addToCart = () => {
    if (!selectedOption || !selectedPlan || !targetLink) return;

    const newItem: CartItem = {
      id: Math.random().toString(36).substr(2, 9),
      serviceName: 'تيك توك',
      optionName: selectedOption.label,
      planName: selectedPlan.name || `${selectedPlan.quantity} ${selectedOption.label}`,
      quantity: selectedPlan.quantity,
      price: Number(selectedPlan.price),
      targetLink,
      icon: ICON_MAP[selectedOption.iconName] || Music2,
      isCustom: selectedOption.isCustom,
      customDetails: selectedOption.isCustom ? {
        views: Number(customViews.quantity.replace('k', '000').replace('M', '1000000')),
        likes: Number(customLikes.quantity.replace('بدون', '0')),
        saves: Number(customSaves.quantity.replace('بدون', '0')),
        shares: Number(customShares.quantity.replace('بدون', '0'))
      } : undefined
    };

    setCart([...cart, newItem]);
    setModalStep('cart-view');
  };

  const removeFromCart = (id: string) => {
    setCart(cart.filter(item => item.id !== id));
  };

  const totalCartPrice = cart.reduce((sum, item) => sum + item.price, 0);

  if (!selectedOption && modalStep !== 'cart-view' && modalStep !== 'checkout') return null;

  return (
    <AnimatePresence>
      {(selectedOption || modalStep === 'cart-view' || modalStep === 'checkout') && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => {
              if (modalStep !== 'payment-processing') {
                setSelectedOption(null);
                setModalStep('plans');
              }
            }}
            className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-2xl bg-slate-900 border border-white/10 rounded-[2.5rem] shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
          >
            {/* Modal Header */}
            <div className="p-6 border-b border-white/5 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-4">
                {selectedOption && (
                  <div className="w-12 h-12 bg-emerald-500 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-500/20">
                    {React.createElement(ICON_MAP[selectedOption.iconName] || Music2, { className: "text-slate-950 w-6 h-6" })}
                  </div>
                )}
                <div>
                  <h3 className="text-xl font-bold text-white">
                    {modalStep === 'cart-view' ? 'سلة المشتريات' : 
                     modalStep === 'checkout' ? 'إتمام الطلب' :
                     selectedOption?.label}
                  </h3>
                  <p className="text-slate-500 text-sm">
                    {modalStep === 'cart-view' ? `${cart.length} منتجات في السلة` :
                     modalStep === 'checkout' ? 'اختر وسيلة الدفع المناسبة' :
                     'اختر الباقة المناسبة لك'}
                  </p>
                </div>
              </div>
              <button 
                onClick={() => {
                  setSelectedOption(null);
                  setModalStep('plans');
                }}
                className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
              {/* Modal Content based on step */}
              {modalStep === 'plans' && selectedOption && (
                <div className="space-y-4">
                  {selectedOption.isCustom ? (
                    <div className="space-y-8 py-4">
                      {/* Custom Plan Selection UI */}
                      <div className="space-y-6">
                        {/* Views */}
                        <div className="space-y-3">
                          <label className="text-sm font-bold text-slate-400 flex items-center gap-2">
                            <Eye className="w-4 h-4" /> عدد المشاهدات
                          </label>
                          <div className="grid grid-cols-4 gap-2">
                            {CUSTOM_VIEWS_PLANS.map((p) => (
                              <button
                                key={p.quantity}
                                onClick={() => setCustomViews(p)}
                                className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                                  customViews.quantity === p.quantity 
                                    ? 'bg-emerald-500 border-emerald-500 text-slate-950' 
                                    : 'bg-white/5 border-white/5 text-slate-400 hover:border-emerald-500/30'
                                }`}
                              >
                                {p.quantity}
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Likes */}
                        <div className="space-y-3">
                          <label className="text-sm font-bold text-slate-400 flex items-center gap-2">
                            <Heart className="w-4 h-4" /> عدد اللايكات
                          </label>
                          <div className="grid grid-cols-5 gap-2">
                            {CUSTOM_LIKES_PLANS.map((p) => (
                              <button
                                key={p.quantity}
                                onClick={() => setCustomLikes(p)}
                                className={`py-2 rounded-xl text-[10px] font-bold border transition-all ${
                                  customLikes.quantity === p.quantity 
                                    ? 'bg-emerald-500 border-emerald-500 text-slate-950' 
                                    : 'bg-white/5 border-white/5 text-slate-400 hover:border-emerald-500/30'
                                }`}
                              >
                                {p.quantity}
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Saves */}
                        <div className="space-y-3">
                          <label className="text-sm font-bold text-slate-400 flex items-center gap-2">
                            <Bookmark className="w-4 h-4" /> عدد الحفظ
                          </label>
                          <div className="grid grid-cols-4 gap-2">
                            {CUSTOM_SAVES_PLANS.map((p) => (
                              <button
                                key={p.quantity}
                                onClick={() => setCustomSaves(p)}
                                className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                                  customSaves.quantity === p.quantity 
                                    ? 'bg-emerald-500 border-emerald-500 text-slate-950' 
                                    : 'bg-white/5 border-white/5 text-slate-400 hover:border-emerald-500/30'
                                }`}
                              >
                                {p.quantity}
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Shares */}
                        <div className="space-y-3">
                          <label className="text-sm font-bold text-slate-400 flex items-center gap-2">
                            <Share2 className="w-4 h-4" /> عدد الشير
                          </label>
                          <div className="grid grid-cols-4 gap-2">
                            {CUSTOM_SHARES_PLANS.map((p) => (
                              <button
                                key={p.quantity}
                                onClick={() => setCustomShares(p)}
                                className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                                  customShares.quantity === p.quantity 
                                    ? 'bg-emerald-500 border-emerald-500 text-slate-950' 
                                    : 'bg-white/5 border-white/5 text-slate-400 hover:border-emerald-500/30'
                                }`}
                              >
                                {p.quantity}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="p-6 bg-emerald-500/10 border border-emerald-500/20 rounded-3xl">
                        <div className="flex items-center justify-between mb-4">
                          <span className="text-slate-400 font-bold">السعر الإجمالي</span>
                          <div className="text-right">
                            <span className="text-3xl font-bold text-emerald-400 font-display">{customTotalPrice}</span>
                            <span className="text-emerald-400/60 text-sm mr-1">ريال</span>
                          </div>
                        </div>
                        <button
                          onClick={() => {
                            setSelectedPlan({
                              name: 'باقة مخصصة',
                              price: customTotalPrice,
                              quantity: customViews.quantity
                            });
                            setModalStep('link');
                          }}
                          className="w-full bg-emerald-500 text-slate-950 py-4 rounded-2xl font-bold text-lg hover:bg-emerald-400 transition-all active:scale-95"
                        >
                          تأكيد الباقة المخصصة
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {selectedOption.plans.map((plan) => (
                        <button
                          key={plan.quantity}
                          onClick={() => {
                            setSelectedPlan(plan);
                            setModalStep('link');
                          }}
                          className="flex items-center justify-between p-4 bg-white/5 border border-white/5 rounded-2xl hover:border-emerald-500/50 hover:bg-white/10 transition-all group text-right"
                        >
                          <div>
                            <div className="text-lg font-bold text-white group-hover:text-emerald-400 transition-colors">
                              {plan.name || `${plan.quantity} ${selectedOption.label}`}
                            </div>
                            {plan.details && (
                              <div className="text-xs text-slate-500 mt-1">
                                {plan.details.join(' • ')}
                              </div>
                            )}
                          </div>
                          <div className="text-left">
                            {plan.oldPrice && (
                              <div className="text-xs text-slate-500 line-through mb-1">{plan.oldPrice} ريال</div>
                            )}
                            <div className="text-xl font-bold text-emerald-400 font-display">{plan.price} <span className="text-xs font-normal opacity-60">ريال</span></div>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {modalStep === 'link' && selectedPlan && (
                <div className="space-y-6 py-4">
                  <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex items-center justify-between">
                    <div>
                      <div className="text-slate-400 text-sm mb-1">الباقة المختارة</div>
                      <div className="text-white font-bold">{selectedPlan.name || `${selectedPlan.quantity} ${selectedOption?.label}`}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-slate-400 text-sm mb-1">السعر</div>
                      <div className="text-emerald-400 font-bold">{selectedPlan.price} ريال</div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <label className="text-sm font-bold text-slate-400 block">
                      {selectedOption?.name === 'متابعين' ? 'اسم المستخدم (بدون @)' : 'رابط المقطع'}
                    </label>
                    <input
                      type="text"
                      value={targetLink}
                      onChange={(e) => setTargetLink(e.target.value)}
                      placeholder={selectedOption?.name === 'متابعين' ? 'مثال: daemstore' : 'https://www.tiktok.com/@...'}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-emerald-500 transition-colors text-left dir-ltr"
                    />
                    <p className="text-xs text-slate-500 flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4" /> تأكد أن الحساب عام وليس خاص (Private)
                    </p>
                  </div>

                  <div className="flex gap-4 pt-4">
                    <button
                      onClick={() => setModalStep('plans')}
                      className="flex-1 bg-white/5 text-white py-4 rounded-2xl font-bold hover:bg-white/10 transition-all"
                    >
                      رجوع
                    </button>
                    <button
                      disabled={!targetLink}
                      onClick={addToCart}
                      className="flex-[2] bg-emerald-500 text-slate-950 py-4 rounded-2xl font-bold text-lg hover:bg-emerald-400 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      إضافة للسلة
                    </button>
                  </div>
                </div>
              )}

              {modalStep === 'cart-view' && (
                <div className="space-y-6 py-4">
                  {cart.length === 0 ? (
                    <div className="text-center py-12">
                      <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6">
                        <ShoppingCart className="w-10 h-10 text-slate-700" />
                      </div>
                      <h4 className="text-xl font-bold text-white mb-2">السلة فارغة</h4>
                      <p className="text-slate-500 mb-8">أضف بعض الخدمات لتبدأ نمو حسابك</p>
                      <button
                        onClick={() => setSelectedOption(null)}
                        className="bg-emerald-500 text-slate-950 px-8 py-3 rounded-xl font-bold hover:bg-emerald-400 transition-all"
                      >
                        تصفح الخدمات
                      </button>
                    </div>
                  ) : (
                    <>
                      <div className="space-y-4">
                        {cart.map((item) => (
                          <div key={item.id} className="p-4 bg-white/5 border border-white/5 rounded-2xl flex items-center justify-between group">
                            <div className="flex items-center gap-4">
                              <div className="w-12 h-12 bg-emerald-500/10 rounded-xl flex items-center justify-center text-emerald-400">
                                <item.icon className="w-6 h-6" />
                              </div>
                              <div>
                                <div className="text-white font-bold">{item.planName}</div>
                                <div className="text-slate-500 text-xs truncate max-w-[150px] sm:max-w-[250px]">{item.targetLink}</div>
                              </div>
                            </div>
                            <div className="flex items-center gap-4">
                              <div className="text-left">
                                <div className="text-emerald-400 font-bold font-display">{item.price} ريال</div>
                              </div>
                              <button
                                onClick={() => removeFromCart(item.id)}
                                className="p-2 text-slate-600 hover:text-red-400 transition-colors"
                              >
                                <Trash2 className="w-5 h-5" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="p-6 bg-slate-950/50 border border-white/5 rounded-3xl space-y-4">
                        <div className="flex items-center justify-between text-lg font-bold">
                          <span className="text-slate-400">المجموع الإجمالي</span>
                          <span className="text-white font-display">{totalCartPrice} ريال</span>
                        </div>
                        <div className="flex gap-4">
                          <button
                            onClick={() => setSelectedOption(null)}
                            className="flex-1 bg-white/5 text-white py-4 rounded-2xl font-bold hover:bg-white/10 transition-all"
                          >
                            إضافة المزيد
                          </button>
                          <button
                            onClick={() => setModalStep('checkout')}
                            className="flex-[2] bg-emerald-500 text-slate-950 py-4 rounded-2xl font-bold text-lg hover:bg-emerald-400 transition-all active:scale-95 flex items-center justify-center gap-2"
                          >
                            إتمام الطلب <ArrowRight className="w-5 h-5 rotate-180" />
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              )}

              {modalStep === 'checkout' && (
                <div className="space-y-8 py-4">
                  <div className="p-6 bg-emerald-500/10 border border-emerald-500/20 rounded-3xl flex items-center justify-between">
                    <div>
                      <div className="text-slate-400 text-sm mb-1">المبلغ المطلوب دفعه</div>
                      <div className="text-3xl font-bold text-emerald-400 font-display">{totalCartPrice} ريال</div>
                    </div>
                    <div className="w-16 h-16 bg-emerald-500 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-500/20">
                      <CreditCard className="text-slate-950 w-8 h-8" />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="text-lg font-bold text-white mb-4">اختر وسيلة الدفع</h4>
                    <div className="grid grid-cols-1 gap-4">
                      <button 
                        className="flex items-center justify-between p-6 bg-white/5 border border-emerald-500/30 rounded-2xl hover:bg-white/10 transition-all group"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-emerald-500/10 rounded-xl flex items-center justify-center text-emerald-400">
                            <CreditCard className="w-6 h-6" />
                          </div>
                          <div className="text-right">
                            <div className="text-white font-bold">مدى / فيزا / ماستركارد</div>
                            <div className="text-slate-500 text-xs">دفع آمن عبر بوابة Payzaty</div>
                          </div>
                        </div>
                        <div className="w-6 h-6 rounded-full border-2 border-emerald-500 flex items-center justify-center">
                          <div className="w-3 h-3 bg-emerald-500 rounded-full" />
                        </div>
                      </button>

                      <button 
                        className="flex items-center justify-between p-6 bg-white/5 border border-white/5 rounded-2xl hover:bg-white/10 transition-all group opacity-60 grayscale cursor-not-allowed"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center text-slate-400">
                            <span className="font-bold text-xs">Apple</span>
                          </div>
                          <div className="text-right">
                            <div className="text-white font-bold">Apple Pay</div>
                            <div className="text-slate-500 text-xs">قريباً...</div>
                          </div>
                        </div>
                      </button>
                    </div>
                  </div>

                  <div className="flex gap-4 pt-4">
                    <button
                      onClick={() => setModalStep('cart-view')}
                      className="flex-1 bg-white/5 text-white py-4 rounded-2xl font-bold hover:bg-white/10 transition-all"
                    >
                      رجوع للسلة
                    </button>
                    <button
                      className="flex-[2] bg-emerald-500 text-slate-950 py-4 rounded-2xl font-bold text-lg hover:bg-emerald-400 transition-all active:scale-95"
                    >
                      تأكيد ودفع {totalCartPrice} ريال
                    </button>
                  </div>
                  
                  <p className="text-center text-slate-500 text-xs flex items-center justify-center gap-2">
                    <ShieldCheck className="w-4 h-4" /> جميع المعاملات مشفرة وآمنة 100%
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
