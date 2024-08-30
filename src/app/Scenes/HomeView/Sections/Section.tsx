import { Flex, Text } from "@artsy/palette-mobile"
import { HomeViewSectionsConnection_viewer$data } from "__generated__/HomeViewSectionsConnection_viewer.graphql"
import { ActivityHomeViewSection } from "app/Scenes/HomeView/Sections/ActivityHomeViewSection"
import { ArticlesCardsHomeViewSection } from "app/Scenes/HomeView/Sections/ArticlesCardsHomeViewSection"
import { ArticlesHomeViewSection } from "app/Scenes/HomeView/Sections/ArticlesHomeViewSection"
import { ArtistsHomeViewSectionPaginationContainer } from "app/Scenes/HomeView/Sections/ArtistsHomeViewSection"
import { ArtworksHomeViewSection } from "app/Scenes/HomeView/Sections/ArtworksHomeViewSection"
import { AuctionResultsHomeViewSection } from "app/Scenes/HomeView/Sections/AuctionResultsHomeViewSection"
import { FairsHomeViewSection } from "app/Scenes/HomeView/Sections/FairsHomeViewSection"
import { FeaturedCollectionHomeViewSection } from "app/Scenes/HomeView/Sections/FeaturedCollectionHomeViewSection"
import { GalleriesHomeViewSection } from "app/Scenes/HomeView/Sections/GalleriesHomeViewSection"
import { GenericHomeViewSection } from "app/Scenes/HomeView/Sections/GenericHomeViewSection"
import { HeroUnitsHomeViewSection } from "app/Scenes/HomeView/Sections/HeroUnitsHomeViewSection"
import { MarketingCollectionsHomeViewSection } from "app/Scenes/HomeView/Sections/MarketingCollectionsHomeViewSection"
import { SalesHomeViewSection } from "app/Scenes/HomeView/Sections/SalesHomeViewSection"
import { ShowsHomeViewSection } from "app/Scenes/HomeView/Sections/ShowsHomeViewSection"
import { ViewingRoomsHomeViewSection } from "app/Scenes/HomeView/Sections/ViewingRoomsHomeViewSection"
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
    case "ActivityHomeViewSection":
      return <ActivityHomeViewSection section={section} />
    case "ArtworksHomeViewSection":
      return <ArtworksHomeViewSection section={section} />
    case "GalleriesHomeViewSection":
      return <GalleriesHomeViewSection section={section} />
    case "GenericHomeViewSection":
      return <GenericHomeViewSection section={section} />
    case "ArticlesHomeViewSection":
      return <ArticlesHomeViewSection section={section} />
    case "ArtistsHomeViewSection":
      return <ArtistsHomeViewSectionPaginationContainer section={section} />
    case "AuctionResultsHomeViewSection":
      return <AuctionResultsHomeViewSection section={section} />
    case "HeroUnitsHomeViewSection":
      return <HeroUnitsHomeViewSection section={section} />
    case "FairsHomeViewSection":
      return <FairsHomeViewSection section={section} />
    case "MarketingCollectionsHomeViewSection":
      return <MarketingCollectionsHomeViewSection section={section} />
    case "ShowsHomeViewSection":
      return <ShowsHomeViewSection section={section} />
    case "ViewingRoomsHomeViewSection":
      return <ViewingRoomsHomeViewSection section={section} />
    case "SalesHomeViewSection":
      return <SalesHomeViewSection section={section} />
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
