import React, { createContext, useContext, useState } from 'react';

type Language = 'en' | 'ne';

interface LanguageContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Define translations in a separate dictionary or here for simplicity
const translations: Record<Language, Record<string, string>> = {
  en: {
    // General
    login: "Log In",
    register: "Register",
    getStarted: "Get Started",
    logout: "Log Out",
    home: "Home",
    back: "Back",
    
    // Landing Hero
    heroTitle: "Protecting Nepal's",
    heroTitleHighlight: "Green Future.",
    heroDesc: "Nepal's most advanced digital insurance platform for hardworking farmers. Secure your crops and livestock with AI-verified trust.",
    detectLoc: "Check Your Coverage",
    detectBtn: "Detect My Location",
    
    // Auth
    identifyRole: "Identify Yourself",
    roleDesc: "Select your role to access the Krishiyug ecosystem.",
    farmer: "Farmer",
    insurer: "Insurance Partner",
    admin: "KrishiYug Team",
    
    // Farmer Dashboard
    welcome: "Namaste",
    activePolicies: "Active Policies",
    totalCoverage: "Total Coverage",
    pendingClaims: "Pending Claims",
    riskAlert: "Risk Alert",
    monitoredLand: "Monitored Land Plots",
    recentClaims: "Recent Claims",
    
    // Insurer Dashboard
    marketOverview: "Market Overview",
    claimVelocity: "Claim Velocity",
    fraudAlerts: "High Risk Alerts",
  },
  ne: {
    // General
    login: "लग-इन",
    register: "दर्ता गर्नुहोस्",
    getStarted: "सुरु गर्नुहोस्",
    logout: "लग-आउट",
    home: "गृहपृष्ठ",
    back: "फिर्ता",
    
    // Landing Hero
    heroTitle: "नेपालको हराभरा",
    heroTitleHighlight: "भविष्य सुरक्षित गरौं।",
    heroDesc: "नेपालका मेहनती कृषकहरूका लागि एआई-प्रमाणित डिजिटल बीमा प्लेटफर्म। आफ्नो बाली र पशुधन सुरक्षित गर्नुहोस्।",
    detectLoc: "आफ्नो क्षेत्रको बीमा जाँच गर्नुहोस्",
    detectBtn: "मेरो स्थान पत्ता लगाउनुहोस्",
    
    // Auth
    identifyRole: "आफ्नो पहिचान छनौट गर्नुहोस्",
    roleDesc: "कृषियुग प्रणालीमा पहुँच पाउन आफ्नो भूमिका छनौट गर्नुहोस्।",
    farmer: "कृषक",
    insurer: "बीमा साझेदार",
    admin: "कृषियुग टोली",

    // Farmer Dashboard
    welcome: "नमस्ते",
    activePolicies: "सक्रिय बीमा",
    totalCoverage: "कुल कभरेज",
    pendingClaims: "बाँकी दाबीहरू",
    riskAlert: "जोखिम सतर्कता",
    monitoredLand: "अनुगमन गरिएको जग्गा",
    recentClaims: "हालका दाबीहरू",

    // Insurer Dashboard
    marketOverview: "बजार अवलोकन",
    claimVelocity: "दाबी गति",
    fraudAlerts: "उच्च जोखिम सतर्कता",
  }
};

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [lang, setLangState] = useState<Language>(() => {
    return (localStorage.getItem('krishiyug_lang') as Language) || 'en';
  });

  const setLang = (newLang: Language) => {
    setLangState(newLang);
    localStorage.setItem('krishiyug_lang', newLang);
  };

  const t = (key: string) => {
    return translations[lang][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) throw new Error('useLanguage must be used within LanguageProvider');
  return context;
};
