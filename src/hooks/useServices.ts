import { useState, useEffect } from 'react';
import { collection, onSnapshot, doc, setDoc, deleteDoc, updateDoc, getDocs, getDocsFromServer } from 'firebase/firestore';
import { db } from '../firebase';
import { 
  Music2, 
  Users, 
  Heart, 
  Eye, 
  ArrowRight, 
  Instagram, 
  Twitter, 
  Youtube, 
  Facebook, 
  Twitch, 
  Linkedin, 
  MessageCircle, 
  Send, 
  Video, 
  Camera,
  Zap,
  Flame,
  Activity,
  ShoppingCart,
  TrendingUp,
  ShieldCheck,
  Headphones,
  Package,
  User,
  CreditCard,
  Bookmark,
  Share2,
  Check,
  CheckCircle2,
  Menu,
  X,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

export const ICON_MAP: Record<string, any> = {
  'tiktok': Music2,
  'instagram': Camera,
  'twitter': Twitter,
  'youtube': Youtube,
  'facebook': Facebook,
  'twitch': Twitch,
  'linkedin': Linkedin,
  'telegram': Send,
  'whatsapp': MessageCircle,
  'users': Users,
  'heart': Heart,
  'eye': Eye,
  'arrow-right': ArrowRight,
  'video': Video,
  'zap': Zap,
  'flame': Flame,
  'activity': Activity,
  'shopping-cart': ShoppingCart,
  'trending-up': TrendingUp,
  'shield-check': ShieldCheck,
  'headphones': Headphones,
  'package': Package,
  'user': User,
  'credit-card': CreditCard,
  'bookmark': Bookmark,
  'share2': Share2,
  'check': Check,
  'check-circle2': CheckCircle2,
  'menu': Menu,
  'x': X,
  'chevron-down': ChevronDown,
  'chevron-up': ChevronUp,
};

const DEFAULT_SERVICES = [
  {
    id: 'tiktok',
    name: 'تيك توك',
    iconName: 'tiktok',
    color: 'text-emerald-400',
    options: [
      { 
        name: 'متابعين', 
        iconName: 'users', 
        plans: [
          { quantity: '500', price: '19' },
          { quantity: '1,000', price: '39' },
          { quantity: '2,500', price: '69' },
          { quantity: '5,000', price: '129' },
          { quantity: '10,000', price: '249' },
          { quantity: '20,000', price: '499' },
          { quantity: '50,000', price: '799' },
        ] 
      },
      { 
        name: 'لايكات', 
        iconName: 'heart', 
        plans: [
          { quantity: '1,000', price: '10' },
          { quantity: '2,500', price: '15' },
          { quantity: '5,000', price: '29' },
          { quantity: '10,000', price: '69' },
          { quantity: '25,000', price: '129' },
          { quantity: '50,000', price: '199' },
        ] 
      },
      { 
        name: 'مشاهدات', 
        iconName: 'eye', 
        plans: [
          { quantity: '10,000', price: '15' },
          { quantity: '25,000', price: '25' },
          { quantity: '50,000', price: '35' },
          { quantity: '100,000', price: '49' },
          { quantity: '250,000', price: '59' },
          { quantity: '500,000', price: '75' },
          { quantity: '1,000,000', price: '99' },
        ] 
      },
      { 
        name: 'مشاركات', 
        iconName: 'arrow-right', 
        plans: [
          { quantity: '500', price: '5' },
          { quantity: '1,000', price: '8' },
          { quantity: '2,500', price: '10' },
          { quantity: '5,000', price: '15' },
          { quantity: '10,000', price: '19' },
          { quantity: '25,000', price: '25' },
          { quantity: '50,000', price: '35' },
        ] 
      }
    ],
    specials: [
      {
        name: 'بكجات الاكسبلور',
        iconName: 'zap',
        plans: [
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
        ]
      },
      {
        name: 'العروض القوية',
        iconName: 'flame',
        plans: [
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
        ]
      },
      {
        name: 'ضبط مقطعك بكيفك',
        iconName: 'activity',
        isCustom: true,
        plans: []
      }
    ]
  }
];

export function useServices() {
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'services'), (snapshot) => {
      if (snapshot.empty) {
        setServices(DEFAULT_SERVICES);
        // Optionally, seed the database here
        DEFAULT_SERVICES.forEach(async (service) => {
          try {
            await setDoc(doc(db, 'services', service.id), service);
          } catch (e) {
            console.error('Failed to seed services:', e);
          }
        });
      } else {
        const fetchedServices = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setServices(fetchedServices);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const addService = async (service: any) => {
    await setDoc(doc(db, 'services', service.id), service);
  };

  const updateService = async (id: string, data: any) => {
    await updateDoc(doc(db, 'services', id), data);
  };

  const deleteService = async (id: string) => {
    await deleteDoc(doc(db, 'services', id));
  };

  const refetch = async () => {
    setLoading(true);
    try {
      const snapshot = await getDocsFromServer(collection(db, 'services'));
      if (snapshot.empty) {
        setServices(DEFAULT_SERVICES);
      } else {
        const fetchedServices = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setServices(fetchedServices);
      }
    } catch (error) {
      console.error("Error refetching services:", error);
    } finally {
      setLoading(false);
    }
  };

  return { services, loading, addService, updateService, deleteService, refetch };
}
