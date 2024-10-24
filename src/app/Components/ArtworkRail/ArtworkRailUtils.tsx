export const useMetaDataTextColor = ({ dark }: { dark: boolean }) => {
  const primaryTextColor = dark ? "white100" : "black100"

  const secondaryTextColor = dark ? "black15" : "black60"

  return { primaryTextColor, secondaryTextColor }
}
