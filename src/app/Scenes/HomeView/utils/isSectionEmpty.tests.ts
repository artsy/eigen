import { SectionT } from "app/Scenes/HomeView/HomeView"
import { isSectionEmpty } from "app/Scenes/HomeView/utils/isSectionEmpty"

describe("isSectionEmpty", () => {
  it("returns false for non empty sections", () => {
    expect(
      isSectionEmpty({
        __typename: "ActivityRailHomeViewSection",
        _notificationsConnection: {
          totalCount: 10,
        },
      } as SectionT)
    ).toBe(false)
    expect(
      isSectionEmpty({
        __typename: "ArticlesRailHomeViewSection",
        _articlesRailConnection: {
          totalCount: 10,
        },
      } as SectionT)
    ).toBe(false)
    expect(
      isSectionEmpty({
        __typename: "ArtworksRailHomeViewSection",
        _artworksConnection: {
          totalCount: 10,
        },
      } as SectionT)
    ).toBe(false)
    expect(
      isSectionEmpty({
        __typename: "ArtistsRailHomeViewSection",
        _artistsConnection: {
          totalCount: 10,
        },
      } as SectionT)
    ).toBe(false)
    expect(
      isSectionEmpty({
        __typename: "AuctionResultsRailHomeViewSection",
        _auctionResultsConnection: {
          totalCount: 10,
        },
      } as SectionT)
    ).toBe(false)
    expect(
      isSectionEmpty({
        __typename: "HeroUnitsHomeViewSection",
        _heroUnitsConnection: {
          totalCount: 10,
        },
      } as SectionT)
    ).toBe(false)
    expect(
      isSectionEmpty({
        __typename: "FairsRailHomeViewSection",
        _fairsConnection: {
          totalCount: 10,
        },
      } as SectionT)
    ).toBe(false)
    expect(
      isSectionEmpty({
        __typename: "MarketingCollectionsRailHomeViewSection",
        _marketingCollectionsConnection: {
          totalCount: 10,
        },
      } as SectionT)
    ).toBe(false)
    expect(isSectionEmpty({ __typename: "ShowsRailHomeViewSection" } as SectionT)).toBe(false)
    expect(isSectionEmpty({ __typename: "SalesRailHomeViewSection" } as SectionT)).toBe(false)
    expect(isSectionEmpty({ __typename: "GalleriesHomeViewSection" } as SectionT)).toBe(false)
    expect(isSectionEmpty({ __typename: "ViewingRoomsRailHomeViewSection" } as SectionT)).toBe(
      false
    )
  })

  it("returns true for empty sections", () => {
    expect(
      isSectionEmpty({
        __typename: "ActivityRailHomeViewSection",
        _notificationsConnection: {
          totalCount: 0,
        },
      } as SectionT)
    ).toBe(true)
    expect(
      isSectionEmpty({
        __typename: "ArticlesRailHomeViewSection",
        _articlesRailConnection: {
          totalCount: 0,
        },
      } as SectionT)
    ).toBe(true)
    expect(
      isSectionEmpty({
        __typename: "ArtworksRailHomeViewSection",
        _artworksConnection: {
          totalCount: 0,
        },
      } as SectionT)
    ).toBe(true)
    expect(
      isSectionEmpty({
        __typename: "ArtistsRailHomeViewSection",
        _artistsConnection: {
          totalCount: 0,
        },
      } as SectionT)
    ).toBe(true)
    expect(
      isSectionEmpty({
        __typename: "AuctionResultsRailHomeViewSection",
        _auctionResultsConnection: {
          totalCount: 0,
        },
      } as SectionT)
    ).toBe(true)
    expect(
      isSectionEmpty({
        __typename: "HeroUnitsHomeViewSection",
        _heroUnitsConnection: {
          totalCount: 0,
        },
      } as SectionT)
    ).toBe(true)
    expect(
      isSectionEmpty({
        __typename: "FairsRailHomeViewSection",
        _fairsConnection: {
          totalCount: 0,
        },
      } as SectionT)
    ).toBe(true)
    expect(
      isSectionEmpty({
        __typename: "MarketingCollectionsRailHomeViewSection",
        _marketingCollectionsConnection: {
          totalCount: 0,
        },
      } as SectionT)
    ).toBe(true)
  })
})
