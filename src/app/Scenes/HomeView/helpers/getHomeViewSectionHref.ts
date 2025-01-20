export const getHomeViewSectionHref = (
  href: string | undefined | null,
  section: { internalID: string; __typename: string }
) => {
  return href || `home-view/sections/${section.internalID}?sectionType=${section.__typename}`
}
