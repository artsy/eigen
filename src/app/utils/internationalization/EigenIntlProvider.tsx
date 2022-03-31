import AsyncStorage from "@react-native-async-storage/async-storage"
import { Text } from "palette"
import React, { useEffect, useState } from "react"
import { IntlProvider } from "react-intl"
import languages from "../../../__generated__languages__/languages"
import { Language } from "./types"

interface EigenIntlProviderContextType {
  setPreferredLanguage: (language: Language) => void
  preferredLanguage: string
}

const EigenIntlProviderContext = React.createContext<EigenIntlProviderContextType>({
  setPreferredLanguage: () => null,
  preferredLanguage: "en",
})

const PREFERRED_LANGUAGE_KEY = "EIGENINTLPROVIDER_PREFFERED_LANGUAGE_KEY"

export const EigenIntlProvider: React.FC = ({ children }) => {
  const [preferredLanguage, setPreferredLanguage] = useState<Language>("de")

  useEffect(() => {
    AsyncStorage.getItem(PREFERRED_LANGUAGE_KEY).then((value) => {
      if (!!value) {
        setPreferredLanguage(value as Language)
      }
    })
  }, [])

  const setUserPreferredLanguage = (lang: Language) => {
    AsyncStorage.setItem(PREFERRED_LANGUAGE_KEY, lang)
    setPreferredLanguage(lang)
  }

  return (
    <IntlProvider
      defaultLocale={preferredLanguage}
      locale={preferredLanguage}
      // tslint:disable-next-line:no-string-literal
      messages={languages[preferredLanguage]}
      textComponent={Text}
      wrapRichTextChunksInFragment
    >
      <EigenIntlProviderContext.Provider
        value={{
          setPreferredLanguage: (val: Language) => {
            setUserPreferredLanguage(val)
          },
          preferredLanguage,
        }}
      >
        {children}
      </EigenIntlProviderContext.Provider>
    </IntlProvider>
  )
}
