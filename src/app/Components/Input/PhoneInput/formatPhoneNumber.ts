import { countryIndex } from "./countries"

export function formatPhoneNumber({
  current,
  previous,
  countryCode,
}: {
  current: string
  previous?: string
  countryCode: string
}) {
  if (previous && previous.length > current.length) {
    // user is deleting, don't mess with the format
    return current
  }

  if (current === "") {
    return current
  }

  const mask = countryIndex[countryCode]?.mask
  if (!mask) {
    return current
  }
  let result = mask.replace(/9/g, "_")
  for (const digit of current.replace(/\D/g, "")) {
    if (result.includes("_")) {
      result = result.replace("_", digit)
    } else {
      result = result + digit
    }
  }
  if (result.includes("_")) {
    result = result.slice(0, result.indexOf("_"))
  }

  return result
}
