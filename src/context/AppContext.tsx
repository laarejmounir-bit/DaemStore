import React, { createContext, useContext, useState, useEffect } from 'react';
import { CartItem, Service, ServiceOption, Plan } from '../types';
import { SERVICES } from '../constants';

interface AppContextType {
  cart: CartItem[];
  setCart: React.Dispatch<React.SetStateAction<CartItem[]>>;
  selectedOption: ServiceOption | null;
  setSelectedOption: React.Dispatch<React.SetStateAction<ServiceOption | null>>;
  selectedPlan: Plan | null;
  setSelectedPlan: React.Dispatch<React.SetStateAction<Plan | null>>;
  modalStep: 'plans' | 'link' | 'cart-view' | 'checkout' | 'payment-processing' | 'success';
  setModalStep: React.Dispatch<React.SetStateAction<'plans' | 'link' | 'cart-view' | 'checkout' | 'payment-processing' | 'success'>>;
  targetLink: string;
  setTargetLink: React.Dispatch<React.SetStateAction<string>>;
  scrolled: boolean;
  isMenuOpen: boolean;
  setIsMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;
  customViews: { quantity: string; price: number };
  setCustomViews: React.Dispatch<React.SetStateAction<{ quantity: string; price: number }>>;
  customLikes: { quantity: string; price: number };
  setCustomLikes: React.Dispatch<React.SetStateAction<{ quantity: string; price: number }>>;
  customSaves: { quantity: string; price: number };
  setCustomSaves: React.Dispatch<React.SetStateAction<{ quantity: string; price: number }>>;
  customShares: { quantity: string; price: number };
  setCustomShares: React.Dispatch<React.SetStateAction<{ quantity: string; price: number }>>;
  customTotalPrice: number;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('cart');
    return saved ? JSON.parse(saved) : [];
  });

  const [selectedOption, setSelectedOption] = useState<ServiceOption | null>(null);
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [modalStep, setModalStep] = useState<'plans' | 'link' | 'cart-view' | 'checkout' | 'payment-processing' | 'success'>('plans');
  const [targetLink, setTargetLink] = useState('');
  const [scrolled, setScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Custom views state
  const [customViews, setCustomViews] = useState({ quantity: '10k', price: 10 });
  const [customLikes, setCustomLikes] = useState({ quantity: 'بدون', price: 0 });
  const [customSaves, setCustomSaves] = useState({ quantity: 'بدون', price: 0 });
  const [customShares, setCustomShares] = useState({ quantity: 'بدون', price: 0 });

  const customTotalPrice = customViews.price + customLikes.price + customSaves.price + customShares.price;

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <AppContext.Provider value={{
      cart, setCart,
      selectedOption, setSelectedOption,
      selectedPlan, setSelectedPlan,
      modalStep, setModalStep,
      targetLink, setTargetLink,
      scrolled,
      isMenuOpen, setIsMenuOpen,
      customViews, setCustomViews,
      customLikes, setCustomLikes,
      customSaves, setCustomSaves,
      customShares, setCustomShares,
      customTotalPrice
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useAppContext must be used within an AppProvider');
  return context;
};
