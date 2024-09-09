import { HomeViewSectionScreenQuery$data } from "__generated__/HomeViewSectionScreenQuery.graphql"
import { HomeViewSectionScreenArtworksQueryRenderer } from "app/Scenes/HomeViewSectionScreen/Artworks/HomeViewSectionScreenArtworks"

import { Text } from "react-native-svg"

type ScreenSectionT = NonNullable<HomeViewSectionScreenQuery$data["homeView"]["section"]>

export const ScreenSection: React.FC<{ section: ScreenSectionT }> = (props) => {
  const { section } = props

  if (!section?.internalID) {
    throw new Error("Section ID is required")
  }

  switch (section.__typename) {
    case "ArtworksRailHomeViewSection":
      return <HomeViewSectionScreenArtworksQueryRenderer sectionId={section.internalID} />

    default:
      if (__DEV__) {
        return <Text>Non supported screen section: {section.__typename}</Text>
      }
      return null
  }
}
