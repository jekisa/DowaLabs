"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";

export type Language = "id" | "en";

const STORAGE_KEY = "dowalabs-language";

const LanguageContext = createContext<{
  language: Language;
  setLanguage: (language: Language) => void;
}>({
  language: "id",
  setLanguage: () => {},
});

function detectLanguage(): Language {
  if (typeof window === "undefined") return "id";

  const saved = window.localStorage.getItem(STORAGE_KEY);
  if (saved === "id" || saved === "en") return saved;

  const languages = window.navigator.languages?.length
    ? window.navigator.languages
    : [window.navigator.language];

  return languages.some((item) => item?.toLowerCase().startsWith("id"))
    ? "id"
    : "en";
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>("id");

  useEffect(() => {
    setLanguageState(detectLanguage());
  }, []);

  useEffect(() => {
    document.documentElement.lang = language;
    window.localStorage.setItem(STORAGE_KEY, language);
  }, [language]);

  const value = useMemo(
    () => ({
      language,
      setLanguage: setLanguageState,
    }),
    [language]
  );

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
