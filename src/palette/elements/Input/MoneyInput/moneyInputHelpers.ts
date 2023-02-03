// Money Formatting

const handleFirstChar = (str: string, removeLeadingZero = true) => {
  const isNumericRegex = /^[0-9]$/
  let money = str
  if (
    // if removeLeadingZero eliminate zeros in front of digits unless the next char is .
    // So eg 03 will be 3; 0.3 will remain 0.3
    (removeLeadingZero && money.length > 1 && money[0] === "0" && money[1] !== ".") ||
    !isNumericRegex.test(money[0])
  ) {
    money = money.replace(money[0], "")
  }
  return money
}

export const concatDigitsAndCents = (digits: string, cents?: string) => {
  return digits + (cents !== undefined ? `.${handleFirstChar(cents, false).slice(0, 2)}` : "")
}

/** Converts bare digits or floats to readable en-US money format */
export const formatMoney = (amount?: string) => {
  if (!amount) {
    return amount
  }
  // remove all special characters except "." for floats
  let replaced = amount.replace(/[^\d.]/g, "")

  // determine whether amount is 0 or user inserted 0 before amount & remove
  replaced = handleFirstChar(replaced)

  const [digits, cents] = replaced.split(".")
  const formattedDigits = digits.replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")
  return concatDigitsAndCents(formattedDigits, cents)
}

/** Converts a formatted money to bare float */
export const deformatMoney = (amount?: string) => {
  if (!amount) {
    return amount
  }
  let res = amount.replace(/[^\d.]/g, "")
  // remove all trailing dots
  while (res.length > 0 && res[res.length - 1] === ".") {
    res = res.replace(".", "")
  }

  return res
}
