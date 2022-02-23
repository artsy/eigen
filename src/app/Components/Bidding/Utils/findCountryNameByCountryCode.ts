import { COUNTRY_SELECT_OPTIONS } from "app/Components/CountrySelect"

export const findCountryNameByCountryCode = (countryCode: string): string | null => {
  const countryLongName = COUNTRY_SELECT_OPTIONS.find((opt) => opt.value === countryCode)?.label

  if (countryLongName && typeof countryLongName === "string") {
    return countryLongName
  }

  return null
}
