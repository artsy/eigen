import { Flex, Text } from "@artsy/palette-mobile"
import { HomeViewSectionsConnection_viewer$data } from "__generated__/HomeViewSectionsConnection_viewer.graphql"
import { ActivityRailHomeViewSection } from "app/Scenes/HomeView/Sections/ActivityRailHomeViewSection"
import { ArticlesRailHomeViewSection } from "app/Scenes/HomeView/Sections/ArticlesRailHomeViewSection"
import { ArtistsRailHomeViewSectionPaginationContainer } from "app/Scenes/HomeView/Sections/ArtistsRailHomeViewSection"
import { ArtworksRailHomeViewSection } from "app/Scenes/HomeView/Sections/ArtworksRailHomeViewSection"
import { FairsRailHomeViewSection } from "app/Scenes/HomeView/Sections/FairsRailHomeViewSection"
import { FeaturedCollectionHomeViewSection } from "app/Scenes/HomeView/Sections/FeaturedCollectionHomeViewSection"
import { GenericHomeViewSection } from "app/Scenes/HomeView/Sections/GenericHomeViewSection"
import { HeroUnitsRailHomeViewSection } from "app/Scenes/HomeView/Sections/HeroUnitsRailHomeViewSection"
import { MarketingCollectionsRailHomeViewSection } from "app/Scenes/HomeView/Sections/MarketingCollectionsRailHomeViewSection"
import { ShowsRailHomeViewSection } from "app/Scenes/HomeView/Sections/ShowsRailHomeViewSection"
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
    case "ActivityRailHomeViewSection":
      return <ActivityRailHomeViewSection section={section} />
    case "ArtworksRailHomeViewSection":
      return <ArtworksRailHomeViewSection section={section} />
    case "GenericHomeViewSection":
      return <GenericHomeViewSection section={section} />
    case "ArticlesRailHomeViewSection":
      return <ArticlesRailHomeViewSection section={section} />
    case "ArtistsRailHomeViewSection":
      return <ArtistsRailHomeViewSectionPaginationContainer section={section} />
    case "HeroUnitsHomeViewSection":
      return <HeroUnitsRailHomeViewSection section={section} />
    case "FairsRailHomeViewSection":
      return <FairsRailHomeViewSection section={section} />
    case "MarketingCollectionsRailHomeViewSection":
      return <MarketingCollectionsRailHomeViewSection section={section} />
    case "ShowsRailHomeViewSection":
      return <ShowsRailHomeViewSection section={section} />
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
