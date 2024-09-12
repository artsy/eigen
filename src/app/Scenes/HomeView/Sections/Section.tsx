import { Flex, Text } from "@artsy/palette-mobile"
import { HomeViewSectionsConnection_viewer$data } from "__generated__/HomeViewSectionsConnection_viewer.graphql"
import { HomeViewSectionActivityQueryRenderer } from "app/Scenes/HomeView/Sections/HomeViewSectionActivity"
import { HomeViewSectionArticlesQueryRenderer } from "app/Scenes/HomeView/Sections/HomeViewSectionArticles"
import { HomeViewSectionArticlesCardsQueryRenderer } from "app/Scenes/HomeView/Sections/HomeViewSectionArticlesCards"
import { HomeViewSectionArtistsPaginationContainer } from "app/Scenes/HomeView/Sections/HomeViewSectionArtists"
import { HomeViewSectionArtworksQueryRenderer } from "app/Scenes/HomeView/Sections/HomeViewSectionArtworks"
import { HomeViewSectionAuctionResults } from "app/Scenes/HomeView/Sections/HomeViewSectionAuctionResults"
import { HomeViewSectionFairs } from "app/Scenes/HomeView/Sections/HomeViewSectionFairs"
import { HomeViewSectionFeaturedCollectionQueryRenderer } from "app/Scenes/HomeView/Sections/HomeViewSectionFeaturedCollection"
import { HomeViewSectionGalleries } from "app/Scenes/HomeView/Sections/HomeViewSectionGalleries"
import { HomeViewSectionGeneric } from "app/Scenes/HomeView/Sections/HomeViewSectionGeneric"
import { HomeViewSectionHeroUnits } from "app/Scenes/HomeView/Sections/HomeViewSectionHeroUnits"
import { HomeViewSectionMarketingCollections } from "app/Scenes/HomeView/Sections/HomeViewSectionMarketingCollections"
import { HomeViewSectionSales } from "app/Scenes/HomeView/Sections/HomeViewSectionSales"
import { HomeViewSectionShows } from "app/Scenes/HomeView/Sections/HomeViewSectionShows"
import { HomeViewSectionViewingRooms } from "app/Scenes/HomeView/Sections/HomeViewSectionViewingRooms"
import { ExtractNodeType } from "app/utils/relayHelpers"

type SectionsConnection = NonNullable<
  HomeViewSectionsConnection_viewer$data["homeView"]["sectionsConnection"]
>

type SectionT = ExtractNodeType<SectionsConnection>

export const Section: React.FC<{ section: SectionT }> = (props) => {
  const { section } = props

  if (!section.internalID) {
    if (__DEV__) {
      throw new Error("Section has no internalID")
    }
    return null
  }

  switch (section.component?.type) {
    case "FeaturedCollection":
      return <HomeViewSectionFeaturedCollectionQueryRenderer sectionID={section.internalID} />
    case "ArticlesCard":
      return <HomeViewSectionArticlesCardsQueryRenderer sectionID={section.internalID} />
  }

  switch (section.__typename) {
    case "HomeViewSectionActivity":
      return <HomeViewSectionActivityQueryRenderer sectionID={section.internalID} />
    case "HomeViewSectionArtworks":
      return <HomeViewSectionArtworksQueryRenderer sectionID={section.internalID} />
    case "HomeViewSectionGalleries":
      return <HomeViewSectionGalleries section={section} />
    case "HomeViewSectionGeneric":
      return <HomeViewSectionGeneric section={section} />
    case "HomeViewSectionArticles":
      return <HomeViewSectionArticlesQueryRenderer sectionID={section.internalID} />
    case "HomeViewSectionArtists":
      return <HomeViewSectionArtistsPaginationContainer section={section} />
    case "HomeViewSectionAuctionResults":
      return <HomeViewSectionAuctionResults section={section} />
    case "HomeViewSectionHeroUnits":
      return <HomeViewSectionHeroUnits section={section} />
    case "HomeViewSectionFairs":
      return <HomeViewSectionFairs section={section} />
    case "HomeViewSectionMarketingCollections":
      return <HomeViewSectionMarketingCollections section={section} />
    case "HomeViewSectionShows":
      return <HomeViewSectionShows section={section} />
    case "HomeViewSectionViewingRooms":
      return <HomeViewSectionViewingRooms section={section} />
    case "HomeViewSectionSales":
      return <HomeViewSectionSales section={section} />
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
