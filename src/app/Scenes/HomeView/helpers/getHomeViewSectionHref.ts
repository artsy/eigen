export const getHomeViewSectionHref = (
  href: string | undefined | null,
  section: { internalID: string; __typename: string },
  modal?: boolean
) => {
  if (href) return href

  const baseUrl = `home-view/sections/${section.internalID}`
  const queryParams = `?sectionType=${section.__typename}`

  if (modal) {
    return `${baseUrl}/modal${queryParams}`
  }

  return `${baseUrl}${queryParams}`
}
