import { COUNTRY_SELECT_OPTIONS } from "lib/Components/CountrySelect"

// finds a country's long name by the passed country code
const findCountryNameByCountryCode = (countryCode: string): string | null => {
  const countryLongName = COUNTRY_SELECT_OPTIONS.find((opt) => opt.value === countryCode)?.label

  if (countryLongName && typeof countryLongName === "string") {
    return countryLongName
  }

  return null
}

export default findCountryNameByCountryCode
