import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { businessConfig } from '../businessConfig';

export const StructuredData = () => {
  const location = useLocation();

  useEffect(() => {
    // 1. Organization Schema
    const orgSchema = {
      "@context": "https://schema.org",
      "@type": "Organization",
      "name": businessConfig.storeName,
      "legalName": businessConfig.legalName,
      "url": businessConfig.websiteUrl,
      "logo": `${businessConfig.websiteUrl}/favicon.png`,
      "contactPoint": {
        "@type": "ContactPoint",
        "telephone": businessConfig.phone,
        "contactType": "customer service",
        "email": businessConfig.supportEmail,
        "availableLanguage": ["Arabic", "English"]
      },
      "vatID": businessConfig.vatNumber,
      "address": {
        "@type": "PostalAddress",
        "addressCountry": "SA",
        "addressRegion": "Saudi Arabia"
      }
    };

    // 2. WebSite Schema
    const websiteSchema = {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "name": businessConfig.storeName,
      "url": businessConfig.websiteUrl,
      "inLanguage": "ar"
    };

    // 3. BreadcrumbList Schema
    const getBreadcrumbs = (pathname: string) => {
      const items = [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "الرئيسية",
          "item": businessConfig.websiteUrl
        }
      ];

      if (pathname === '/about') {
        items.push({
          "@type": "ListItem",
          "position": 2,
          "name": "من نحن",
          "item": `${businessConfig.websiteUrl}/about`
        });
      } else if (pathname === '/contact') {
        items.push({
          "@type": "ListItem",
          "position": 2,
          "name": "اتصل بنا",
          "item": `${businessConfig.websiteUrl}/contact`
        });
      } else if (pathname === '/shipping') {
        items.push({
          "@type": "ListItem",
          "position": 2,
          "name": "سياسة التوصيل",
          "item": `${businessConfig.websiteUrl}/shipping`
        });
      } else if (pathname === '/returns') {
        items.push({
          "@type": "ListItem",
          "position": 2,
          "name": "سياسة الاسترجاع",
          "item": `${businessConfig.websiteUrl}/returns`
        });
      } else if (pathname === '/privacy-policy') {
        items.push({
          "@type": "ListItem",
          "position": 2,
          "name": "سياسة الخصوصية",
          "item": `${businessConfig.websiteUrl}/privacy-policy`
        });
      } else if (pathname === '/terms') {
        items.push({
          "@type": "ListItem",
          "position": 2,
          "name": "شروط الخدمة",
          "item": `${businessConfig.websiteUrl}/terms`
        });
      }

      return {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": items
      };
    };

    // Remove existing dynamic script elements
    const oldScripts = document.querySelectorAll('script[data-schema-type="dynamic"]');
    oldScripts.forEach(script => script.remove());

    // Function to append script tag
    const appendScript = (data: object) => {
      const script = document.createElement('script');
      script.type = 'application/ld+json';
      script.setAttribute('data-schema-type', 'dynamic');
      script.text = JSON.stringify(data);
      document.head.appendChild(script);
    };

    appendScript(orgSchema);
    appendScript(websiteSchema);
    appendScript(getBreadcrumbs(location.pathname));

  }, [location.pathname]);

  return null;
};

export default StructuredData;
