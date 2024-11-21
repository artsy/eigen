export const useMetaDataTextColor = ({ dark }: { dark: boolean }) => {
  const primaryColor = dark ? "white100" : "black100"

  const secondaryColor = dark ? "black15" : "black60"

  const backgroundColor = dark ? "black100" : "white100"

  return {
    primaryColor,
    secondaryColor,
    backgroundColor,
  }
}
