import { Flex, Spinner } from "@artsy/palette-mobile"
import { HomeViewSectionScreenArtworksPlaceholder } from "app/Scenes/HomeViewSectionScreen/Components/HomeViewSectionScreenArtworksPlaceholder"

export const HomeViewSectionScreenPlaceholder: React.FC<{
  sectionType: string
}> = ({ sectionType }) => {
  switch (sectionType) {
    case "HomeViewSectionArtworks":
      return <HomeViewSectionScreenArtworksPlaceholder />
    default:
      return (
        <Flex flex={1} justifyContent="center" alignItems="center">
          <Spinner />
        </Flex>
      )
  }
}
