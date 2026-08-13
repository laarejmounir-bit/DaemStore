export interface BusinessConfig {
  storeName: string;
  legalName: string;
  domain: string;
  websiteUrl: string;
  supportEmail: string;
  phone: string;
  address: string;
  country: string;
  vatNumber: string;
  freelanceDocNumber: string;
  currency: string;
  currencySymbol: string;
  supportHours: string;
  isAddressDetailed: boolean;
}

export const businessConfig: BusinessConfig = {
  storeName: "داعم ستور",
  legalName: "متجر داعم ستور للخدمات الرقمية",
  domain: "www.daemstore.com",
  websiteUrl: "https://www.daemstore.com",
  supportEmail: "contact@daemstore.com",
  phone: "0536229261",
  address: "المملكة العربية السعودية",
  country: "المملكة العربية السعودية",
  vatNumber: "312923423500003",
  freelanceDocNumber: "FL-187862527",
  currency: "SAR",
  currencySymbol: "ر.س",
  supportHours: "على مدار الساعة (24/7) عبر البريد الإلكتروني والدعم الفني",
  isAddressDetailed: false,
};
