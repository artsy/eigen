export const shouldShowHomeViewCardRail = (
  sectionID: string,
  enableNewHomeViewCardRailType: boolean,
  variantName: string
) => {
  return (
    enableNewHomeViewCardRailType &&
    variantName === "experiment" &&
    sectionID === "home-view-section-new-works-for-you"
  )
}
