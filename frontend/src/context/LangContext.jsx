import i18next from 'i18next'
import { initReactI18next } from 'react-i18next'
import { createContext, useContext, useState, useEffect } from 'react'
import en from '../locales/en.json'
import te from '../locales/te.json'

// Init i18next
i18next
  .use(initReactI18next)
  .init({
    lng: localStorage.getItem('i18nextLng') || 'te',
    fallbackLng: 'te',
    resources: {
      en: { translation: en },
      te: { translation: te },
    },
    interpolation: { escapeValue: false },
    react: { useSuspense: false },
  })

const LangContext = createContext(null)

export function LangProvider({ children }) {
  const [lang, setLang] = useState(() => localStorage.getItem('i18nextLng') || 'te')

  useEffect(() => {
    const onChanged = (lng) => {
      setLang(lng)
      localStorage.setItem('i18nextLng', lng)
    }
    i18next.on('languageChanged', onChanged)
    return () => i18next.off('languageChanged', onChanged)
  }, [])

  const toggleLang = () => i18next.changeLanguage(lang === 'te' ? 'en' : 'te')
  const t = (key, options) => i18next.t(key, options)
  const langs = ['te', 'en']

  return (
    <LangContext.Provider value={{ lang, t, toggleLang, langs, i18n: i18next }}>
      {children}
    </LangContext.Provider>
  )
}

export const useLang = () => {
  const ctx = useContext(LangContext)
  if (!ctx) throw new Error('useLang must be used within LangProvider')
  return ctx
}
