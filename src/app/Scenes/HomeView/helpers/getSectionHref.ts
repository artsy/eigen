/**
 * Returns the href for a section based on the viewAllHref prop
 * @param sectionID The ID of the section
 * @param viewAllHref The href for the view all button
 * @returns The href for the section
 */
export const getSectionHref = (sectionID: string, viewAllHref: string | null | undefined) => {
  if (typeof viewAllHref === "string") {
    return viewAllHref
  }

  if (viewAllHref === null) {
    return "home-view/sections/" + sectionID
  }

  return null
}
