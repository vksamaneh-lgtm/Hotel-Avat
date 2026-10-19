"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export type Language = "fa" | "en";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  dir: "rtl" | "ltr";
  isEn: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>("fa");

  useEffect(() => {
    // Read saved preference or default to Persian
    const saved = localStorage.getItem("avat_lang") as Language | null;
    if (saved && (saved === "fa" || saved === "en")) {
      setLanguageState(saved);
      document.documentElement.lang = saved;
      document.documentElement.dir = saved === "en" ? "ltr" : "rtl";
    } else {
      document.documentElement.lang = "fa";
      document.documentElement.dir = "rtl";
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem("avat_lang", lang);
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === "en" ? "ltr" : "rtl";
  };

  const toggleLanguage = () => {
    const nextLang = language === "fa" ? "en" : "fa";
    setLanguage(nextLang);
  };

  const dir = language === "en" ? "ltr" : "rtl";
  const isEn = language === "en";

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        toggleLanguage,
        dir,
        isEn,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
