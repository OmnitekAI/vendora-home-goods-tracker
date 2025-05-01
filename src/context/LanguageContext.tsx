
import React, { createContext, useState, useContext, ReactNode } from 'react';
import { english } from '@/locales/en';
import { spanish } from '@/locales/es';

type Translations = typeof english;

interface LanguageContextType {
  language: 'en' | 'es';
  translations: Translations;
  setLanguage: (lang: 'en' | 'es') => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState<'en' | 'es'>('en');
  
  const translations = language === 'en' ? english : spanish;
  
  const handleSetLanguage = (lang: 'en' | 'es') => {
    setLanguage(lang);
    localStorage.setItem('vendora-language', lang);
  };
  
  // Load saved language preference on mount
  React.useEffect(() => {
    const savedLanguage = localStorage.getItem('vendora-language') as 'en' | 'es' | null;
    if (savedLanguage === 'en' || savedLanguage === 'es') {
      setLanguage(savedLanguage);
    }
  }, []);
  
  return (
    <LanguageContext.Provider value={{ language, translations, setLanguage: handleSetLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
