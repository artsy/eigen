export const useMetaDataTextColor = ({ dark }: { dark: boolean }) => {
  const primaryTextColor = dark ? "white100" : "black100"

  const secondaryTextColor = dark ? "black15" : "black60"

  const backgroundColor = dark ? "black100" : "white100"

  const saveAndFollowCTAColor = dark ? "white100" : "black100"

  const saveAndFollowCTAFillColor = dark ? "white100" : "black100"

  const saveAndFollowCTABackgroundColor = dark ? "black100" : "black5"

  return {
    primaryTextColor,
    secondaryTextColor,
    backgroundColor,
    saveAndFollowCTAColor,
    saveAndFollowCTAFillColor,
    saveAndFollowCTABackgroundColor,
  }
}
