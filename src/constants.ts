import { Music2, Users, Heart, Eye, ArrowRight, Zap, Flame, Activity, ShoppingCart, TrendingUp, ShieldCheck, Headphones, Package, User, CreditCard, Bookmark, Share2, Check, CheckCircle2, Menu, X, ChevronDown, ChevronUp } from 'lucide-react';

export const FOLLOWER_PLANS = [
  { quantity: '100', price: '15' },
  { quantity: '250', price: '26' },
  { quantity: '500', price: '41' },
  { quantity: '1,000', price: '67' },
  { quantity: '2,500', price: '131' },
  { quantity: '5,000', price: '225' },
  { quantity: '10,000', price: '375' },
  { quantity: '20,000', price: '712' },
  { quantity: '50,000', price: '1687' },
];

export const LIKE_PLANS = [
  { quantity: '100', price: '9' },
  { quantity: '250', price: '17' },
  { quantity: '500', price: '30' },
  { quantity: '1,000', price: '49' },
  { quantity: '2,500', price: '94' },
  { quantity: '5,000', price: '150' },
  { quantity: '10,000', price: '262' },
  { quantity: '25,000', price: '562' },
  { quantity: '50,000', price: '1050' },
];

export const VIEW_PLANS = [
  { quantity: '500', price: '1' },
  { quantity: '1,000', price: '11' },
  { quantity: '2,500', price: '22' },
  { quantity: '5,000', price: '37' },
  { quantity: '10,000', price: '67' },
  { quantity: '25,000', price: '150' },
  { quantity: '50,000', price: '262' },
  { quantity: '100,000', price: '487' },
  { quantity: '250,000', price: '1125' },
];

export const COMMENT_PLANS = [
  { quantity: '10', price: '19' },
  { quantity: '25', price: '37' },
  { quantity: '50', price: '67' },
  { quantity: '100', price: '112' },
  { quantity: '250', price: '244' },
  { quantity: '500', price: '450' },
];

export const CUSTOM_VIEWS_PLANS = [
  { quantity: '10k', price: 10 },
  { quantity: '20k', price: 18 },
  { quantity: '30k', price: 21 },
  { quantity: '50k', price: 25 },
  { quantity: '100k', price: 35 },
  { quantity: '200k', price: 45 },
  { quantity: '500k', price: 52 },
  { quantity: '1M', price: 99 },
];

export const CUSTOM_LIKES_PLANS = [
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

export const CUSTOM_SAVES_PLANS = [
  { quantity: 'بدون', price: 0 },
  { quantity: '50', price: 2 },
  { quantity: '100', price: 3 },
  { quantity: '250', price: 5 },
  { quantity: '500', price: 7 },
  { quantity: '1000', price: 8 },
  { quantity: '2000', price: 12 },
  { quantity: '5000', price: 22 },
];

export const CUSTOM_SHARES_PLANS = [
  { quantity: 'بدون', price: 0 },
  { quantity: '50', price: 2 },
  { quantity: '100', price: 3 },
  { quantity: '250', price: 5 },
  { quantity: '500', price: 7 },
  { quantity: '1000', price: 8 },
  { quantity: '2000', price: 12 },
  { quantity: '5000', price: 22 },
];

export const EXPLORE_PACKAGES = [
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
    details: ['1 مليون مشاهدات', '10,000 لايك', '500 حفظ', '5000 شير'],
    oldPrice: '299',
    price: '99',
    quantity: 'الذهبي'
  }
];

export const HOT_OFFERS = [
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

export const SERVICES = [
  {
    id: 'tiktok',
    name: 'تيك توك',
    icon: Music2,
    color: 'text-emerald-400',
    options: [
      { name: 'متابعين', label: 'متابعين', icon: Users, plans: FOLLOWER_PLANS },
      { name: 'لايكات', label: 'لايكات', icon: Heart, plans: LIKE_PLANS },
      { name: 'مشاهدات', label: 'مشاهدات', icon: Eye, plans: VIEW_PLANS },
      { name: 'مشاركات', label: 'مشاركات', icon: ArrowRight, plans: LIKE_PLANS }
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

export const FEATURES = [
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

export const FAQS = [
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

export const ICON_MAP: Record<string, any> = {
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
