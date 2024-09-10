import { Flex, Text } from "@artsy/palette-mobile"
import { HomeViewSectionsConnection_viewer$data } from "__generated__/HomeViewSectionsConnection_viewer.graphql"
import { ActivityRailHomeViewSection } from "app/Scenes/HomeView/Sections/ActivityRailHomeViewSection"
import { ArticlesCardsHomeViewSection } from "app/Scenes/HomeView/Sections/ArticlesCardsHomeViewSection"
import { ArticlesRailHomeViewSection } from "app/Scenes/HomeView/Sections/ArticlesRailHomeViewSection"
import { ArtistsRailHomeViewSectionPaginationContainer } from "app/Scenes/HomeView/Sections/ArtistsRailHomeViewSection/ArtistsRailHomeViewSection"
import { ArtworksRailHomeViewSection } from "app/Scenes/HomeView/Sections/ArtworksRailHomeViewSection"
import { AuctionResultsRailHomeViewSection } from "app/Scenes/HomeView/Sections/AuctionResultsRailHomeViewSection"
import { FairsRailHomeViewSection } from "app/Scenes/HomeView/Sections/FairsRailHomeViewSection"
import { FeaturedCollectionHomeViewSection } from "app/Scenes/HomeView/Sections/FeaturedCollectionHomeViewSection"
import { GalleriesHomeViewSection } from "app/Scenes/HomeView/Sections/GalleriesHomeViewSection"
import { GenericHomeViewSection } from "app/Scenes/HomeView/Sections/GenericHomeViewSection"
import { HeroUnitsRailHomeViewSection } from "app/Scenes/HomeView/Sections/HeroUnitsRailHomeViewSection"
import { MarketingCollectionsRailHomeViewSection } from "app/Scenes/HomeView/Sections/MarketingCollectionsRailHomeViewSection"
import { SalesRailHomeViewSection } from "app/Scenes/HomeView/Sections/SalesRailHomeViewSection"
import { ShowsRailHomeViewSection } from "app/Scenes/HomeView/Sections/ShowsRailHomeViewSection"
import { ViewingRoomsRailHomeViewSection } from "app/Scenes/HomeView/Sections/ViewingRoomsRailHomeViewSection"
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
    case "ArticlesCard":
      return <ArticlesCardsHomeViewSection section={section} />
  }

  switch (section.__typename) {
    case "ActivityRailHomeViewSection":
      return <ActivityRailHomeViewSection section={section} />
    case "ArtworksRailHomeViewSection":
      return <ArtworksRailHomeViewSection section={section} />
    case "GalleriesHomeViewSection":
      return <GalleriesHomeViewSection section={section} />
    case "GenericHomeViewSection":
      return <GenericHomeViewSection section={section} />
    case "ArticlesRailHomeViewSection":
      return <ArticlesRailHomeViewSection section={section} />
    case "ArtistsRailHomeViewSection":
      return <ArtistsRailHomeViewSectionPaginationContainer section={section} />
    case "AuctionResultsRailHomeViewSection":
      return <AuctionResultsRailHomeViewSection section={section} />
    case "HeroUnitsHomeViewSection":
      return <HeroUnitsRailHomeViewSection section={section} />
    case "FairsRailHomeViewSection":
      return <FairsRailHomeViewSection section={section} />
    case "MarketingCollectionsRailHomeViewSection":
      return <MarketingCollectionsRailHomeViewSection section={section} />
    case "ShowsRailHomeViewSection":
      return <ShowsRailHomeViewSection section={section} />
    case "ViewingRoomsRailHomeViewSection":
      return <ViewingRoomsRailHomeViewSection section={section} />
    case "SalesRailHomeViewSection":
      return <SalesRailHomeViewSection section={section} />
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
