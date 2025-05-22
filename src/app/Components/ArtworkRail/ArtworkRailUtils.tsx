export const useMetaDataTextColor = ({ dark }: { dark: boolean }) => {
  const primaryColor = dark ? "mono0" : "mono100"

  const secondaryColor = dark ? "mono15" : "mono60"

  const backgroundColor = dark ? "mono100" : "mono0"

  return {
    primaryColor,
    secondaryColor,
    backgroundColor,
  }
}
