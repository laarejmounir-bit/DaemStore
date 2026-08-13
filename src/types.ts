import { LucideIcon } from 'lucide-react';

export interface Plan {
  quantity: string;
  price: string | number;
  name?: string;
  details?: string[];
  oldPrice?: string;
}

export interface ServiceOption {
  name: string;
  label: string;
  icon?: LucideIcon;
  iconName: string;
  plans: Plan[];
  isCustom?: boolean;
}

export interface Service {
  id: string;
  name: string;
  icon: LucideIcon;
  color: string;
  options: ServiceOption[];
  specials?: ServiceOption[];
}

export interface CartItem {
  id: string;
  serviceName: string;
  optionName: string;
  planName: string;
  quantity: string;
  price: number;
  targetLink: string;
  icon: LucideIcon;
  isCustom?: boolean;
  customDetails?: {
    views: number;
    likes: number;
    saves: number;
    shares: number;
  };
}

export interface FAQ {
  question: string;
  answer: string;
}

export interface Feature {
  icon: LucideIcon;
  title: string;
  description: string;
}
