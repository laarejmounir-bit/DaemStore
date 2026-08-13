import React, { useState, useEffect, useRef } from 'react';
import { BrowserRouter, Routes, Route, Navigate, Link, useLocation, useNavigate, Outlet } from 'react-router-dom';
import { 
  Music2, 
  Zap, 
  ShieldCheck, 
  Headphones, 
  ArrowRight, 
  Star, 
  CheckCircle2, 
  Menu, 
  X,
  ChevronDown,
  ChevronUp,
  TrendingUp,
  Cpu,
  Users,
  Heart,
  Eye,
  ShoppingCart,
  Shield,
  Flame,
  Check,
  Package,
  User,
  CreditCard,
  Bookmark,
  Share2,
  Activity,
  RefreshCw,
  AlertCircle,
  Loader2,
  Send,
  Clock
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { doc, setDoc, getDoc, serverTimestamp, addDoc, collection } from 'firebase/firestore';
import { onAuthStateChanged, signInAnonymously } from 'firebase/auth';
import { db, auth } from './firebase';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import QRCode from 'qrcode';
import { fixArabic } from './utils/arabic-utils';
// @ts-ignore
import html2pdf from 'html2pdf.js';
import ProtectedRoute from './components/ProtectedRoute';
import AdminDashboard from './components/AdminDashboard';

const FOLLOWER_PLANS = [

  { quantity: '500', price: '19' },
  { quantity: '1,000', price: '39' },
  { quantity: '2,500', price: '69' },
  { quantity: '5,000', price: '129' },
  { quantity: '10,000', price: '249' },
  { quantity: '20,000', price: '499' },
  { quantity: '50,000', price: '799' },
];

const LIKE_PLANS = [
  { quantity: '1,000', price: '10' },
  { quantity: '2,500', price: '15' },
  { quantity: '5,000', price: '29' },
  { quantity: '10,000', price: '69' },
  { quantity: '25,000', price: '129' },
  { quantity: '50,000', price: '199' },
];

const SHARE_PLANS = [
  { quantity: '500', price: '5' },
  { quantity: '1,000', price: '8' },
  { quantity: '2,500', price: '10' },
  { quantity: '5,000', price: '15' },
  { quantity: '10,000', price: '19' },
  { quantity: '25,000', price: '25' },
  { quantity: '50,000', price: '35' },
];

const VIEW_PLANS = [
  { quantity: '10,000', price: '15' },
  { quantity: '25,000', price: '25' },
  { quantity: '50,000', price: '35' },
  { quantity: '100,000', price: '49' },
  { quantity: '250,000', price: '59' },
  { quantity: '500,000', price: '75' },
  { quantity: '1,000,000', price: '99' },

];

const CUSTOM_VIEWS_PLANS = [
  { quantity: '10k', price: 10 },
  { quantity: '20k', price: 18 },
  { quantity: '30k', price: 21 },
  { quantity: '50k', price: 25 },
  { quantity: '100k', price: 35 },
  { quantity: '200k', price: 45 },
  { quantity: '500k', price: 52 },
  { quantity: '1M', price: 99 },
];

const CUSTOM_LIKES_PLANS = [
  { quantity: 'بدون', price: 0 },
  { quantity: '50', price: 2 },
  { quantity: '100', price: 3 },
  { quantity: '250', price: 5 },
  { quantity: '500', price: 7 },
  { quantity: '1000', price: 10 },
  { quantity: '2500', price: 15 },
  { quantity: '5000', price: 20 },
  { quantity: '10,000', price: 39 },
  { quantity: '50,000', price: 199 },
];

const CUSTOM_SAVES_PLANS = [
  { quantity: 'بدون', price: 0 },
  { quantity: '50', price: 2 },
  { quantity: '100', price: 3 },
  { quantity: '250', price: 5 },
  { quantity: '500', price: 7 },
  { quantity: '1000', price: 8 },
  { quantity: '2000', price: 12 },
  { quantity: '5000', price: 22 },
];

const CUSTOM_SHARES_PLANS = [
  { quantity: 'بدون', price: 0 },
  { quantity: '50', price: 2 },
  { quantity: '100', price: 3 },
  { quantity: '250', price: 5 },
  { quantity: '500', price: 7 },
  { quantity: '1000', price: 8 },
  { quantity: '2000', price: 12 },
  { quantity: '5000', price: 22 },
];

const EXPLORE_PACKAGES = [
  {
    name: 'بكج الاكسبلور التوفيري',
    details: ['10,000 مشاهدات', '500 لايك', '500 حفظ', '500 شير'],
    oldPrice: '69',
    price: '29',
    quantity: 'التوفيري'
  },
  {
    name: 'بكج الاكسبلور البرونزي',
    details: ['50,000 مشاهدات', '1500 لايك', '1500 حفظ', '1500 شير'],
    oldPrice: '99',
    price: '39',
    quantity: 'البرونزي'
  },
  {
    name: 'بكج الاكسبلور الفضي',
    details: ['250,000 مشاهدات', '5000 لايك', '2500 حفظ', '2500 شير'],
    oldPrice: '199',
    price: '75',
    quantity: 'الفضي'
  },
  {
    name: 'بكج الاكسبلور الذهبي',
    details: ['1 مليون مشاهدات', '10,000 لايك', '5000 حفظ', '5000 شير'],
    oldPrice: '299',
    price: '99',
    quantity: 'الذهبي'
  }
];

const HOT_OFFERS = [
  {
    name: '5000 متابع تيك توك',
    details: ['متابعين بجودة عالية', 'سرعة في التنفيذ', 'ضمان تعويض النقص'],
    oldPrice: '149',
    price: '89',
    quantity: '5000'
  },
  {
    name: '10,000 متابع تيك توك',
    details: ['متابعين بجودة عالية', 'سرعة في التنفيذ', 'ضمان تعويض النقص'],
    oldPrice: '299',
    price: '149',
    quantity: '10,000'
  }
];

const SERVICES = [
  {
    id: 'tiktok',
    name: 'تيك توك',
    icon: Music2,
    color: 'text-emerald-400',
    options: [
      { name: 'متابعين', label: 'متابعين', icon: Users, plans: FOLLOWER_PLANS },
      { name: 'لايكات', label: 'لايكات', icon: Heart, plans: LIKE_PLANS },
      { name: 'مشاهدات', label: 'مشاهدات', icon: Eye, plans: VIEW_PLANS },
      { name: 'مشاركات', label: 'مشاركات', icon: ArrowRight, plans: SHARE_PLANS }
    ],
    specials: [
      {
        name: 'بكجات الاكسبلور',
        label: 'بكجات الاكسبلور',
        icon: Zap,
        plans: EXPLORE_PACKAGES
      },
      {
        name: 'العروض القوية',
        label: 'العروض القوية',
        icon: Flame,
        plans: HOT_OFFERS
      },
      {
        name: 'ضبط مقطعك بكيفك',
        label: 'ضبط مقطعك بكيفك',
        icon: Activity,
        isCustom: true,
        plans: []
      }
    ]
  }
];

const FEATURES = [
  {
    icon: Zap,
    title: 'تسليم فوري',
    description: 'يبدأ نظامنا الآلي في معالجة طلبك فوراً بعد الدفع.'
  },
  {
    icon: ShieldCheck,
    title: 'آمن وخاص',
    description: 'نحن لا نطلب كلمة مرورك أبداً. سلامة حسابك هي أولويتنا القصوى.'
  },
  {
    icon: Headphones,
    title: 'دعم 24/7',
    description: 'فريق الدعم المخصص لدينا متاح دائماً لمساعدتك في أي أسئلة.'
  }
];

const FAQS = [
  {
    question: 'هل الخدمة آمنة على حسابي في تيك توك؟',
    answer: 'إي نعم، أكيد. حنا نستخدم طرق نظامية ومجربة تتوافق مع قوانين المنصة. وما نطلب منك الرقم السري أبد، بس اسم المستخدم أو رابط المنشور لضمان خصوصيتك وأمانك.'
  },
  {
    question: 'متى يبدأ التنفيذ بعد ما أدفع؟',
    answer: 'التنفيذ يبدأ فوراً وبشكل آلي. أغلب الطلبات تبدأ توصلك في غضون دقائق بسيطة من إتمام الدفع، وبعض الخدمات قد تستغرق وقت أطول شوي حسب الكمية المطلوبة.'
  },
  {
    question: 'كيف يمكنني اختيار الخدمة المناسبة؟',
    answer: 'يمكنك تصفح الخدمات المتاحة واختيار ما يناسب أهدافك، أو التواصل معنا للحصول على توصية مبنية على احتياجات حسابك.'
  },
  {
    question: 'هل فيه ضمان لو نقص العدد؟',
    answer: 'طبعاً، عندنا ضمان تعويض لمدة 30 يوم على أغلب الخدمات. لو صار أي نقص، بس تواصل معنا ونعوضك فوراً وبدون أي تكاليف إضافية.'
  },
  {
    question: 'وش طرق الدفع المتاحة عندكم؟',
    answer: 'نوفر لكم طرق دفع آمنة ومتنوعة تشمل مدى، فيزا، ماستركارد، وأبل باي (Apple Pay) لضمان سهولة وسرعة التعامل من داخل المملكة.'
  },
  {
    question: 'كيف أقدر أتواصل مع الدعم الفني؟',
    answer: 'فريق الدعم الفني متواجد لخدمتكم على مدار الساعة عبر الواتساب أو من خلال أيقونة الدعم المباشر الموجودة في أسفل الموقع.'
  }
];

const SEOSection = () => {
  return (
    <section className="py-24 bg-slate-950 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-8 font-display leading-tight">
              أفضل استراتيجيات <span className="text-emerald-500">نمو الحسابات</span> على تيك توك لعام 2026
            </h2>
            <div className="space-y-6 text-slate-400 text-lg leading-relaxed">
              <p>
                يعتبر تيك توك اليوم المنصة الأسرع نمواً في العالم، والوصول إلى "الإكسبلور" يتطلب استراتيجية ذكية تجمع بين المحتوى الإبداعي وتقنيات الذكاء الصناعي المتطورة.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-8">
                <div className="bg-slate-900/50 p-6 rounded-2xl border border-white/5">
                  <h4 className="text-white font-bold mb-2 flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-emerald-500" /> خوارزمية تيك توك
                  </h4>
                  <p className="text-sm">تعتمد الخوارزمية بشكل كبير على معدل التفاعل في أول ساعة من نشر الفيديو.</p>
                </div>
                <div className="bg-slate-900/50 p-6 rounded-2xl border border-white/5">
                  <h4 className="text-white font-bold mb-2 flex items-center gap-2">
                    <Cpu className="w-5 h-5 text-emerald-500" /> تحسين الوصول 
                  </h4>
                  <p className="text-sm">استخدام تقنيات الذكاء الاصطناعي المتقدمة لتحفيز النمو الطبيعي والمستدام وتعزيز مصداقيتك الرقمية.</p>
                </div>
              </div>
            </div>
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="bg-slate-900/40 border border-white/10 rounded-[3rem] p-8 md:p-12 relative"
          >
            <div className="absolute -top-10 -left-10 w-32 h-32 bg-emerald-500/10 blur-3xl rounded-full" />
            <h3 className="text-2xl font-bold text-white mb-6">لماذا تختار داعم ستور؟</h3>
            <ul className="space-y-4">
              {[
                "أفضل حلول التسويق الرقمي في تيك توك",
                "خدمات آمنة 100% ولا تتطلب كلمة مرور",
                "دعم فني متواصل لمساعدتك في نمو حسابك",
                "أسعار تنافسية وباقات متنوعة تناسب الجميع",
                "تنفيذ اوتوماتيكي باستخدام الذكاء الصناعي"
                        ].map((item, i) => (
                <li key={i} className="flex items-start gap-3 text-slate-300">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-1" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>
        
        <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center p-8">
            <div className="text-4xl font-bold text-white mb-2">#1</div>
            <div className="text-emerald-500 font-bold mb-4">المركز الأول</div>
            <p className="text-slate-400 text-sm">كأفضل مزود خدمات SMM في المملكة العربية السعودية والخليج.</p>
          </div>
          <div className="text-center p-8 border-x border-white/5">
            <div className="text-4xl font-bold text-white mb-2">100%</div>
            <div className="text-emerald-500 font-bold mb-4">ضمان الأمان</div>
            <p className="text-slate-400 text-sm">نستخدم أحدث التقنيات لضمان سلامة حسابات عملائنا وخصوصيتهم.</p>
          </div>
          <div className="text-center p-8">
            <div className="text-4xl font-bold text-white mb-2">30 يوم</div>
            <div className="text-emerald-500 font-bold mb-4">ضمان تعويض النقص</div>
            <p className="text-slate-400 text-sm">نقدم ضمان تعويض لمدة 30 يوم على أغلب الخدمات لضمان رضاكم التام.</p>
          </div>
        </div>
      </div>
    </section>
  );
};



interface FAQItemProps {
  faq: {
    question: string;
    answer: string;
  };
}

const FAQItem: React.FC<FAQItemProps> = ({ faq }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="bg-slate-900 border border-white/5 rounded-2xl overflow-hidden mb-4 transition-all">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-6 flex items-center justify-between text-right hover:bg-white/5 transition-colors"
      >
        <span className="text-lg font-bold text-white">{faq.question}</span>
        {isOpen ? <ChevronUp className="w-5 h-5 text-emerald-500" /> : <ChevronDown className="w-5 h-5 text-slate-500" />}
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="p-6 pt-0 text-slate-400 leading-relaxed border-t border-white/5">
              {faq.answer}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};



export const IconMap: Record<string, any> = {
  'Users': Users,
  'Heart': Heart,
  'Eye': Eye,
  'ArrowRight': ArrowRight,
  'Zap': Zap,
  'Flame': Flame,
  'Activity': Activity,
  'ShoppingCart': ShoppingCart,
  'Music2': Music2,
  'TrendingUp': TrendingUp,
  'ShieldCheck': ShieldCheck,
  'Headphones': Headphones,
  'Package': Package,
  'User': User,
  'CreditCard': CreditCard,
  'Bookmark': Bookmark,
  'Share2': Share2,
  'Check': Check,
  'CheckCircle2': CheckCircle2,
  'Menu': Menu,
  'X': X,
  'ChevronDown': ChevronDown,
  'ChevronUp': ChevronUp,
};

const findOptionByName = (name: string) => {
  for (const service of SERVICES) {
    const option = service.options.find(o => o.name === name);
    if (option) return option;
    const special = service.specials?.find(s => s.name === name);
    if (special) return special;
  }
  return null;
};

const formatFollowers = (count: any) => {
  if (count === undefined || count === null || count === '') return '0';
  const num = typeof count === 'number' ? count : parseInt(String(count), 10);
  if (isNaN(num)) return '0';
  if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
  if (num >= 1000) return (num / 1000).toFixed(1) + 'k';
  return num.toString();
};

function Home() {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeService, setActiveService] = useState(SERVICES[0]);
  const [scrolled, setScrolled] = useState(false);
  const [selectedOption, setSelectedOption] = useState<any>(null);
  const [selectedPlan, setSelectedPlan] = useState<any>(null);
  const [modalStep, setModalStep] = useState<'plans' | 'details' | 'customer-info' | 'success' | 'cart-added' | 'cart-view' | 'error'>('plans');
  const [checkoutError, setCheckoutError] = useState<string | null>(null);
  const [targetLink, setTargetLink] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [checkoutItems, setCheckoutItems] = useState<any[] | null>(null);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  
  const [tiktokProfile, setTiktokProfile] = useState<any>(null);
  const [isTiktokLoading, setIsTiktokLoading] = useState(false);
  const [tiktokError, setTiktokError] = useState<string | null>(null);

  const handleSelectPlan = (plan: any, optionOverride?: any) => {
    setSelectedPlan(plan);
    const option = optionOverride || selectedOption;
    if (plan && option) {
      trackTikTokEvent({
        event: 'ViewContent',
        properties: {
          content_type: 'product',
          contents: [{
            content_id: plan.id || plan.name || `SMM-${plan.quantity?.toString().replace(/,/g, '')}`,
            content_name: plan.name || `${plan.quantity} ${option.name}`,
            quantity: 1,
            price: parseFloat(plan.price)
          }],
          currency: 'SAR',
          value: parseFloat(plan.price)
        }
      });
    }
  };
  
  // Local-First Initialization
  const [cart, setCart] = useState<any[]>(() => {
    try {
      const saved = localStorage.getItem('fame_cart');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });
  
  const [isCartLoaded, setIsCartLoaded] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [currentCartUserId, setCurrentCartUserId] = useState<string | null>(null);

  const handleFirestoreError = (error: any, operationType: string, path: string | null) => {
    const errInfo = {
      error: error instanceof Error ? error.message : String(error),
      authInfo: {
        userId: auth.currentUser?.uid,
        email: auth.currentUser?.email,
        emailVerified: auth.currentUser?.emailVerified,
        isAnonymous: auth.currentUser?.isAnonymous,
        tenantId: auth.currentUser?.tenantId,
        providerInfo: auth.currentUser?.providerData.map(provider => ({
          providerId: provider.providerId,
          displayName: provider.displayName,
          email: provider.email,
          photoUrl: provider.photoURL
        })) || []
      },
      operationType,
      path
    };
    console.error('Firestore Error: ', JSON.stringify(errInfo));
    throw new Error(JSON.stringify(errInfo));
  };

  // Helper function to get or create a cartId (fame_user_id)
  const getOrCreateCartId = () => {
    let cartId = localStorage.getItem('fame_user_id');
    if (!cartId) {
      cartId = crypto.randomUUID();
      localStorage.setItem('fame_user_id', cartId);
    }
    return cartId;
  };

  // Cart persistence logic
  useEffect(() => {
    const cartId = getOrCreateCartId();
    console.log("Current Cart ID:", cartId);
    setCurrentCartUserId(cartId);

    // Loading Guard: Prevent any setItem or updateDoc calls during the first 2 seconds
    const loadingTimer = setTimeout(() => {
      setIsInitialLoading(false);
    }, 2000);

    const initializeCart = async () => {
      // Ensure user is signed in (anonymously if not already) to prevent permission errors
      if (!auth.currentUser) {
        try {
          await signInAnonymously(auth);
        } catch (error) {
          console.error("Error signing in anonymously:", error);
        }
      }

      const cartRef = doc(db, 'carts', cartId);
      try {
        const docSnap = await getDoc(cartRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          // Hybrid Sync: Only update local state IF the Firestore data is not empty
          if (data.items && Array.isArray(data.items) && data.items.length > 0) {
            setCart(data.items);
            localStorage.setItem('fame_cart', JSON.stringify(data.items));
          }
        }
      } catch (error) {
        handleFirestoreError(error, 'get', `carts/${cartId}`);
      } finally {
        setIsCartLoaded(true);
      }
    };

    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (!user) {
        signInAnonymously(auth).catch(console.error);
      }
    });

    // Initial load
    initializeCart();

    return () => {
      unsubscribeAuth();
      clearTimeout(loadingTimer);
    };
  }, []);

  // Hybrid Sync Strategy: Save cart whenever it changes
  useEffect(() => {
    // Loading Guard: Prevent any setItem or updateDoc calls during the first 2 seconds
    if (isInitialLoading || !isCartLoaded || !currentCartUserId) return;

    const saveCart = async () => {
      // Save to localStorage
      localStorage.setItem('fame_cart', JSON.stringify(cart));

      // Save to Firestore
      const cartRef = doc(db, 'carts', currentCartUserId);
      try {
        await setDoc(cartRef, {
          items: cart,
          updatedAt: serverTimestamp()
        }, { merge: true });
      } catch (error) {
        handleFirestoreError(error, 'write', `carts/${currentCartUserId}`);
      }
    };

    const timeoutId = setTimeout(saveCart, 1000);
    return () => clearTimeout(timeoutId);
  }, [cart, isCartLoaded, currentCartUserId, isInitialLoading]);

  const [customViews, setCustomViews] = useState(CUSTOM_VIEWS_PLANS[0]);
  const [customLikes, setCustomLikes] = useState(CUSTOM_LIKES_PLANS[0]);
  const [customSaves, setCustomSaves] = useState(CUSTOM_SAVES_PLANS[0]);
  const [customShares, setCustomShares] = useState(CUSTOM_SHARES_PLANS[0]);

  const customTotalPrice = customViews.price + customLikes.price + customSaves.price + customShares.price;

  useEffect(() => {
    const isTikTokService = !activeService || activeService.id === 'tiktok';
    const isUserField = selectedOption?.label?.includes('متابعين') || 
                        selectedOption?.name?.includes('متابعين') || 
                        selectedOption?.label?.includes('مشتركين') || 
                        selectedOption?.name?.includes('مشتركين') || 
                        selectedOption?.label?.includes('العروض') || 
                        selectedOption?.name?.includes('العروض') ||
                        (!targetLink.includes('/video/') && !targetLink.includes('/v/') && isTikTokService);

    if (!targetLink || targetLink.trim().length < 2 || targetLink.includes('/video/') || targetLink.includes('/v/') || !isUserField) {
      setTiktokProfile(null);
      setTiktokError(null);
      return;
    }

    const timer = setTimeout(async () => {
      // Clean username
      let username = targetLink.trim();
      if (username.includes('tiktok.com/')) {
        const match = username.match(/@([^/?#]+)/);
        if (match) username = match[1];
      }
      username = username.replace(/^@/, '');

      if (!username) return;

      setIsTiktokLoading(true);
      setTiktokError(null);
      setTiktokProfile(null);

      try {
        const response = await fetch(`/api/tiktok/user?uniqueId=${username}`);
        const contentType = response.headers.get('content-type') || '';
        
        let data: any = null;
        if (contentType.includes('application/json')) {
          data = await response.json();
        }

        if (data && data.statusCode === 0 && data.userInfo) {
          setTiktokProfile(data.userInfo);
        } else {
          // Client-side Fallback: Try direct TikTok oEmbed
          try {
            const oembedRes = await fetch(`https://www.tiktok.com/oembed?url=https://www.tiktok.com/@${encodeURIComponent(username)}`);
            if (oembedRes.ok) {
              const odata = await oembedRes.json();
              if (odata && odata.author_name) {
                setTiktokProfile({
                  user: {
                    uniqueId: username,
                    nickname: odata.author_name,
                    avatarThumb: `https://ui-avatars.com/api/?name=${encodeURIComponent(odata.author_name)}&background=10b981&color=fff`,
                    avatarLarger: `https://ui-avatars.com/api/?name=${encodeURIComponent(odata.author_name)}&background=10b981&color=fff`,
                    verified: false
                  },
                  stats: {
                    followerCount: 0,
                    heartCount: 0
                  }
                });
                return;
              }
            }
          } catch (e) {
            console.warn("Client oembed fallback failed:", e);
          }

          if (data && response.status === 429) {
            setTiktokError("نظام التحقق تحت الصيانة مؤقتاً، يمكنك إكمال الطلب يدوياً");
          } else {
            setTiktokError("لم يتم العثور على الحساب، تأكد من اليوزر");
          }
        }
      } catch (err) {
        console.error("TikTok lookup error:", err);
        try {
          const oembedRes = await fetch(`https://www.tiktok.com/oembed?url=https://www.tiktok.com/@${encodeURIComponent(username)}`);
          if (oembedRes.ok) {
            const odata = await oembedRes.json();
            if (odata && odata.author_name) {
              setTiktokProfile({
                user: {
                  uniqueId: username,
                  nickname: odata.author_name,
                  avatarThumb: '',
                  avatarLarger: '',
                  verified: false
                },
                stats: {
                  followerCount: 0,
                  heartCount: 0
                }
              });
              return;
            }
          }
        } catch (e) {}

        setTiktokError("حدث خطأ أثناء التحقق من الحساب");
      } finally {
        setIsTiktokLoading(false);
      }
    }, 800);

    return () => clearTimeout(timer);
  }, [targetLink, selectedOption]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const isReturn = params.get('payment_return') === 'true';
    const isCancel = params.get('payment_cancel') === 'true';

    const clearStaleSession = () => {
      if (!isReturn && !isCancel) {
        setIsCheckingOut(false);
        const lastCheckoutId = localStorage.getItem('last_checkout_id');
        if (lastCheckoutId) {
          console.log('Clearing stale checkout session');
          localStorage.removeItem('last_checkout_id');
          localStorage.removeItem('last_checkout_plan');
          localStorage.removeItem('last_order_reference');
        }
      }
    };

    // Clear on mount
    clearStaleSession();

    // Clear on pageshow (handles back button from bfcache)
    window.addEventListener('pageshow', clearStaleSession);

    return () => {
      window.removeEventListener('pageshow', clearStaleSession);
    };
  }, []);

  const handleCheckout = async (itemsToPay?: any[]) => {
    const items = itemsToPay || checkoutItems || (selectedPlan && selectedOption ? [{ plan: selectedPlan, optionName: selectedOption.name, targetLink }] : []);
    if (items.length === 0) return;
    
    setIsCheckingOut(true);
    
    let attempts = 0;
    const maxAttempts = 3;
    
    const attemptCheckout = async (): Promise<void> => {
      attempts++;
      try {
        const totalAmount = items.reduce((sum, item) => sum + parseFloat(item.plan.price), 0);
        // Generate a fresh unique ID for every attempt
        const orderId = `SMM-${Date.now()}-${Math.floor(Math.random() * 1000000)}`;
        
        console.log(`Checkout attempt ${attempts} with reference: ${orderId}`);
        
        const response = await fetch('/api/checkout', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            amount: totalAmount,
            currency: 'SAR',
            reference: orderId,
            customer: {
              name: customerName || 'Guest User',
              email: customerEmail || 'guest@example.com',
              phone: `+966${customerPhone}`
            },
            response_url: `${window.location.origin}/thankyou?payment_return=true`,
            cancel_url: `${window.location.origin}/thankyou?payment_cancel=true`,
            metadata: {
              items: items.map(item => {
                const opt = findOptionByName(item.optionName || item.option?.name);
                return {
                  plan: item.plan.name || `${item.plan.quantity} ${opt?.name || ''}`,
                  price: item.plan.price,
                  link: item.targetLink
                };
              })
            }
          })
        });
        
        const data = await response.json();
        
        if (response.ok && data.checkout_id && data.checkout_url) {
          localStorage.setItem('last_checkout_id', data.checkout_id);
          localStorage.setItem('last_order_reference', orderId);
          localStorage.setItem('last_checkout_plan', JSON.stringify(items));
          localStorage.setItem('last_customer_name', customerName);
          localStorage.setItem('last_customer_phone', customerPhone);
          localStorage.setItem('last_customer_email', customerEmail);
          window.location.href = data.checkout_url;
        } else {
          // Check for duplicate reference error
          const errorMsg = (data.error || data.message || '').toLowerCase();
          if (errorMsg.includes('duplicate') && attempts < maxAttempts) {
            console.warn('Duplicate reference detected, retrying with new ID...');
            return attemptCheckout();
          }
          
          console.error('Checkout failed:', data);
          setCheckoutError(data.error || 'حدث خطأ أثناء إنشاء الدفع. يرجى المحاولة مرة أخرى.');
          setModalStep('error');
          setIsCheckingOut(false);
        }
      } catch (error) {
        console.error('Checkout error:', error);
        if (attempts < maxAttempts) {
          console.warn('Network error during checkout, retrying...');
          return attemptCheckout();
        }
        setCheckoutError('حدث خطأ أثناء الاتصال ببوابة الدفع. يرجى التحقق من اتصالك بالإنترنت.');
        setModalStep('error');
        setIsCheckingOut(false);
      }
    };

    await attemptCheckout();
  };

  const handleAddToCart = () => {
    if (!selectedPlan || !targetLink || !selectedOption) return;
    const newItem = {
      id: Date.now(),
      plan: selectedPlan,
      optionName: selectedOption.name,
      targetLink: targetLink
    };

    // Track TikTok AddToCart
    trackTikTokEvent({
      event: 'AddToCart',
      properties: {
        content_type: 'product',
        contents: [{
          content_id: selectedPlan.id || selectedPlan.name || `SMM-${selectedPlan.quantity?.toString().replace(/,/g, '')}`,
          content_name: selectedPlan.name || `${selectedPlan.quantity} ${selectedOption.name}`,
          quantity: 1,
          price: parseFloat(selectedPlan.price)
        }],
        currency: 'SAR',
        value: parseFloat(selectedPlan.price)
      }
    });

    setCart([...cart, newItem]);
    setModalStep('cart-added');
  };

  const removeFromCart = (id: number) => {
    setCart(cart.filter(item => item.id !== id));
  };

  useEffect(() => {
    if (!selectedOption) {
      setSelectedPlan(null);
      setModalStep('plans');
      setTargetLink('');
    }
  }, [selectedOption]);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans selection:bg-emerald-500/30 selection:text-emerald-400" dir="rtl">
      {/* Plans Modal */}
      <AnimatePresence>
        {selectedOption && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedOption(null)}
              className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-2xl bg-slate-900 border border-white/10 rounded-[2.5rem] overflow-hidden shadow-2xl"
            >
              <div className="p-8 border-b border-white/5 flex justify-between items-center bg-slate-900/50">
                <div>
                  <h3 className="text-2xl font-bold text-white font-display flex items-center gap-3">
                    <activeService.icon className={`w-6 h-6 ${activeService.color}`} />
                    {selectedOption.name}
                  </h3>
                  <p className="text-sm text-slate-400 mt-1">
                    {modalStep === 'plans' && 'اختر الكمية التي ترغب في شرائها'}
                    {modalStep === 'details' && 'قدم تفاصيل حسابك للمتابعة'}
                    {modalStep === 'customer-info' && 'أدخل بيانات التواصل لإتمام الطلب'}
                    {modalStep === 'success' && 'تم تقديم الطلب بنجاح'}
                    {modalStep === 'cart-added' && 'تمت الإضافة إلى السلة'}
                    {modalStep === 'cart-view' && 'سلة المشتريات'}
                    {modalStep === 'error' && 'عذراً، حدث خطأ ما'}
                  </p>
                </div>
                <button 
                  onClick={() => {
                    setSelectedOption(null);
                    setModalStep('plans');
                    setSelectedPlan(null);
                    setTargetLink('');
                    setCheckoutItems(null);
                    setCheckoutError(null);
                  }}
                  aria-label="إغلاق"
                  className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center hover:bg-white/10 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="p-8 max-h-[60vh] overflow-y-auto custom-scrollbar">
                {modalStep === 'error' ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col items-center justify-center py-12 text-center"
                  >
                    <div className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center mb-6">
                      <AlertCircle className="w-10 h-10 text-red-500" />
                    </div>
                    <h4 className="text-2xl font-bold text-white mb-2">فشل في العملية</h4>
                    <p className="text-slate-400 max-w-sm mb-8">
                      {checkoutError || 'حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى.'}
                    </p>
                    <button 
                      onClick={() => setModalStep('customer-info')}
                      className="bg-white/5 text-white px-8 py-3 rounded-xl font-bold hover:bg-white/10 transition-all border border-white/10"
                    >
                      العودة للمحاولة مرة أخرى
                    </button>
                  </motion.div>
                ) : modalStep === 'success' ? (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col items-center justify-center py-12 text-center"
                  >
                    <div className="w-20 h-20 bg-emerald-500/20 rounded-full flex items-center justify-center mb-6">
                      <CheckCircle2 className="w-10 h-10 text-emerald-500" />
                    </div>
                    <h4 className="text-2xl font-bold text-white mb-2">تم تأكيد الطلب!</h4>
                    <p className="text-slate-400 max-w-sm">
                      تم استلام طلبك وهو قيد المعالجة.
                    </p>
                    <button 
                      onClick={() => {
                        setSelectedOption(null);
                        setModalStep('plans');
                        setSelectedPlan(null);
                        setTargetLink('');
                      }}
                      className="mt-8 bg-white text-slate-950 px-8 py-3 rounded-xl font-bold hover:bg-emerald-500 hover:text-white transition-all"
                    >
                      إغلاق
                    </button>
                  </motion.div>
                ) : modalStep === 'cart-added' ? (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col items-center justify-center py-12 text-center"
                  >
                    <div className="w-20 h-20 bg-emerald-500/20 rounded-full flex items-center justify-center mb-6">
                      <ShoppingCart className="w-10 h-10 text-emerald-500" />
                    </div>
                    <h4 className="text-2xl font-bold text-white mb-2">تمت الإضافة للسلة!</h4>
                    <p className="text-slate-400 max-w-sm">
                      يمكنك الآن إكمال الدفع أو إضافة المزيد من الخدمات.
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8 w-full">
                      <button 
                        onClick={() => setModalStep('cart-view')}
                        className="bg-white/5 text-white px-4 py-3 rounded-xl font-bold hover:bg-white/10 transition-all border border-white/10"
                      >
                        فتح السلة
                      </button>
                      <button 
                        onClick={() => {
                          setCheckoutItems(cart);
                          setModalStep('customer-info');
                        }}
                        className="bg-emerald-500 text-slate-950 px-4 py-3 rounded-xl font-bold hover:bg-emerald-400 transition-all shadow-lg shadow-emerald-500/20"
                      >
                        إتمام الشراء
                      </button>
                      <button 
                        onClick={() => {
                          setSelectedOption(null);
                          setModalStep('plans');
                          setSelectedPlan(null);
                          setTargetLink('');
                        }}
                        className="bg-white/5 text-white px-4 py-3 rounded-xl font-bold hover:bg-white/10 transition-all border border-white/10"
                      >
                        إضافة خدمات أخرى
                      </button>
                    </div>
                  </motion.div>
                ) : modalStep === 'cart-view' ? (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="space-y-4"
                  >
                    {cart.length === 0 ? (
                      <div className="text-center py-12">
                        <ShoppingCart className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                        <p className="text-slate-500">السلة فارغة حالياً</p>
                        <button 
                          onClick={() => {
                            setSelectedOption(null);
                            setModalStep('plans');
                          }}
                          className="mt-4 text-emerald-500 font-bold hover:underline"
                        >
                          تصفح الخدمات
                        </button>
                      </div>
                    ) : (
                      <>
                        <div className="space-y-3">
                          {cart.map((item) => {
                            const option = findOptionByName(item.optionName || item.option?.name);
                            if (!option) return null;
                            const Icon = option.icon;
                            return (
                              <div key={item.id} className="bg-white/5 border border-white/10 p-4 rounded-2xl flex items-center justify-between group">
                                <div className="flex items-center gap-4">
                                  <div className="w-10 h-10 bg-emerald-500/10 rounded-xl flex items-center justify-center text-emerald-500">
                                    <Icon className="w-5 h-5" />
                                  </div>
                                  <div>
                                    <div className="text-white font-bold">{item.plan.name || `${item.plan.quantity} ${option.name}`}</div>
                                    <div className="text-xs text-slate-500 truncate max-w-[150px]">{item.targetLink}</div>
                                  </div>
                                </div>
                                <div className="flex items-center gap-4">
                                  <div className="text-right">
                                    <div className="text-emerald-500 font-bold">{item.plan.price} ر.س</div>
                                    <div className="text-[8px] text-slate-500 font-bold leading-none">شامل الضريبة</div>
                                  </div>
                                  <button 
                                    onClick={() => removeFromCart(item.id)}
                                    aria-label="حذف من السلة"
                                    className="text-slate-400 hover:text-red-500 transition-colors p-1"
                                  >
                                    <X className="w-4 h-4" />
                                  </button>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                        <div className="pt-6 border-t border-white/10 flex items-center justify-between">
                          <div className="text-slate-400">إجمالي السلة:</div>
                          <div className="text-left">
                            <div className="text-2xl font-bold text-emerald-500 block leading-none">
                              {cart.reduce((sum, item) => sum + parseFloat(item.plan.price), 0)} ر.س
                            </div>
                            <div className="text-[10px] text-slate-500 font-bold block mt-1">شامل الضريبة</div>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4 pt-4">
                          <button 
                            onClick={() => {
                              setSelectedOption(null);
                              setModalStep('plans');
                            }}
                            className="bg-white/5 text-white px-6 py-4 rounded-2xl font-bold hover:bg-white/10 transition-all border border-white/10"
                          >
                            إضافة المزيد
                          </button>
                          <button 
                            onClick={() => {
                              setCheckoutItems(cart);
                              setModalStep('customer-info');
                            }}
                            className="bg-emerald-500 text-slate-950 px-6 py-4 rounded-2xl font-bold hover:bg-emerald-400 transition-all shadow-lg shadow-emerald-500/20"
                          >
                            إتمام الشراء ({cart.length})
                          </button>
                        </div>
                      </>
                    )}
                  </motion.div>
                ) : modalStep === 'details' ? (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="space-y-6"
                  >
                    <div className="bg-emerald-500/5 border border-emerald-500/10 p-6 rounded-3xl space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-xs text-slate-500 uppercase tracking-[0.2em] font-bold mb-1">الباقة المختارة</div>
                          <div className="text-xl font-bold text-white">{selectedPlan?.name || `${selectedPlan?.quantity || ''} ${selectedOption?.name || selectedOption?.label || ''}`}</div>
                        </div>
                        <div className="text-left">
                          <div className="text-xs text-slate-500 uppercase tracking-[0.2em] font-bold mb-1">السعر</div>
                          <div className="text-2xl font-bold text-emerald-500">{selectedPlan?.price || '0'} ر.س</div>
                          <div className="text-[10px] text-slate-500 font-bold">شامل الضريبة</div>
                        </div>
                      </div>

                      {selectedPlan?.details && selectedPlan.details.length > 0 && (
                        <div className="pt-4 border-t border-emerald-500/10">
                          <div className="text-xs text-slate-500 uppercase tracking-[0.2em] font-bold mb-3">تفاصيل الطلب</div>
                          <div className="flex flex-wrap gap-2">
                            {selectedPlan.details.map((detail: string, dIdx: number) => (
                              <div key={dIdx} className="bg-emerald-500/10 text-emerald-400 text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1.5">
                                <CheckCircle2 className="w-3 h-3" /> {detail}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-300 mr-1">
                        {selectedOption?.label === 'متابعين' || selectedOption?.name === 'متابعين' || selectedOption?.label === 'مشتركين' || selectedOption?.name === 'مشتركين' || selectedOption?.label === 'العروض القوية' || selectedOption?.name === 'العروض القوية'
                          ? 'اسم المستخدم أو رابط الحساب' 
                          : selectedOption?.label === 'بكجات الاكسبلور' || selectedOption?.name === 'بكجات الاكسبلور'
                          ? 'رابط المقطع (الفيديو)'
                          : 'رابط الفيديو أو المنشور'}
                      </label>
                      <div className="relative group">
                        <input 
                          type="text" 
                          value={targetLink}
                          onChange={(e) => setTargetLink(e.target.value)}
                          placeholder={selectedOption?.label === 'متابعين' || selectedOption?.name === 'متابعين' || selectedOption?.label === 'مشتركين' || selectedOption?.name === 'مشتركين' || selectedOption?.label === 'العروض القوية' || selectedOption?.name === 'العروض القوية'
                            ? '@اسم_المستخدم أو رابط الحساب' 
                            : 'https://vt.tiktok.com/ZSu7ekwF7'}
                          className="w-full bg-slate-950/50 border border-white/10 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-emerald-500/50 transition-all"
                        />
                        {/* TikTok Profile Confirmation Card */}
                        {isTiktokLoading && (
                          <div className="mt-2 flex items-center gap-2 text-slate-500 text-xs animate-pulse pr-1">
                            <Loader2 className="w-3 h-3 animate-spin" />
                            جاري التحقق من الحساب...
                          </div>
                        )}

                        {tiktokError && (
                          <div className="mt-2 text-red-400 text-xs flex items-center gap-1 pr-1">
                            <AlertCircle className="w-3 h-3" />
                            {tiktokError}
                          </div>
                        )}

                        {tiktokProfile && tiktokProfile.user && (
                          <motion.div 
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mt-4 bg-slate-900 border-2 border-emerald-500/30 rounded-2xl p-4 flex items-center gap-4 relative overflow-hidden group"
                          >
                            {/* Purple Accent Glow */}
                            <div className="absolute -right-4 -top-4 w-16 h-16 bg-purple-500/10 blur-2xl rounded-full group-hover:bg-purple-500/20 transition-all" />
                            
                            <div className="relative shrink-0">
                              <img 
                                src={(tiktokProfile.user?.avatarThumb || tiktokProfile.user?.avatarLarger) 
                                  ? `/api/proxy-image?url=${encodeURIComponent(tiktokProfile.user?.avatarThumb || tiktokProfile.user?.avatarLarger || '')}` 
                                  : `https://ui-avatars.com/api/?name=${encodeURIComponent(tiktokProfile.user?.nickname || 'TikTok')}&background=10b981&color=fff`} 
                                alt={tiktokProfile.user?.nickname || 'Avatar'}
                                className="w-14 h-14 rounded-full border-2 border-emerald-500/50 object-cover"
                                referrerPolicy="no-referrer"
                                onError={(e) => {
                                  const target = e.currentTarget;
                                  const directUrl = tiktokProfile.user?.avatarLarger || tiktokProfile.user?.avatarThumb;
                                  if (directUrl && !target.src.includes(directUrl) && !target.src.includes('ui-avatars.com')) {
                                    target.src = directUrl;
                                  } else {
                                    target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(tiktokProfile.user?.nickname || 'TikTok')}&background=10b981&color=fff`;
                                  }
                                }}
                              />
                              {tiktokProfile.user?.verified && (
                                <div className="absolute -bottom-1 -right-1 bg-emerald-500 text-white p-0.5 rounded-full border-2 border-slate-900">
                                  <Check className="w-2.5 h-2.5" />
                                </div>
                              )}
                            </div>
                            
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-0.5">
                                <h4 className="text-white font-bold truncate">{tiktokProfile.user?.nickname || tiktokProfile.user?.uniqueId || 'حساب تيك توك'}</h4>
                                <span className="bg-emerald-500/10 text-emerald-400 text-[10px] font-bold px-1.5 py-0.5 rounded border border-emerald-500/20 flex items-center gap-1">
                                  <CheckCircle2 className="w-2.5 h-2.5" /> حساب موثق
                                </span>
                              </div>
                              <div className="flex items-center gap-3 text-slate-400 text-xs">
                                <div className="flex items-center gap-1">
                                  <Users className="w-3 h-3 text-emerald-500" />
                                  <span className="font-bold">{formatFollowers(tiktokProfile.stats?.followerCount)}</span> متابع
                                </div>
                                <div className="flex items-center gap-1">
                                  <Heart className="w-3 h-3 text-purple-500" />
                                  <span className="font-bold">{formatFollowers(tiktokProfile.stats?.heartCount ?? tiktokProfile.stats?.heart ?? tiktokProfile.stats?.followingCount)}</span> {tiktokProfile.stats?.heartCount !== undefined ? 'إعجاب' : 'يتابع'}
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 mr-1 flex items-center gap-1">
                        <ShieldCheck className="w-3 h-3" /> نحن لا نطلب كلمة مرورك أبداً.
                      </p>
                    </div>
                  </motion.div>
                ) : modalStep === 'customer-info' ? (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="space-y-6"
                  >
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-300 mr-1">الاسم الكامل</label>
                      <input 
                        type="text" 
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        placeholder="أدخل اسمك الكامل"
                        className="w-full bg-slate-950/50 border border-white/10 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-emerald-500/50 transition-all"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-300 mr-1">رقم الجوال</label>
                      <div className="relative flex items-center">
                        <div className="absolute left-6 text-slate-400 font-bold ltr" dir="ltr">+966</div>
                        <input 
                          type="tel" 
                          value={customerPhone}
                          onChange={(e) => {
                            const val = e.target.value.replace(/\D/g, '');
                            if (val.length <= 9) setCustomerPhone(val);
                          }}
                          placeholder="5XXXXXXXX"
                          className="w-full bg-slate-950/50 border border-white/10 rounded-2xl pl-20 pr-6 py-4 text-white focus:outline-none focus:border-emerald-500/50 transition-all ltr"
                          dir="ltr"
                        />
                      </div>
                      <p className="text-xs text-slate-500 mr-1">أدخل رقم الجوال المكون من 9 أرقام يبدأ بـ 5</p>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-300 mr-1">البريد الإلكتروني (اختياري)</label>
                      <input 
                        type="email" 
                        value={customerEmail}
                        onChange={(e) => setCustomerEmail(e.target.value)}
                        placeholder="example@mail.com"
                        className="w-full bg-slate-950/50 border border-white/10 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-emerald-500/50 transition-all ltr"
                        dir="ltr"
                      />
                    </div>
                  </motion.div>
                ) : selectedOption.isCustom ? (
                  <div className="space-y-8">
                    <div className="grid grid-cols-1 gap-6">
                      {/* Views - Required */}
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <label className="text-lg font-bold text-white flex items-center gap-2">
                            <Eye className="w-5 h-5 text-violet-400" /> المشاهدات (مطلوب)
                          </label>
                          <div className="text-left">
                            <span className="text-violet-400 font-bold block">{customViews.price} ر.س</span>
                            <span className="text-[10px] text-slate-500 font-bold block">شامل الضريبة</span>
                          </div>
                        </div>
                        <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
                          {CUSTOM_VIEWS_PLANS.map((plan) => (
                            <button
                              key={plan.quantity}
                              onClick={() => {
                                setCustomViews(plan);
                                handleSelectPlan({
                                  name: `باقة مخصصة (${plan.quantity} مشاهدة + تفاعل)`,
                                  price: plan.price + customLikes.price + customSaves.price + customShares.price,
                                  quantity: plan.quantity
                                });
                              }}
                              className={`py-2 rounded-xl text-xs font-bold transition-all border ${
                                customViews.quantity === plan.quantity
                                  ? 'bg-violet-500 text-white border-violet-500 shadow-lg shadow-violet-500/20'
                                  : 'bg-white/5 text-slate-400 border-white/10 hover:border-violet-500/50'
                              }`}
                            >
                              {plan.quantity}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Likes - Optional */}
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <label className="text-lg font-bold text-white flex items-center gap-2">
                            <Heart className="w-5 h-5 text-pink-400" /> اللايكات
                          </label>
                          <div className="text-left">
                            <span className="text-pink-400 font-bold block">{customLikes.price} ر.س</span>
                            <span className="text-[10px] text-slate-500 font-bold block">شامل الضريبة</span>
                          </div>
                        </div>
                        <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                          {CUSTOM_LIKES_PLANS.map((plan) => (
                            <button
                              key={plan.quantity}
                              onClick={() => {
                                setCustomLikes(plan);
                                handleSelectPlan({
                                  name: `باقة مخصصة (${customViews.quantity} مشاهدة + تفاعل)`,
                                  price: customViews.price + plan.price + customSaves.price + customShares.price,
                                  quantity: customViews.quantity
                                });
                              }}
                              className={`py-2 rounded-xl text-xs font-bold transition-all border ${
                                customLikes.quantity === plan.quantity
                                  ? 'bg-pink-500 text-white border-pink-500 shadow-lg shadow-pink-500/20'
                                  : 'bg-white/5 text-slate-400 border-white/10 hover:border-pink-500/50'
                              }`}
                            >
                              {plan.quantity}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Saves - Optional */}
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <label className="text-lg font-bold text-white flex items-center gap-2">
                            <Bookmark className="w-5 h-5 text-blue-400" /> الحفظ
                          </label>
                          <div className="text-left">
                            <span className="text-blue-400 font-bold block">{customSaves.price} ر.س</span>
                            <span className="text-[10px] text-slate-500 font-bold block">شامل الضريبة</span>
                          </div>
                        </div>
                        <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
                          {CUSTOM_SAVES_PLANS.map((plan) => (
                            <button
                              key={plan.quantity}
                              onClick={() => {
                                setCustomSaves(plan);
                                handleSelectPlan({
                                  name: `باقة مخصصة (${customViews.quantity} مشاهدة + تفاعل)`,
                                  price: customViews.price + customLikes.price + plan.price + customShares.price,
                                  quantity: customViews.quantity
                                });
                              }}
                              className={`py-2 rounded-xl text-xs font-bold transition-all border ${
                                customSaves.quantity === plan.quantity
                                  ? 'bg-blue-500 text-white border-blue-500 shadow-lg shadow-blue-500/20'
                                  : 'bg-white/5 text-slate-400 border-white/10 hover:border-blue-500/50'
                              }`}
                            >
                              {plan.quantity}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Shares - Optional */}
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <label className="text-lg font-bold text-white flex items-center gap-2">
                            <Share2 className="w-5 h-5 text-emerald-400" /> حركة الاكسبلور
                          </label>
                          <div className="text-left">
                            <span className="text-emerald-400 font-bold block">{customShares.price} ر.س</span>
                            <span className="text-[10px] text-slate-500 font-bold block">شامل الضريبة</span>
                          </div>
                        </div>
                        <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
                          {CUSTOM_SHARES_PLANS.map((plan) => (
                            <button
                              key={plan.quantity}
                              onClick={() => {
                                setCustomShares(plan);
                                handleSelectPlan({
                                  name: `باقة مخصصة (${customViews.quantity} مشاهدة + تفاعل)`,
                                  price: customViews.price + customLikes.price + customSaves.price + plan.price,
                                  quantity: customViews.quantity
                                });
                              }}
                              className={`py-2 rounded-xl text-xs font-bold transition-all border ${
                                customShares.quantity === plan.quantity
                                  ? 'bg-emerald-500 text-white border-emerald-500 shadow-lg shadow-emerald-500/20'
                                  : 'bg-white/5 text-slate-400 border-white/10 hover:border-emerald-500/50'
                              }`}
                            >
                              {plan.quantity}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="bg-slate-950/50 border border-white/10 p-6 rounded-[2rem] flex items-center justify-between">
                      <div className="text-slate-400 font-bold">الإجمالي:</div>
                      <div className="text-3xl font-bold text-white">
                        <div className="text-left">
                          <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-emerald-400 block leading-none">
                            {customTotalPrice} ر.س
                          </span>
                          <span className="text-[10px] text-slate-500 font-bold block mt-1">شامل الضريبة</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {selectedOption.plans.map((plan: any, idx: number) => (
                      <button
                        key={idx}
                        onClick={() => handleSelectPlan(plan)}
                        className={`flex items-center justify-between p-5 rounded-2xl transition-all group relative overflow-hidden ${
                          selectedPlan?.quantity === plan.quantity
                            ? 'bg-emerald-500/10 border-2 border-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.1)]'
                            : 'bg-slate-950/50 border border-white/5 hover:border-emerald-500/50 hover:bg-emerald-500/5'
                        }`}
                      >
                        {selectedPlan?.quantity === plan.quantity && (
                          <motion.div 
                            layoutId="active-plan"
                            className="absolute inset-0 bg-emerald-500/5 pointer-events-none"
                          />
                        )}
                        <div className="text-right relative z-10 flex items-center gap-3">
                          {selectedPlan?.quantity === plan.quantity && (
                            <div className="w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center shrink-0">
                              <CheckCircle2 className="w-3.5 h-3.5 text-slate-950" />
                            </div>
                          )}
                          <div>
                            <div className={`text-lg font-bold transition-colors ${
                              selectedPlan?.quantity === plan.quantity ? 'text-emerald-400' : 'text-white group-hover:text-emerald-400'
                            }`}>
                              {plan.name || `${plan.quantity} ${selectedOption.name}`}
                            </div>
                            {plan.details ? (
                              <div className="space-y-1 mt-2">
                                {plan.details.map((detail: string, dIdx: number) => (
                                  <div key={dIdx} className="text-xs text-slate-400 flex items-center gap-1">
                                    <CheckCircle2 className="w-3 h-3 text-emerald-500" /> {detail}
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <div className="text-xs text-slate-500 uppercase tracking-widest font-bold">جودة عالية</div>
                            )}
                          </div>
                        </div>
                        <div className="text-right relative z-10">
                          {plan.oldPrice && (
                            <div className="text-xs text-slate-500 line-through mb-1">{plan.oldPrice} ر.س</div>
                          )}
                          <div className="text-xl font-bold text-emerald-500">{plan.price} ر.س</div>
                          <div className="text-[10px] text-slate-500 font-bold">شامل الضريبة</div>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {modalStep !== 'success' && modalStep !== 'cart-added' && modalStep !== 'cart-view' && (
                <div className="p-8 bg-slate-950/50 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-6">
                  <div className="flex items-center gap-4 text-sm text-slate-400">
                    {modalStep === 'details' || modalStep === 'customer-info' ? (
                      <button 
                        onClick={() => {
                          if (modalStep === 'details') setModalStep('plans');
                          else {
                            // If we came from cart, go back to cart
                            if (checkoutItems) setModalStep('cart-view');
                            else setModalStep('details');
                          }
                        }}
                        className="flex items-center gap-1 hover:text-white transition-colors"
                      >
                        <ArrowRight className="w-4 h-4 rotate-180" /> العودة
                      </button>
                    ) : (
                      <>
                        <div className="flex items-center gap-1">
                          <Shield className="w-4 h-4 text-emerald-500" /> آمن
                        </div>
                        <div className="flex items-center gap-1">
                          <Zap className="w-4 h-4 text-emerald-500" /> فوري
                        </div>
                      </>
                    )}
                  </div>
                  <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
                    {modalStep === 'details' && (
                      <button 
                        disabled={!targetLink || isCheckingOut}
                        onClick={handleAddToCart}
                        className={`w-full sm:w-auto px-8 py-4 rounded-2xl font-bold transition-all active:scale-95 flex items-center justify-center gap-2 border ${
                          targetLink && !isCheckingOut
                            ? 'bg-white/5 text-white hover:bg-white/10 border-white/10' 
                            : 'bg-slate-800 text-slate-500 border-transparent cursor-not-allowed'
                        }`}
                      >
                        <ShoppingCart className="w-5 h-5" /> إضافة للسلة
                      </button>
                    )}
                    <button 
                      disabled={
                        modalStep === 'plans' ? !selectedPlan : 
                        modalStep === 'details' ? !targetLink :
                        (!customerName || customerPhone.length < 9 || isCheckingOut)
                      }
                      onClick={() => {
                        if (modalStep === 'plans') {
                          if (selectedOption.isCustom) {
                            handleSelectPlan({
                              name: 'باقة مخصصة',
                              details: [
                                `${customViews.quantity} مشاهدة`,
                                customLikes.price > 0 ? `${customLikes.quantity} لايك` : null,
                                customSaves.price > 0 ? `${customSaves.quantity} حفظ` : null,
                                customShares.price > 0 ? `${customShares.quantity} إكسبلور` : null
                              ].filter(Boolean),
                              price: customTotalPrice,
                              quantity: customViews.quantity
                            });
                          }
                          setModalStep('details');
                        }
                        else if (modalStep === 'details') {
                          setCheckoutItems(null);
                          setModalStep('customer-info');
                        }
                        else handleCheckout();
                      }}
                      className={`w-full sm:w-auto px-8 py-4 rounded-2xl font-bold transition-all active:scale-95 border border-transparent ${
                        (modalStep === 'plans' ? selectedPlan : modalStep === 'details' ? targetLink : (customerName && customerPhone.length >= 9)) && !isCheckingOut
                          ? 'bg-emerald-500 text-slate-950 hover:bg-emerald-400 shadow-lg shadow-emerald-500/20' 
                          : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                      }`}
                    >
                      {isCheckingOut ? 'جاري التحويل...' : modalStep === 'plans' || modalStep === 'details' ? 'متابعة' : 'إتمام الشراء'}
                    </button>
                  </div>
                </div>
              )}
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
              aria-label="العودة للأعلى"
              className="w-12 h-12 bg-white/10 backdrop-blur-md border border-white/10 rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-all"
            >
              <ChevronDown className="w-6 h-6 rotate-180" />
            </motion.button>
          )}
        </AnimatePresence>
        <button 
          onClick={() => {
            setSelectedOption({ name: 'سلة المشتريات', icon: ShoppingCart, plans: [] });
            setModalStep('cart-view');
          }}
          aria-label="عرض سلة المشتريات"
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
          aria-label="تواصل معنا عبر واتساب"
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
          <Link to="/" className="flex items-center gap-2 group cursor-pointer">
            <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/20 group-hover:scale-110 transition-transform">
              <Zap className="text-slate-950 w-6 h-6 fill-slate-950" />
            </div>
            <span className="text-2xl font-bold tracking-tight text-white">داعم <span className="text-emerald-500">ستور</span></span>
          </Link>

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
                  setSelectedOption({ name: 'سلة المشتريات', icon: ShoppingCart, plans: [] });
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

          <button 
            className="md:hidden text-white" 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label={isMenuOpen ? "إغلاق القائمة" : "فتح القائمة"}
          >
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
                    setSelectedOption({ name: 'سلة المشتريات', icon: ShoppingCart, plans: [] });
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
              <h1 className="text-5xl md:text-8xl font-bold text-white leading-[1.05] mb-8 tracking-tight font-display">
                عزز حضورك <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-emerald-500 to-violet-500">الرقمي فوراً</span>
              </h1>
              <p className="text-lg md:text-xl text-slate-400 mb-10 leading-relaxed max-w-2xl">
                المنصة الأكثر موثوقية لتعزيز التواجد الرقمي وتطوير قنوات التواصل الاجتماعي. حلول ذكية، آمنة، ونتائج فورية.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
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
                  handleSelectPlan(option.plans[0], option);
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
                  <option.icon className="w-5 h-5 sm:w-6 sm:h-6" />
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

            {/* Special Cards - Now inside the grid to match size */}
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
                    handleSelectPlan({
                      name: 'باقة مخصصة',
                      price: customTotalPrice,
                      quantity: customViews.quantity
                    }, special);
                  } else {
                    handleSelectPlan(special.plans[0], special);
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
                  <special.icon className="w-5 h-5 sm:w-6 sm:h-6" />
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
                <p className="text-slate-300 leading-relaxed">{feature.description}</p>
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
            <p className="text-slate-300">كل ما تحتاج لمعرفته حول خدماتنا.</p>
          </div>
          <div className="space-y-2">
            {FAQS.map((faq, idx) => (
              <FAQItem key={idx} faq={faq} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

export function ThankYou() {
  const navigate = useNavigate();
  const [params, setParams] = useState<any>({});
  const [isGenerating, setIsGenerating] = useState(false);
  const invoiceRef = useRef<HTMLDivElement>(null);
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');
  const [isVerifying, setIsVerifying] = useState(false);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const isReturn = urlParams.get('payment_return') === 'true';
    const isCancel = urlParams.get('payment_cancel') === 'true';
    const checkoutId = localStorage.getItem('last_checkout_id');
    const storedPlan = localStorage.getItem('last_checkout_plan');
    const storedName = localStorage.getItem('last_customer_name');
    const storedPhone = localStorage.getItem('last_customer_phone');
    const storedEmail = localStorage.getItem('last_customer_email');
    const cartUserId = localStorage.getItem('fame_user_id');

    if (isCancel) {
      alert('تم إلغاء عملية الدفع.');
      localStorage.removeItem('last_checkout_id');
      localStorage.removeItem('last_checkout_plan');
      navigate('/');
      return;
    }

    if (isReturn && checkoutId && storedPlan) {
      // Set initial params from localStorage for instant UI display
      try {
        const items = JSON.parse(storedPlan || '[]');
        const totalAmount = items.reduce((sum: number, item: any) => sum + parseFloat(item.plan.price), 0);
        const firstItem = items[0];
        const opt = findOptionByName(firstItem.optionName);
        setParams({
          orderId: localStorage.getItem('last_order_reference') || checkoutId,
          name: storedName || 'Guest',
          service: firstItem.plan.name || `${firstItem.plan.quantity} ${opt?.name || ''}`,
          price: totalAmount,
        });
      } catch (e) {
        console.error("Error setting initial params:", e);
      }

      setIsVerifying(true);
      fetch(`/api/checkout/${checkoutId}`)
        .then(res => res.json())
        .then(async (data) => {
          if (data.paid) {
            const items = JSON.parse(storedPlan || '[]');
            const totalAmount = items.reduce((sum: number, item: any) => sum + parseFloat(item.plan.price), 0);
            const storedOrderRef = localStorage.getItem('last_order_reference');
            const orderReference = storedOrderRef || data.reference || checkoutId;

            // BACKGROUND TASKS - Do not await these for UI responsiveness
            
            // 1. TikTok Tracking
            trackTikTokEvent({
              event: 'Purchase',
              event_id: orderReference,
              user: {
                email: storedEmail || undefined,
                phone: storedPhone || undefined,
                external_id: storedPhone || undefined,
              },
              properties: {
                content_type: 'product',
                contents: items.map((i: any) => {
                  const opt = findOptionByName(i.optionName);
                  const contentId = i.plan.id || i.plan.name || `SMM-${i.plan.quantity?.toString().replace(/,/g, '')}`;
                  return {
                    content_id: contentId,
                    content_name: i.plan.name || `${i.plan.quantity} ${opt?.name || ''}`,
                    quantity: 1,
                    price: parseFloat(i.plan.price),
                    content_type: 'product',
                    currency: 'SAR'
                  };
                }),
                currency: 'SAR',
                value: totalAmount
              }
            });

            // 1.5 Google Ads Conversion Tracking
            if ((window as any).gtag) {
              (window as any).gtag('event', 'conversion', {
                'send_to': 'AW-17636194901/qq_yCM3YtpAcENX0y9IB',
                'value': totalAmount,
                'currency': 'SAR',
                'transaction_id': orderReference
              });
            }

            // 2. Save to Firestore
            addDoc(collection(db, 'orders'), {
              orderId: orderReference,
              checkoutId: checkoutId,
              customerName: storedName || 'Guest',
              customerPhone: storedPhone || '',
              items: items.map((i: any) => ({
                plan: i.plan.name || `${i.plan.quantity} ${findOptionByName(i.optionName)?.name || ''}`,
                quantity: i.plan.quantity,
                link: i.targetLink,
                price: i.plan.price
              })),
              totalAmount: totalAmount,
              status: 'طلب جديد',
              createdAt: serverTimestamp()
            }).catch(e => console.error("Firestore save failed:", e));

            // 3. Webhook
            const serviceNames = items.map((i: any) => i.plan.name || `${i.plan.quantity} ${findOptionByName(i.optionName)?.name || ''}`).join(', ');
            const serviceQtys = items.map((i: any) => i.plan.quantity).join(', ');
            const serviceLinks = items.map((i: any) => i.targetLink).join(', ');

            fetch('/api/webhook/order', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                "التاريخ": new Date().toISOString(),
                "رقم_الطلب": orderReference,
                "اسم_العميل": storedName || 'Guest',
                "رقم_الجوال": storedPhone || '',
                "الخدمة": serviceNames,
                "العدد": serviceQtys,
                "الرابط": serviceLinks,
                "القيمة": totalAmount
              })
            }).catch(e => console.error("Webhook failed:", e));

            // 4. Clear Cart
            localStorage.removeItem('fame_cart');
            if (cartUserId) {
              setDoc(doc(db, 'carts', cartUserId), {
                items: [],
                updatedAt: serverTimestamp()
              }, { merge: true }).catch(e => console.error("Cart clear failed:", e));
            }

            // Cleanup checkout session
            localStorage.removeItem('last_checkout_id');
            localStorage.removeItem('last_checkout_plan');
          } else {
            alert('لم يتم إكمال الدفع.');
            navigate('/');
          }
        })
        .catch(err => {
          console.error('Error checking payment status:', err);
          navigate('/');
        })
        .finally(() => setIsVerifying(false));
    } else {
      // Normal direct access or missing data
      const orderId = urlParams.get('orderId') || `SMM-${Math.floor(Date.now() / 1000)}`;
      const name = urlParams.get('name');
      const service = urlParams.get('service');
      const price = urlParams.get('price');

      setParams({
        orderId,
        name,
        service,
        price,
      });
    }

    // Generate QR Code for the template
    const generateQR = async () => {
      const storeName = "داعم ستور";
      const vatNumber = "312923423500003";
      
      const storedPlan = localStorage.getItem('last_checkout_plan');
      let items: any[] = [];
      if (storedPlan) {
        try {
          items = JSON.parse(storedPlan);
        } catch (e) {
          console.error("Error parsing stored plan:", e);
        }
      }

      const queryPrice = urlParams.get('price');

      const totalPaid = items.length > 0 
        ? items.reduce((acc, item) => acc + parseFloat(item.plan.price || '0'), 0)
        : parseFloat(queryPrice || '0');
        
      const subtotal = totalPaid / 1.15;
      const vatAmount = totalPaid - subtotal;

      const toTLV = (tag: number, value: string) => {
        const tagBuf = new Uint8Array([tag]);
        const valueBuf = new TextEncoder().encode(value);
        const lengthBuf = new Uint8Array([valueBuf.length]);
        const combined = new Uint8Array(tagBuf.length + lengthBuf.length + valueBuf.length);
        combined.set(tagBuf);
        combined.set(lengthBuf, tagBuf.length);
        combined.set(valueBuf, tagBuf.length + lengthBuf.length);
        return combined;
      };

      const timestamp = new Date().toISOString();
      const tlvData = [
        toTLV(1, storeName),
        toTLV(2, vatNumber),
        toTLV(3, timestamp),
        toTLV(4, totalPaid.toFixed(2)),
        toTLV(5, vatAmount.toFixed(2))
      ];

      const totalLength = tlvData.reduce((acc, curr) => acc + curr.length, 0);
      const combinedTLV = new Uint8Array(totalLength);
      let offset = 0;
      tlvData.forEach(tlv => {
        combinedTLV.set(tlv, offset);
        offset += tlv.length;
      });

      const base64TLV = btoa(String.fromCharCode(...combinedTLV));
      const url = await QRCode.toDataURL(base64TLV);
      setQrCodeUrl(url);
    };

    generateQR();

    const orderId = urlParams.get('orderId') || urlParams.get('checkout_id') || `SMM-${Math.floor(Date.now() / 1000)}`;
    console.log('Conversion tracked for order:', orderId);
  }, []);

  const generateInvoice = async () => {
    if (!invoiceRef.current) return;
    setIsGenerating(true);
    try {
      const element = invoiceRef.current;
      const opt = {
        margin: 10,
        filename: `Invoice-${params.orderId}.pdf`,
        image: { type: 'jpeg' as const, quality: 0.98 },
        html2canvas: { 
          scale: 2, 
          useCORS: true, 
          letterRendering: true,
          width: 700,
          windowWidth: 700,
          x: 0,
          y: 0
        },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' as const }
      };

      // Temporarily show the element for capture if needed, 
      // but html2pdf can often handle hidden elements if they are in the DOM
      await html2pdf().set(opt).from(element).save();
    } catch (error) {
      console.error("Error generating invoice:", error);
      alert("حدث خطأ أثناء تحميل الفاتورة. يرجى المحاولة مرة أخرى.");
    } finally {
      setIsGenerating(false);
    }
  };

  const storedPlan = localStorage.getItem('last_checkout_plan');
  let items: any[] = [];
  if (storedPlan) {
    try {
      items = JSON.parse(storedPlan);
    } catch (e) {
      console.error("Error parsing stored plan:", e);
    }
  }

  const totalPrice = items.length > 0 
    ? items.reduce((acc, item) => acc + parseFloat(item.plan.price || '0'), 0)
    : parseFloat(params.price || '0');
    
  const subtotal = totalPrice / 1.15;
  const vatAmount = totalPrice - subtotal;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans flex items-center justify-center p-6 relative overflow-hidden" dir="rtl">
      {/* Hidden Invoice Template for PDF Generation */}
      <div style={{ position: 'absolute', left: '-9999px', top: '-9999px' }}>
        <div ref={invoiceRef} className="bg-white text-[#0f172a] p-10 w-[700px]" dir="rtl" style={{ fontFamily: "'Cairo', sans-serif", boxSizing: 'border-box' }}>
          {/* Header */}
          <div className="flex flex-col items-center border-b-2 border-[#059669] pb-8 mb-8">
            <div className="w-full flex justify-between items-center mb-6">
              <div className="text-right">
                <div className="text-4xl font-bold text-[#059669] mb-1">داعم ستور</div>
              </div>
              {qrCodeUrl && <img src={qrCodeUrl} alt="ZATCA QR" className="w-32 h-32" />}
            </div>
            
            <div className="w-full text-center">
              <h2 className="text-2xl font-bold">فاتورة ضريبية مبسطة</h2>
              <p className="text-sm text-[#64748b]">Simplified Tax Invoice</p>
            </div>
          </div>

          {/* Store & Customer Info */}
          <div className="grid grid-cols-2 gap-8 mb-10 text-sm">
            <div className="space-y-2">
              <h3 className="font-bold text-[#059669] border-b border-[#e2e8f0] pb-1 mb-2">معلومات المتجر</h3>
              <p><span className="font-semibold">الرقم الضريبي:</span> 312923423500003</p>
              <p><span className="font-semibold">البريد:</span> contact@daemstore.com</p>
              <p><span className="font-semibold">الهاتف:</span> 0536229261</p>
              <p><span className="font-semibold">العنوان:</span> المملكة العربية السعودية</p>
            </div>
            <div className="space-y-2">
              <h3 className="font-bold text-[#059669] border-b border-[#e2e8f0] pb-1 mb-2">معلومات الفاتورة</h3>
              <p><span className="font-semibold">العميل:</span> {decodeURIComponent(params.name || 'ضيف')}</p>
              <p><span className="font-semibold">رقم الفاتورة:</span> {params.orderId}</p>
              <p><span className="font-semibold">التاريخ:</span> {new Date().toLocaleString('ar-SA')}</p>
              <p><span className="font-semibold">طريقة الدفع:</span> Mada/Apple Pay</p>
            </div>
          </div>

          {/* Table */}
          <table className="w-full mb-10 border-collapse overflow-hidden rounded-lg">
            <thead>
              <tr className="bg-[#059669] text-white">
                <th className="p-4 text-right pr-6">المنتج (Product)</th>
                <th className="p-4 text-right">الخيارات (Options)</th>
                <th className="p-4 text-left pl-6">السعر (Price)</th>
              </tr>
            </thead>
            <tbody>
              {items.length > 0 ? items.map((item, idx) => {
                const opt = findOptionByName(item.optionName || item.option?.name);
                const productName = item.plan.name || `${item.plan.quantity} ${opt?.name || ''}`;
                return (
                  <tr key={idx} className={idx % 2 === 0 ? 'bg-[#f8fafc]' : 'bg-white'}>
                    <td className="p-4 border-b border-[#e2e8f0] pr-6">{productName}</td>
                    <td className="p-4 border-b border-[#e2e8f0] text-xs text-[#475569]">
                      <p>الرابط: {item.targetLink}</p>
                      <p>الكمية: {item.plan.quantity}</p>
                    </td>
                    <td className="p-4 border-b border-[#e2e8f0] text-left pl-6 font-mono">{parseFloat(item.plan.price).toFixed(2)} SAR</td>
                  </tr>
                );
              }) : (
                <tr className="bg-white">
                  <td className="p-4 border-b border-[#e2e8f0] pr-6">{decodeURIComponent(params.service || 'خدمة')}</td>
                  <td className="p-4 border-b border-[#e2e8f0] text-[#64748b]">N/A</td>
                  <td className="p-4 border-b border-[#e2e8f0] text-left pl-6 font-mono">{totalPrice.toFixed(2)} SAR</td>
                </tr>
              )}
            </tbody>
          </table>

          {/* Footer Totals */}
          <div className="flex justify-end mb-12">
            <div className="w-72 space-y-3 bg-[#f8fafc] p-6 rounded-2xl border border-[#e2e8f0]">
              <div className="flex justify-between text-sm">
                <span className="text-[#64748b]">المجموع الفرعي (Subtotal)</span>
                <span className="font-mono font-bold">{subtotal.toFixed(2)} SAR</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-[#64748b]">ضريبة القيمة المضافة (VAT 15%)</span>
                <span className="font-mono font-bold">{vatAmount.toFixed(2)} SAR</span>
              </div>
              <div className="flex justify-between text-xl font-black border-t border-[#e2e8f0] pt-3 text-[#059669]">
                <span>الإجمالي (Total)</span>
                <span className="font-mono">{totalPrice.toFixed(2)} SAR</span>
              </div>
            </div>
          </div>

          <div className="mt-auto text-center text-[#94a3b8] text-sm border-t border-[#f1f5f9] pt-8">
            <p className="text-lg font-bold text-[#64748b] mb-2">شكراً لشرائك من المتجر. نتمنى لك يوماً رائعاً!</p>
            <p>Thank you for your purchase. Have a great day!</p>
            <div className="mt-4 flex justify-center gap-4 text-[10px]">
              <span>www.daemstore.com</span>
              <span>•</span>
              <span>الرقم الضريبي: 312923423500003</span>
            </div>
          </div>
        </div>
      </div>

      {/* Background Glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-emerald-500/10 blur-[120px] rounded-full" />
      <div className="absolute bottom-[10%] right-[-10%] w-[40%] h-[40%] bg-violet-500/10 blur-[120px] rounded-full" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl w-full bg-slate-900/50 backdrop-blur-xl border border-white/10 rounded-[3rem] p-8 md:p-12 text-center relative z-10 shadow-2xl"
      >
        <div className="w-20 h-20 bg-emerald-500 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-lg shadow-emerald-500/20">
          <Check className="w-10 h-10 text-slate-950 stroke-[3]" />
        </div>

        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 font-display">شكراً لثقتك بنا!</h1>
        <p className="text-slate-400 text-lg mb-10 leading-relaxed">
          تم استلام طلبك بنجاح. فريقنا يعمل الآن على معالجة طلبك وسيبدأ التنفيذ خلال دقائق بسيطة.
        </p>

        <div className="bg-slate-950/50 border border-white/5 rounded-3xl p-6 mb-8 text-right space-y-4">
          <div className="flex items-center justify-between border-b border-white/5 pb-4">
            <span className="text-slate-500 text-sm font-bold uppercase tracking-wider flex items-center gap-2">
              <Package className="w-4 h-4 text-emerald-500" /> رقم الطلب
            </span>
            <span className="text-white font-mono font-bold">{params.orderId}</span>
          </div>

          {params.name && (
            <div className="flex items-center justify-between border-b border-white/5 pb-4">
              <span className="text-slate-500 text-sm font-bold uppercase tracking-wider flex items-center gap-2">
                <User className="w-4 h-4 text-emerald-500" /> العميل
              </span>
              <span className="text-white font-bold">{decodeURIComponent(params.name)}</span>
            </div>
          )}

          {params.service && (
            <div className="flex items-center justify-between border-b border-white/5 pb-4">
              <span className="text-slate-500 text-sm font-bold uppercase tracking-wider flex items-center gap-2">
                <Zap className="w-4 h-4 text-emerald-500" /> الخدمة
              </span>
              <span className="text-white font-bold">{decodeURIComponent(params.service)}</span>
            </div>
          )}

            <div className="flex items-center justify-between">
              <span className="text-slate-500 text-sm font-bold uppercase tracking-wider flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-emerald-500" /> المبلغ المدفوع
              </span>
              <div className="text-left">
                <span className="text-emerald-500 font-bold text-xl block leading-none">{totalPrice.toFixed(2)} ر.س</span>
                <span className="text-[10px] text-slate-500 font-bold block mt-1">شامل الضريبة</span>
              </div>
            </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button 
            onClick={() => window.location.href = '/'}
            className="bg-emerald-500 text-slate-950 px-8 py-4 rounded-2xl font-bold hover:bg-emerald-400 transition-all active:scale-95 shadow-lg shadow-emerald-500/20"
          >
            العودة للرئيسية
          </button>
          <button 
            onClick={generateInvoice}
            disabled={isGenerating}
            className="bg-white/5 text-white border border-white/10 px-8 py-4 rounded-2xl font-bold hover:bg-white/10 transition-all active:scale-95 flex items-center gap-2 justify-center"
          >
            {isGenerating ? 'جاري التحميل...' : 'تحميل الفاتورة الضريبية'}
          </button>
          <button 
            onClick={() => window.open('https://wa.me/966536229261', '_blank')}
            className="bg-white/5 text-white border border-white/10 px-8 py-4 rounded-2xl font-bold hover:bg-white/10 transition-all active:scale-95"
          >
            تواصل مع الدعم
          </button>
        </div>

        <p className="mt-12 text-slate-500 text-sm">
          سيتم إرسال تفاصيل الطلب إلى بريدك الإلكتروني قريباً.
        </p>
      </motion.div>
    </div>
  );
}

export function TermsOfService() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans selection:bg-emerald-500/30" dir="rtl">
      {/* Simple Header */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-950/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center shadow-lg shadow-emerald-500/20">
              <Zap className="text-slate-950 w-5 h-5 fill-slate-950" />
            </div>
            <span className="text-xl font-bold text-white">داعم <span className="text-emerald-500">ستور</span></span>
          </Link>
          <Link to="/" className="text-slate-400 hover:text-white transition-colors flex items-center gap-2 text-sm font-bold">
            العودة للرئيسية <ArrowRight className="w-4 h-4 rotate-180" />
          </Link>
        </div>
      </nav>

      <main className="pt-32 pb-20 px-6">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-3xl md:text-5xl font-bold text-white mb-8 font-display border-r-4 border-emerald-500 pr-4">
              شروط الخدمة - داعم ستور
            </h1>
            
            <p className="text-lg text-slate-400 mb-12 leading-relaxed">
              إن استخدام الخدمات المقدمة من داعم ستور يشكل موافقة على هذه الشروط. بتسجيلك أو استخدامك لهذه الخدمات، فإنك تقر بأنك قرأت وفهمت تماماً شروط الخدمة التالية الخاصة بهذا الاتفاق.
            </p>

            <div className="space-y-12">
              <section>
                <h2 className="text-xl font-bold text-emerald-500 mb-4 flex items-center gap-2">
                  <span className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-sm">1</span>
                  الشروط العامة
                </h2>
                <p className="text-slate-400 leading-relaxed">
                  شكراً لاستخدامك منتجاتنا وخدماتنا ("الخدمات") المقدمة من داعم ستور. من خلال وصولك إلى هذا الموقع، فإنك توافق على الالتزام بشروط وأحكام الاستخدام، وجميع القوانين واللوائح المعمول بها، وتوافق على أنك مسؤول عن الامتثال لأي قوانين محلية سارية. المواد الواردة في هذا الموقع محمية بموجب قوانين حقوق النشر والعلامات التجارية.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-emerald-500 mb-4 flex items-center gap-2">
                  <span className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-sm">2</span>
                  الخدمة
                </h2>
                <ul className="space-y-4 text-slate-400">
                  <li className="flex gap-3">
                    <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                    <span>يُستخدم داعم ستور فقط للأغراض الترويجية لحسابك ومحتوياتك على منصة تيك توك.</span>
                  </li>
                  <li className="flex gap-3">
                    <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                    <span>لا يضمن داعم ستور تفاعل المتابعين الجدد مع منشوراتك المستقبلية؛ نحن نضمن فقط وصول العدد الذي دفعته مقابل الخدمة.</span>
                  </li>
                  <li className="flex gap-3">
                    <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                    <span>لن يتم تعويض أي تفاعل على المنشورات المستقبلية ما لم يتم شراء خدمة "اللايكات التلقائية".</span>
                  </li>
                  <li className="flex gap-3">
                    <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                    <span>يُمنع منعاً باتاً رفع أي محتوى يتضمن عرياً أو مواد غير مقبولة أو تخالف معايير مجتمع تيك توك عبر داعم ستور.</span>
                  </li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-bold text-emerald-500 mb-4 flex items-center gap-2">
                  <span className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-sm">3</span>
                  معالج الدفع والأمان
                </h2>
                <ul className="space-y-4 text-slate-400">
                  <li className="flex gap-3">
                    <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                    <span>يتم معالجة المدفوعات عبر بوابة دفع آمنة مشفرة بنظام SSL، ولا يتم حفظ أي معلومات مالية حساسة على خوادمنا.</span>
                  </li>
                  <li className="flex gap-3">
                    <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                    <span>بمجرد إتمام الشراء، فإنك تقر بفهمك التام لما اشتريته وتتعهد بعدم رفع نزاع أو مطالبة مالية احتيالية.</span>
                  </li>
                  <li className="flex gap-3">
                    <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                    <span>في حال محاولة رفع نزاع احتيالي، نحتفظ بالحق في تصفير المتابعين واللايكات، إنهاء الحساب، أو حظر عنوان الـ IP الخاص بك نهائياً.</span>
                  </li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-bold text-emerald-500 mb-4 flex items-center gap-2">
                  <span className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-sm">4</span>
                  التسجيل وحقوق النشر
                </h2>
                <ul className="space-y-4 text-slate-400">
                  <li className="flex gap-3">
                    <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                    <span>بطلبك للخدمة، فأنت تقر بأن عمرك لا يقل عن 13 عاماً.</span>
                  </li>
                  <li className="flex gap-3">
                    <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                    <span>يُمنع نسخ أي برمجة أو نصوص أو صور مستخدمة في موقع داعم ستور دون موافقة خطية رسمية.</span>
                  </li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-bold text-emerald-500 mb-4 flex items-center gap-2">
                  <span className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-sm">5</span>
                  إخلاء المسؤولية
                </h2>
                <ul className="space-y-4 text-slate-400">
                  <li className="flex gap-3">
                    <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                    <span>داعم ستور غير مسؤول عن أي تعليق للحساب أو حذف للمحتوى يتم بواسطة منصة تيك توك.</span>
                  </li>
                  <li className="flex gap-3">
                    <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                    <span>المتجر غير مسؤول عن أي أضرار قد تلحق بك أو بنشاطك التجاري، ولا نقدم ضمانات مطلقة حول توفر الموقع بشكل دائم نظراً لطبيعة العمل عبر الإنترنت.</span>
                  </li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-bold text-emerald-500 mb-6 flex items-center gap-2">
                  <span className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-sm">6</span>
                  سياسة الاسترجاع (Refund Policy)
                </h2>
                
                <div className="space-y-8 pr-4 border-r border-white/5">
                  <div>
                    <h3 className="text-white font-bold mb-3 flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      أولاً: حالات لا يحق فيها طلب الاسترجاع:
                    </h3>
                    <ul className="space-y-3 text-slate-400 text-sm">
                      <li>بما أن داعم ستور يقدم سلعاً رقمية غير ملموسة، فلا يمكن استرداد المبلغ بمجرد اكتمال الطلب، حتى لو تم إدخال اسم المستخدم بشكل خاطئ.</li>
                      <li>لا يتم الاسترجاع في حال تم حذف الحساب أو المحتوى من قبل تيك توك بعد تنفيذ الخدمة.</li>
                      <li>في حال الشراء من داعم ستور ومزود آخر في نفس الوقت، يتحمل العميل مسؤولية أي تداخل أو مشاكل ناتجة.</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-white font-bold mb-3 flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      ثانياً: حالات النقص والتعويض:
                    </h3>
                    <ul className="space-y-3 text-slate-400 text-sm">
                      <li>في حال حدوث نقص (Drop) في الخدمة، يتم التعويض خلال شهر واحد (30 يوماً) من تاريخ الشراء، بشرط إثبات أن النقص من خدماتنا.</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-white font-bold mb-3 flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      ثالثاً: حالات يحق فيها طلب الاسترجاع:
                    </h3>
                    <ul className="space-y-3 text-slate-400 text-sm">
                      <li>الطلب الجزئي: إذا نُفذ جزء من الطلب فقط، يتم استرداد المبلغ المتبقي بناءً على لوحة التحكم الخاصة بنا.</li>
                      <li>عدم تسليم الخدمة: إذا لم يتم البدء في تنفيذ الطلب وتأخر بشكل كبير، يجب تقديم طلب كتابي خلال 3 أيام عمل من تاريخ الطلب.</li>
                    </ul>
                  </div>
                </div>
              </section>

              <section>
                <h2 className="text-xl font-bold text-emerald-500 mb-4 flex items-center gap-2">
                  <span className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-sm">7</span>
                  سياسة الإلغاء
                </h2>
                <p className="text-slate-400 leading-relaxed">
                  نظراً لطبيعة الخدمات الرقمية، لا يمكن إلغاء أو عكس الطلبات التي دخلت مرحلة التنفيذ أو تم تسليمها بالفعل.
                </p>
              </section>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
}

export function PrivacyPolicy() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans selection:bg-emerald-500/30" dir="rtl">
      {/* Simple Header */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-950/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center shadow-lg shadow-emerald-500/20">
              <Zap className="text-slate-950 w-5 h-5 fill-slate-950" />
            </div>
            <span className="text-xl font-bold text-white">داعم <span className="text-emerald-500">ستور</span></span>
          </Link>
          <Link to="/" className="text-slate-400 hover:text-white transition-colors flex items-center gap-2 text-sm font-bold">
            العودة للرئيسية <ArrowRight className="w-4 h-4 rotate-180" />
          </Link>
        </div>
      </nav>

      <main className="pt-32 pb-20 px-6">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-3xl md:text-5xl font-bold text-white mb-8 font-display border-r-4 border-emerald-500 pr-4">
              سياسة الخصوصية - داعم ستور
            </h1>
            
            <div className="space-y-12">
              <section>
                <h2 className="text-xl font-bold text-emerald-500 mb-4 flex items-center gap-2">
                  <span className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-sm">1</span>
                  كيف يستخدم داعم ستور المعلومات
                </h2>
                <div className="text-slate-400 space-y-4 leading-relaxed">
                  <p>
                    نستخدم المعلومات التي نتلقاها بطرق متنوعة، والهدف الأساسي منها هو تحسين متجر داعم ستور. قد نستخدم هذه المعلومات أيضاً لصيانة خدماتنا، وتخصيص الخدمة لتلبية احتياجاتك، ومعالجة المعاملات، وجمع الرسوم، والتحقق من هويتك ومنع المعاملات الاحتيالية، وتوفير دعم العملاء، والاتصال بك.
                  </p>
                  <p>
                    ما لم تطلب منا عدم القيام بذلك، قد نتصل بك عبر البريد الإلكتروني مستقبلاً لإخبارك عن منتجات أو خدمات جديدة ومعلومات أخرى نعتقد أنها ستكون قيمة بالنسبة لك.
                  </p>
                  <p className="font-bold text-white mb-2">تشمل حالات الاستخدام (على سبيل المثال لا الحصر) ما يلي:</p>
                  <ul className="space-y-2 pr-4 border-r border-white/5">
                    <li>توفير وصيانة خدماتنا.</li>
                    <li>إخطارك بالتغييرات التي تطرأ على خدمتنا.</li>
                    <li>السماح لك بالمشاركة في الميزات التفاعلية لخدمتنا عندما تختار ذلك.</li>
                    <li>توفير دعم العملاء.</li>
                    <li>جمع التحليلات أو المعلومات القيمة لتحسين خدمتنا.</li>
                    <li>مراقبة استخدام الخدمة وكشف ومعالجة المشاكل التقنية.</li>
                    <li>تزويدك بالأخبار والعروض الخاصة والمعلومات العامة حول السلع والخدمات والأحداث المماثلة لما اشتريته بالفعل.</li>
                  </ul>
                </div>
              </section>

              <section>
                <h2 className="text-xl font-bold text-emerald-500 mb-4 flex items-center gap-2">
                  <span className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-sm">2</span>
                  متى يشارك داعم ستور المعلومات
                </h2>
                <div className="text-slate-400 space-y-4 leading-relaxed">
                  <p>
                    تتمثل سياستنا في الحفاظ على سرية معلومات الهوية الشخصية للأفراد، باستثناء الحالات التي يتطلب فيها القانون الإفصاح عنها أو عندما نحصل على إذن منك. قد نشارك إحصاءات مجمعة حول سلوك المستخدمين (مثل أنماط الاستخدام ونمو المستخدمين) مع شركائنا، وهذه المعلومات لن تحدد هوية أي فرد شخصياً أبداً.
                  </p>
                  <p>
                    لا يقوم داعم ستور ببيع أو تأجير أو مشاركة أي معلومات تعريف شخصية لأغراض التسويق لشركات خارج المتجر. قد نقدم معلوماتك لمزودي الخدمة والتابعين الذين يقدمون خدمات بالاشتراك مع عروضنا، مثل معالجي الدفع أو خدمات حماية الاحتيال، حيث يتم نقل المعلومات بشكل آمن وتقتصر على ما هو ضروري لتقديم خدماتهم فقط.
                  </p>
                  <p>
                    سيفصح داعم ستور عن معلومات الهوية الشخصية للمسؤولين الحكوميين ووكالات إنفاذ القانون فقط عندما يتطلب القانون ذلك (مثلاً بموجب أمر محكمة) أو لحماية وسلامة مستخدمي المتجر وموظفيه والجمهور العام.
                  </p>
                </div>
              </section>

              <section>
                <h2 className="text-xl font-bold text-emerald-500 mb-4 flex items-center gap-2">
                  <span className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-sm">3</span>
                  ما هي البيانات الشخصية التي نجمعها ولماذا؟
                </h2>
                <div className="text-slate-400 space-y-6 leading-relaxed">
                  <div>
                    <h3 className="text-white font-bold mb-2">التعليقات:</h3>
                    <p>نجمع البيانات الموضحة في نموذج التعليقات بالإضافة إلى عنوان IP الخاص بالزائر وسلسلة وكيل متصفح المستخدم للمساعدة في اكتشاف البريد العشوائي.</p>
                  </div>
                  <div>
                    <h3 className="text-white font-bold mb-2">الوسائط:</h3>
                    <p>إذا قمت برفع صور إلى الموقع، يجب تجنب رفع صور تحتوي على بيانات موقع مضمنة (EXIF GPS)، حيث يمكن للزوار تنزيل واستخراج بيانات الموقع من الصور.</p>
                  </div>
                  <div>
                    <h3 className="text-white font-bold mb-2">المحتوى المضمن:</h3>
                    <p>قد تتضمن المقالات محتوى مضمناً (مثل الفيديوهات والصور)، ويتصرف هذا المحتوى بنفس الطريقة تماماً كما لو أن الزائر زار الموقع الآخر مباشرة.</p>
                  </div>
                  <div>
                    <h3 className="text-white font-bold mb-2">الجمع التلقائي للمعلومات:</h3>
                    <p>تسجل خوادمنا تلقائياً المعلومات التي يرسلها متصفحك، مثل عنوان IP الخاص بجهازك، نوع المتصفح وإصداره، تفضيلات اللغة، والصفحات التي تزورها في موقعنا ووقت الزيارة.</p>
                  </div>
                  <div>
                    <h3 className="text-white font-bold mb-2">جمع المعلومات الشخصية:</h3>
                    <p>
                      يمكنك زيارة الموقع دون إخبارنا بهويتك. ومع ذلك، لاستخدام بعض الميزات، قد نطلب منك معلومات مثل اسمك وبريدك الإلكتروني. نقوم بتخزين المعلومات التي تملأها عند الشراء مثل اسم المستخدم (Handle) والبريد الإلكتروني، وينطبق الشيء نفسه على نموذج "اتصل بنا". بالنسبة لمعلومات الدفع، فإن داعم ستور لا يقوم بتخزين هذه الأنواع من المعلومات.
                    </p>
                  </div>
                </div>
              </section>

              <section>
                <h2 className="text-xl font-bold text-emerald-500 mb-4 flex items-center gap-2">
                  <span className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-sm">4</span>
                  مدة الاحتفاظ ببياناتك
                </h2>
                <div className="text-slate-400 space-y-4 leading-relaxed">
                  <p>
                    إذا تركت تعليقاً، يتم الاحتفاظ بالتعليق والبيانات الوصفية الخاصة به إلى أجل غير مسمى. بالنسبة للمستخدمين المسجلين، نقوم بتخزين المعلومات الشخصية التي يقدمونها في ملف تعريف المستخدم الخاص بهم، ويمكن لجميع المستخدمين رؤية معلوماتهم أو تعديلها أو حذفها في أي وقت (باستثناء اسم المستخدم).
                  </p>
                  <p>
                    سوف يحتفظ داعم ستور ببياناتك الشخصية فقط للفترة اللازمة للأغراض المنصوص عليها في سياسة الخصوصية هذه، وللامتثال لالتزاماتنا القانونية وحل النزاعات وإنفاذ اتفاقياتنا القانونية.
                  </p>
                </div>
              </section>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
}

export function RefillRequest() {
  const [formData, setFormData] = useState({
    orderID: '',
    link: '',
    currentCount: '',
    problemDescription: ''
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(false);
    setSuccess(false);

    try {
      const response = await fetch('/api/webhook/refill', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        setSuccess(true);
        setFormData({
          orderID: '',
          link: '',
          currentCount: '',
          problemDescription: ''
        });
      } else {
        setError(true);
      }
    } catch (err) {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans selection:bg-emerald-500/30" dir="rtl">
      {/* Simple Header */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-950/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center shadow-lg shadow-emerald-500/20">
              <Zap className="text-slate-950 w-5 h-5 fill-slate-950" />
            </div>
            <span className="text-xl font-bold text-white">داعم <span className="text-emerald-500">ستور</span></span>
          </Link>
          <Link to="/" className="text-slate-400 hover:text-white transition-colors flex items-center gap-2 text-sm font-bold">
            العودة للرئيسية <ArrowRight className="w-4 h-4 rotate-180" />
          </Link>
        </div>
      </nav>

      <main className="pt-32 pb-20 px-6">
        <div className="max-w-xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="text-center mb-10">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-emerald-500/10 mb-6">
                <RefreshCw className="w-8 h-8 text-emerald-500" />
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-4 font-display">
                طلب تعويض نقص
              </h1>
              <p className="text-slate-400">
                يرجى ملء النموذج أدناه لطلب تعويض النقص في طلبك. سنقوم بمراجعة الطلب ومعالجته في أقرب وقت ممكن.
              </p>
            </div>

            <div className="bg-slate-900/50 backdrop-blur-sm border border-white/5 rounded-3xl p-8 shadow-2xl">
              {success ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-8"
                >
                  <div className="w-20 h-20 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle2 className="w-10 h-10 text-emerald-500" />
                  </div>
                  <h2 className="text-2xl font-bold text-white mb-4">تم استلام طلبك بنجاح!</h2>
                  <p className="text-slate-400 mb-8 leading-relaxed">
                    فريق داعم ستور سيراجع وصف المشكلة ويعوض النقص خلال 24 ساعة.
                  </p>
                  <button
                    onClick={() => setSuccess(false)}
                    className="px-8 py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl transition-all"
                  >
                    إرسال طلب آخر
                  </button>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  {error && (
                    <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-3 text-red-400 text-sm">
                      <AlertCircle className="w-5 h-5 shrink-0" />
                      <p>عذراً، حدث خطأ أثناء الإرسال. يرجى المحاولة لاحقاً.</p>
                    </div>
                  )}

                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-300 pr-1">رقم الطلب (Order ID)</label>
                    <input
                      required
                      type="text"
                      value={formData.orderID}
                      onChange={(e) => setFormData({ ...formData, orderID: e.target.value })}
                      placeholder="مثال: 123456"
                      className="w-full px-5 py-4 bg-slate-950 border border-white/5 rounded-2xl focus:outline-none focus:border-emerald-500/50 focus:ring-4 focus:ring-emerald-500/10 transition-all text-white placeholder:text-slate-400"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-300 pr-1">رابط الحساب أو المنشور (Link)</label>
                    <input
                      required
                      type="url"
                      value={formData.link}
                      onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                      placeholder="https://www.tiktok.com/@username"
                      className="w-full px-5 py-4 bg-slate-950 border border-white/5 rounded-2xl focus:outline-none focus:border-emerald-500/50 focus:ring-4 focus:ring-emerald-500/10 transition-all text-white placeholder:text-slate-400 text-left"
                      dir="ltr"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-300 pr-1">العدد الحالي (Current Count)</label>
                    <input
                      required
                      type="number"
                      value={formData.currentCount}
                      onChange={(e) => setFormData({ ...formData, currentCount: e.target.value })}
                      placeholder="مثال: 5000"
                      className="w-full px-5 py-4 bg-slate-950 border border-white/5 rounded-2xl focus:outline-none focus:border-emerald-500/50 focus:ring-4 focus:ring-emerald-500/10 transition-all text-white placeholder:text-slate-400"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-300 pr-1">وصف المشكلة (Problem Description)</label>
                    <textarea
                      required
                      rows={4}
                      value={formData.problemDescription}
                      onChange={(e) => setFormData({ ...formData, problemDescription: e.target.value })}
                      placeholder="اشرح لنا المشكلة بالتفصيل..."
                      className="w-full px-5 py-4 bg-slate-950 border border-white/5 rounded-2xl focus:outline-none focus:border-emerald-500/50 focus:ring-4 focus:ring-emerald-500/10 transition-all text-white placeholder:text-slate-400 resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-4 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 disabled:cursor-not-allowed text-slate-950 font-bold rounded-2xl transition-all shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 text-lg"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-6 h-6 animate-spin" />
                        جاري الإرسال...
                      </>
                    ) : (
                      <>
                        إرسال طلب التعويض
                        <Send className="w-5 h-5 rotate-180" />
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>

            <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-6 bg-slate-900/30 border border-white/5 rounded-2xl">
                <h3 className="text-white font-bold mb-2 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-emerald-500" />
                  وقت المعالجة
                </h3>
                <p className="text-slate-400 text-sm leading-relaxed">
                  يتم مراجعة طلبات التعويض ومعالجتها عادةً خلال 24 ساعة من وقت الإرسال.
                </p>
              </div>
              <div className="p-6 bg-slate-900/30 border border-white/5 rounded-2xl">
                <h3 className="text-white font-bold mb-2 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-500" />
                  سياسة التعويض
                </h3>
                <p className="text-slate-400 text-sm leading-relaxed">
                  نضمن تعويض النقص للخدمات التي تشمل ضمان التعويض خلال الفترة المحددة في شروط الخدمة.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
}

import { TikTokTracker } from './components/TikTokTracker';
import { trackTikTokEvent } from './utils/tiktokCapi';
import AboutUs from './components/pages/AboutUs';
import ContactUs from './components/pages/ContactUs';
import ShippingPolicy from './components/pages/ShippingPolicy';
import ReturnPolicy from './components/pages/ReturnPolicy';
import CookiePolicy from './components/pages/CookiePolicy';
import StructuredData from './components/StructuredData';
import Footer from './components/Footer';

function PublicLayout() {
  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-between">
      <div className="flex-grow">
        <Outlet />
      </div>
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <TikTokTracker />
      <StructuredData />
      <Routes>
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/checkout" element={<Home />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/contact" element={<ContactUs />} />
          <Route path="/shipping" element={<ShippingPolicy />} />
          <Route path="/returns" element={<ReturnPolicy />} />
          <Route path="/refund-policy" element={<ReturnPolicy />} />
          <Route path="/cookie-policy" element={<CookiePolicy />} />
          <Route path="/terms" element={<TermsOfService />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/refill" element={<RefillRequest />} />
          <Route path="/success" element={<ThankYou />} />
          <Route path="/thankyou" element={<ThankYou />} />
        </Route>
        <Route 
          path="/bomba" 
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          } 
        />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}
