export const useMetaDataTextColor = ({ dark }: { dark: boolean }) => {
  const primaryTextColor = dark ? "white100" : "black100"

  const secondaryTextColor = dark ? "black15" : "black60"

  const backgroundColor = dark ? "black100" : "white100"

  return { primaryTextColor, secondaryTextColor, backgroundColor }
}
