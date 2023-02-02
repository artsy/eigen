// Money Formatting

const handleFirstChar = (str: string, removeLeadingZero = true) => {
  const isNumericRegex = /^[0-9]$/
  let money = str
  if (
    (removeLeadingZero && money.length > 1 && money[0] === "0") ||
    !isNumericRegex.test(money[0])
  ) {
    money = money.replace(money[0], "")
  }
  return money
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
  return (
    formattedDigits + (cents !== undefined ? `.${handleFirstChar(cents, false).slice(0, 2)}` : "")
  )
}

/** Converts a formatted money to bare float */
export const deformatMoney = (amount?: string) => {
  if (!amount) {
    return amount
  }
  return amount.replace(/[^\d.]/g, "")
}
