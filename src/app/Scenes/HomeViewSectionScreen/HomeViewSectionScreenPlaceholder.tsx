import { Flex, Screen, Spinner } from "@artsy/palette-mobile"
import { HomeViewSectionScreenArtworksPlaceholder } from "app/Scenes/HomeViewSectionScreen/HomeViewSectionScreenArtworksPlaceholder"
import { goBack } from "app/system/navigation/navigate"

export const HomeViewSectionScreenPlaceholderContent: React.FC<{
  sectionType: string
}> = ({ sectionType }) => {
  switch (sectionType) {
    case "ArtworksRailHomeViewSection":
      return <HomeViewSectionScreenArtworksPlaceholder />
    default:
      return (
        <Flex flex={1} justifyContent="center" alignItems="center">
          <Spinner />
        </Flex>
      )
  }
}

export const HomeViewSectionScreenPlaceholder: React.FC<{
  sectionType: string
}> = ({ sectionType }) => {
  return (
    <Screen>
      <Screen.AnimatedHeader onBack={goBack} title="" />
      <Screen.Body fullwidth>
        <HomeViewSectionScreenPlaceholderContent sectionType={sectionType} />
      </Screen.Body>
    </Screen>
  )
}
