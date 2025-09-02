import {
  hasNoCacheParamPresent,
  hasPersonalizedArguments,
  isRequestCacheable,
} from "app/system/relay/helpers/cacheHeaderMiddlewareHelpers"

describe(isRequestCacheable, () => {
  it("returns false if the query does not have the @cacheable directive", () => {
    const query = {
      cacheConfig: { force: true },
      controller: {},
      fetchOpts: {
        body: '{"query":"query ProgressiveOnboardingSaveArtwork_Query {\\n  me {\\n    counts {\\n      savedArtworks\\n    }\\n    id\\n  }\\n}\\n","variables":{}}',
        headers: {
          "Content-Type": "application/json",
          "User-Agent": "Artsy-Mobile ios Artsy-Mobile/8.53.0 Eigen/2022.05.11.13/8.53.0",
          "X-ACCESS-TOKEN": "xxx",
          "X-TIMEZONE": "Europe/Berlin",
          "X-USER-ID": "xxx",
        },
        method: "POST",
        signal: {},
        url: "https://metaphysics-cdn.artsy.net/v2",
      },
      id: "xxxx",
      operation: {
        id: "xxx",
        metadata: {},
        name: "ProgressiveOnboardingSaveArtwork_Query",
        operationKind: "query",
        text: null,
      },
      uploadables: null,
      variables: {},
    }
    expect(isRequestCacheable(query as any)).toBe(false)
  })

  it("returns true if the query does not have the @cacheable directive", () => {
    const query = {
      cacheConfig: {},
      controller: {},
      fetchOpts: {
        body: '{"query":"query ArtistAboveTheFoldQuery(\\n  $artistID: String!\\n  $input: FilterArtworksInput\\n) @cacheable {\\n  artist(id: $artistID) @principalField {\\n    ...ArtistHeader_artist\\n    ...ArtistArtworks_artist_2VV6jB\\n    ...ArtistHeaderNavRight_artist\\n    id\\n    internalID\\n    slug\\n    href\\n    name\\n    coverArtwork {\\n      image {\\n        url(version: \\"larger\\")\\n      }\\n      id\\n    }\\n  }\\n}\\n\\nfragment ArtistArtworksFilterHeader_artist on Artist {\\n  internalID\\n  slug\\n}\\n\\nfragment ArtistArtworks_artist_2VV6jB on Artist {\\n  ...ArtistArtworksFilterHeader_artist\\n  id\\n  slug\\n  name\\n  internalID\\n  counts {\\n    artworks\\n  }\\n  aggregations: filterArtworksConnection(first: 0, aggregations: [ARTIST_SERIES, COLOR, DIMENSION_RANGE, LOCATION_CITY, MAJOR_PERIOD, MATERIALS_TERMS, MEDIUM, PARTNER, PRICE_RANGE, SIMPLE_PRICE_HISTOGRAM]) {\\n    aggregations {\\n      slice\\n      counts {\\n        count\\n        name\\n        value\\n      }\\n    }\\n    id\\n  }\\n  artworks: filterArtworksConnection(first: 10, input: $input) {\\n    edges {\\n      node {\\n        id\\n        slug\\n        image(includeAll: false) {\\n          aspectRatio\\n        }\\n        ...ArtworkGridItem_artwork_FOvjt\\n        __typename\\n      }\\n      cursor\\n    }\\n    pageInfo {\\n      endCursor\\n      hasNextPage\\n    }\\n    id\\n  }\\n  statuses {\\n    artworks\\n  }\\n}\\n\\nfragment ArtistHeaderNavRight_artist on Artist {\\n  isFollowed\\n  counts {\\n    follows\\n  }\\n  ...useFollowArtist_artist\\n}\\n\\nfragment ArtistHeader_artist on Artist {\\n  slug\\n  birthday\\n  coverArtwork {\\n    title\\n    image {\\n      blurhash\\n      url(version: \\"larger\\")\\n    }\\n    id\\n  }\\n  internalID\\n  name\\n  nationality\\n  verifiedRepresentatives {\\n    partner {\\n      internalID\\n      name\\n      href\\n      profile {\\n        icon {\\n          url(version: \\"square140\\")\\n        }\\n        id\\n      }\\n      id\\n    }\\n    id\\n  }\\n}\\n\\nfragment ArtworkAuctionTimer_collectorSignals on CollectorSignals {\\n  auction {\\n    onlineBiddingExtended\\n    lotClosesAt\\n    registrationEndsAt\\n  }\\n}\\n\\nfragment ArtworkGridItem_artwork_FOvjt on Artwork {\\n  ...CreateArtworkAlertModal_artwork\\n  ...ContextMenuArtwork_artwork_XFsn3\\n  availability\\n  title\\n  date\\n  saleMessage\\n  slug\\n  artists(shallow: true) {\\n    name\\n    id\\n  }\\n  widthCm\\n  heightCm\\n  isHangable\\n  id\\n  internalID\\n  isAcquireable\\n  isBiddable\\n  isInquireable\\n  isOfferable\\n  isSaved\\n  isUnlisted\\n  artistNames\\n  href\\n  sale {\\n    isAuction\\n    isClosed\\n    displayTimelyAt\\n    cascadingEndTimeIntervalMinutes\\n    extendedBiddingPeriodMinutes\\n    extendedBiddingIntervalMinutes\\n    endAt\\n    startAt\\n    id\\n  }\\n  saleArtwork {\\n    counts {\\n      bidderPositions\\n    }\\n    formattedEndDateTime\\n    currentBid {\\n      display\\n    }\\n    lotID\\n    lotLabel\\n    endAt\\n    extendedBiddingEndAt\\n    id\\n  }\\n  partner {\\n    name\\n    id\\n  }\\n  image(includeAll: false) {\\n    blurhash\\n    url(version: \\"large\\")\\n    aspectRatio\\n    resized {\\n      src\\n      srcSet\\n      width\\n      height\\n    }\\n  }\\n  collectorSignals {\\n    partnerOffer {\\n      isAvailable\\n      endAt\\n      priceWithDiscount {\\n        display\\n      }\\n      id\\n    }\\n    auction {\\n      lotWatcherCount\\n      bidCount\\n      liveBiddingStarted\\n      lotClosesAt\\n    }\\n    primaryLabel\\n    ...ArtworkAuctionTimer_collectorSignals\\n    ...ArtworkSocialSignal_collectorSignals\\n  }\\n  ...useSaveArtworkToArtworkLists_artwork\\n}\\n\\nfragment ArtworkSocialSignal_collectorSignals on CollectorSignals {\\n  increasedInterest\\n  curatorsPick\\n}\\n\\nfragment ContextMenuArtworkPreviewCardImage_artwork_XFsn3 on Artwork {\\n  contextMenuImage: image {\\n    url(version: \\"large\\")\\n    resized {\\n      src\\n      srcSet\\n      width\\n      height\\n    }\\n  }\\n}\\n\\nfragment ContextMenuArtworkPreviewCard_artwork_XFsn3 on Artwork {\\n  ...ContextMenuArtworkPreviewCardImage_artwork_XFsn3\\n  artistNames\\n  date\\n  title\\n  sale {\\n    isAuction\\n    isClosed\\n    endAt\\n    id\\n  }\\n  saleMessage\\n  saleArtwork {\\n    counts {\\n      bidderPositions\\n    }\\n    currentBid {\\n      display\\n    }\\n    endAt\\n    extendedBiddingEndAt\\n    id\\n  }\\n  partner {\\n    name\\n    id\\n  }\\n}\\n\\nfragment ContextMenuArtwork_artwork_XFsn3 on Artwork {\\n  ...ContextMenuArtworkPreviewCard_artwork_XFsn3\\n  ...useSaveArtworkToArtworkLists_artwork\\n  title\\n  href\\n  artistNames\\n  artists(shallow: true) {\\n    name\\n    id\\n  }\\n  slug\\n  internalID\\n  id\\n  isHangable\\n  contextMenuImage: image {\\n    url(version: \\"large\\")\\n  }\\n  image(includeAll: false) {\\n    url(version: \\"large\\")\\n  }\\n  sale {\\n    isAuction\\n    isClosed\\n    id\\n  }\\n  heightCm\\n  widthCm\\n}\\n\\nfragment CreateArtworkAlertModal_artwork on Artwork {\\n  title\\n  internalID\\n  slug\\n  isEligibleToCreateAlert\\n  artistsArray: artists {\\n    internalID\\n    name\\n    id\\n  }\\n  attributionClass {\\n    internalID\\n    id\\n  }\\n  mediumType {\\n    filterGene {\\n      slug\\n      name\\n      id\\n    }\\n  }\\n}\\n\\nfragment useFollowArtist_artist on Artist {\\n  id\\n  internalID\\n  slug\\n  isFollowed\\n  counts {\\n    follows\\n  }\\n}\\n\\nfragment useSaveArtworkToArtworkLists_artwork on Artwork {\\n  id\\n  internalID\\n  isInAuction\\n  isSaved\\n  slug\\n  title\\n  date\\n  artistNames\\n  preview: image {\\n    url(version: \\"square\\")\\n  }\\n  customArtworkLists: collectionsConnection(first: 0, default: false, saves: true) {\\n    totalCount\\n  }\\n}\\n","variables":{"artistID":"nobuyoshi-araki","input":{"acquireable":false,"atAuction":false,"includeArtworksByFollowedArtists":false,"inquireableOnly":false,"medium":"*","offerable":false,"priceRange":"*-*","sort":"-decayed_merch"}}}',
        headers: {
          "Content-Type": "application/json",
          "User-Agent": "Artsy-Mobile ios Artsy-Mobile/8.53.0 Eigen/2022.05.11.13/8.53.0",
          "X-ACCESS-TOKEN": "xxx",
          "X-TIMEZONE": "Europe/Berlin",
          "X-USER-ID": "xxx",
        },
        method: "POST",
        signal: {},
        url: "https://metaphysics-cdn.artsy.net/v2",
      },
      id: "xxx",
      operation: {
        id: "xxx",
        metadata: {},
        name: "ArtistAboveTheFoldQuery",
        operationKind: "query",
        text: null,
      },
      uploadables: null,
      variables: {
        artistID: "nobuyoshi-araki",
        input: {
          acquireable: false,
          atAuction: false,
          includeArtworksByFollowedArtists: false,
          inquireableOnly: false,
          medium: "*",
          offerable: false,
          priceRange: "*-*",
          sort: "-decayed_merch",
        },
      },
    }
    expect(isRequestCacheable(query as any)).toBe(true)
  })
})

describe(hasNoCacheParamPresent, () => {
  it("returns true if the url has the nocache param", () => {
    const url = "https://www.artsy.net/artwork/some-artwork?nocache=true"
    expect(hasNoCacheParamPresent(url)).toBe(true)
  })

  it("returns false if the url does not have the nocache param", () => {
    const url = "https://www.artsy.net/artwork/some-artwork"
    expect(hasNoCacheParamPresent(url)).toBe(false)
  })
})

describe(hasPersonalizedArguments, () => {
  it("returns true if the variables has at least one of the SKIP_CACHE_ARGUMENTS that is truthy", () => {
    const variables = {
      randomVariable: true,
      includeArtworksByFollowedArtists: true,
    }
    expect(hasPersonalizedArguments(variables)).toBe(true)
  })

  it("returns false if the variables does not have at least one of the SKIP_CACHE_ARGUMENTS that is truthy", () => {
    const variables = {
      includeArtworksByFollowedArtists: false,
    }
    expect(hasPersonalizedArguments(variables)).toBe(false)
  })
  it("returns false if the variables is not in SKIP_CACHE_ARGUMENTS", () => {
    const variables = {
      randomVariable: false,
    }
    expect(hasPersonalizedArguments(variables)).toBe(false)
  })
})
