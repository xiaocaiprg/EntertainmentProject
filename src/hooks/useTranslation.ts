import { useTranslation as useI18nTranslation } from 'react-i18next';
import { useCallback, useMemo } from 'react';

export const useTranslation = () => {
  const { t, i18n } = useI18nTranslation();

  const translate = useCallback(
    (key: string, options?: Record<string, any>) => {
      return t(key, options);
    },
    [t],
  );

  return useMemo(
    () => ({
      t: translate,
      i18n,
    }),
    [translate, i18n],
  );
};
