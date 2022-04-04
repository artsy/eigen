import { EigenIntlProviderContext } from "app/utils/internationalization/EigenIntlProvider"
import { Language } from "app/utils/internationalization/types"
import { Select, SelectOption } from "palette/elements/Select"
import React, { useContext } from "react"

const OPTIONS: Record<Language, Array<SelectOption<Language>>> = {
  de: [
    { label: "Englisch", value: "en" },
    { label: "Deutsch", value: "de" },
    { label: "Französisch", value: "fr" },
  ],
  en: [
    { label: "English", value: "en" },
    { label: "German", value: "de" },
    { label: "French", value: "fr" },
  ],
  fr: [
    { label: "Anglais", value: "en" },
    { label: "Allemand", value: "de" },
    { label: "Français", value: "fr" },
  ],
}

export const SelectLanguage = () => {
  const { preferredLanguage, setPreferredLanguage } = useContext(EigenIntlProviderContext)

  const getOptions = (lang: Language) => OPTIONS[lang]

  return (
    <Select
      options={getOptions(preferredLanguage)}
      placeholder="Select Language"
      title="Language"
      onSelectValue={(val) => setPreferredLanguage(val)}
      value={preferredLanguage}
    />
  )
}
