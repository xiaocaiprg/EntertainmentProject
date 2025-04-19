import React, { createContext, useState, useEffect, useCallback, useMemo } from 'react';
import { DEFAULT_LANGUAGE, getCurrentLanguage, setLanguage } from '../i18n';

interface LanguageContextType {
  currentLanguage: string;
  changeLanguage: (language: string) => Promise<void>;
}

export const LanguageContext = createContext<LanguageContextType>({
  currentLanguage: DEFAULT_LANGUAGE,
  changeLanguage: async () => {},
});

interface LanguageProviderProps {
  children: React.ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = (props) => {
  const [currentLanguage, setCurrentLanguage] = useState<string>(DEFAULT_LANGUAGE);

  useEffect(() => {
    const initLanguage = async () => {
      const storedLanguage = await getCurrentLanguage();
      setCurrentLanguage(storedLanguage);
      await setLanguage(storedLanguage);
    };

    initLanguage();
  }, []);

  const changeLanguage = useCallback(async (language: string) => {
    setCurrentLanguage(language);
    await setLanguage(language);
  }, []);

  const contextValue = useMemo(
    () => ({
      currentLanguage,
      changeLanguage,
    }),
    [currentLanguage, changeLanguage],
  );

  return <LanguageContext.Provider value={contextValue}>{props.children}</LanguageContext.Provider>;
};
