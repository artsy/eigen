import { Flex, Text } from "@artsy/palette-mobile"
import { HomeViewSectionsConnection_viewer$data } from "__generated__/HomeViewSectionsConnection_viewer.graphql"
import { ArtistsRailHomeViewSectionPaginationContainer } from "app/Scenes/HomeView/Sections/ArtistsRailHomeViewSection"
import { ArtworksRailHomeViewSection } from "app/Scenes/HomeView/Sections/ArtworksRailHomeViewSection"
import { FeaturedCollectionHomeViewSection } from "app/Scenes/HomeView/Sections/FeaturedCollectionHomeViewSection"
import { FeaturedFairsRailHomeViewSection } from "app/Scenes/HomeView/Sections/FeaturedFairsRailHomeViewSection"
import { GenericHomeViewSection } from "app/Scenes/HomeView/Sections/GenericHomeViewSection"
import { HeroUnitsRailHomeViewSection } from "app/Scenes/HomeView/Sections/HeroUnitsRailHomeViewSection"
import { ExtractNodeType } from "app/utils/relayHelpers"

type SectionsConnection = NonNullable<
  HomeViewSectionsConnection_viewer$data["homeView"]["sectionsConnection"]
>

type SectionT = ExtractNodeType<SectionsConnection>

export const Section: React.FC<{ section: SectionT }> = (props) => {
  const { section } = props

  switch (section.component?.type) {
    case "FeaturedCollection":
      return <FeaturedCollectionHomeViewSection section={section} />
  }

  switch (section.__typename) {
    case "ArtworksRailHomeViewSection":
      return <ArtworksRailHomeViewSection section={section} />
    case "GenericHomeViewSection":
      return <GenericHomeViewSection section={section} />
    case "ArtistsRailHomeViewSection":
      return <ArtistsRailHomeViewSectionPaginationContainer section={section} />
    case "HeroUnitsHomeViewSection":
      return <HeroUnitsRailHomeViewSection section={section} />
    case "FeaturedFairsHomeViewSection":
      return <FeaturedFairsRailHomeViewSection section={section} />
    default:
      if (__DEV__) {
        return (
          <Flex p={2} backgroundColor="black10">
            <Text>Non supported section:</Text>
            <Text color="devpurple">{section.__typename}</Text>
          </Flex>
        )
      }
      return null
  }
}
