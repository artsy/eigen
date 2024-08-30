import { SectionT } from "app/Scenes/HomeView/HomeView"

export const isSectionEmpty = (section: SectionT) => {
  switch (section.__typename) {
    case "ActivityRailHomeViewSection":
      return section._notificationsConnection?.totalCount === 0
    case "ArticlesRailHomeViewSection":
      return section._articlesRailConnection?.totalCount === 0
    case "ArtworksRailHomeViewSection":
      return section._artworksConnection?.totalCount === 0
    case "ArtistsRailHomeViewSection":
      return section._artistsConnection?.totalCount === 0
    case "AuctionResultsRailHomeViewSection":
      return section._auctionResultsConnection?.totalCount === 0
    case "HeroUnitsHomeViewSection":
      return section._heroUnitsConnection?.totalCount === 0
    case "FairsRailHomeViewSection":
      return section._fairsConnection?.totalCount === 0
    case "MarketingCollectionsRailHomeViewSection":
      return section._marketingCollectionsConnection?.totalCount === 0
    case "ShowsRailHomeViewSection":
      // We don't have a specific connection for shows yet
      return false
    case "SalesRailHomeViewSection":
      return section._salesConnection?.totalCount === 0
    case "GalleriesHomeViewSection":
      // We don't have a specific connection for galleries yet
      return false
    case "ViewingRoomsRailHomeViewSection":
      // We don't have a specific connection for viewing rooms yet
      return false

    default:
      console.warn(
        `isSectionEmpty: Unknown section type ${section.__typename}, please implement its logic`
      )
      return false
  }
}
