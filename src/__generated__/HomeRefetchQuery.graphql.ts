/* tslint:disable */
/* eslint-disable */
// @ts-nocheck
/* @relayHash 717924f2f8d316675bed943adbb8e722 */

import { ConcreteRequest } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type HomePageHeroUnitImageVersion = "NARROW" | "WIDE" | "%future added value";
export type HomeRefetchQueryVariables = {
    heroImageVersion: HomePageHeroUnitImageVersion;
};
export type HomeRefetchQueryResponse = {
    readonly homePage: {
        readonly " $fragmentRefs": FragmentRefs<"Home_homePageAbove">;
    } | null;
    readonly homePageBelow: {
        readonly " $fragmentRefs": FragmentRefs<"Home_homePageBelow">;
    } | null;
    readonly me: {
        readonly " $fragmentRefs": FragmentRefs<"Home_meAbove" | "AuctionResultsRail_me">;
    } | null;
    readonly meBelow: {
        readonly " $fragmentRefs": FragmentRefs<"Home_meBelow">;
    } | null;
    readonly featured: {
        readonly " $fragmentRefs": FragmentRefs<"Home_featured">;
    } | null;
    readonly articlesConnection: {
        readonly " $fragmentRefs": FragmentRefs<"Home_articlesConnection">;
    } | null;
};
export type HomeRefetchQuery = {
    readonly response: HomeRefetchQueryResponse;
    readonly variables: HomeRefetchQueryVariables;
};



/*
query HomeRefetchQuery(
  $heroImageVersion: HomePageHeroUnitImageVersion!
) {
  homePage @optionalField {
    ...Home_homePageAbove_1IwJ0h
  }
  homePageBelow: homePage @optionalField {
    ...Home_homePageBelow_1IwJ0h
  }
  me @optionalField {
    ...Home_meAbove
    ...AuctionResultsRail_me
    id
  }
  meBelow: me @optionalField {
    ...Home_meBelow
    id
  }
  featured: viewingRooms(featured: true) @optionalField {
    ...Home_featured
  }
  articlesConnection(first: 10, sort: PUBLISHED_AT_DESC, inEditorialFeed: true) @optionalField {
    ...Home_articlesConnection
  }
}

fragment ArticleCard_article on Article {
  internalID
  slug
  author {
    name
    id
  }
  href
  thumbnailImage {
    url(version: "large")
  }
  thumbnailTitle
  vertical
}

fragment ArticlesRail_articlesConnection on ArticleConnection {
  edges {
    node {
      internalID
      slug
      ...ArticleCard_article
      id
    }
  }
}

fragment ArtistRail_rail on HomePageArtistModule {
  id
  key
  results {
    id
    slug
    internalID
    href
    name
    formattedNationalityAndBirthday
    avatar: image {
      url(version: "small")
    }
    basedOn {
      name
      id
    }
    isFollowed
    artworksConnection(first: 3) {
      edges {
        node {
          image {
            url(version: "large")
          }
          id
        }
      }
    }
  }
}

fragment ArtworkGridItem_artwork on Artwork {
  title
  date
  saleMessage
  slug
  internalID
  artistNames
  href
  sale {
    isAuction
    isClosed
    displayTimelyAt
    endAt
    id
  }
  saleArtwork {
    counts {
      bidderPositions
    }
    currentBid {
      display
    }
    lotLabel
    id
  }
  partner {
    name
    id
  }
  image {
    url(version: "large")
    aspectRatio
  }
}

fragment ArtworkRail_rail on HomePageArtworkModule {
  title
  key
  results {
    ...SmallTileRail_artworks
    ...GenericGrid_artworks
    id
  }
  context {
    __typename
    ... on HomePageRelatedArtistArtworkModule {
      __typename
      artist {
        slug
        internalID
        href
        id
      }
      basedOn {
        name
        id
      }
    }
    ... on HomePageFollowedArtistArtworkModule {
      artist {
        href
        id
      }
    }
    ... on Fair {
      href
    }
    ... on Gene {
      href
    }
    ... on Sale {
      href
    }
    ... on Node {
      __isNode: __typename
      id
    }
  }
}

fragment AuctionResultListItem_auctionResult on AuctionResult {
  currency
  dateText
  id
  internalID
  artist {
    name
    id
  }
  images {
    thumbnail {
      url(version: "square140")
      height
      width
      aspectRatio
    }
  }
  estimate {
    low
  }
  mediumText
  organization
  boughtIn
  performance {
    mid
  }
  priceRealized {
    display
    cents
  }
  saleDate
  title
}

fragment AuctionResultsRail_me on Me {
  auctionResultsByFollowedArtists(first: 3) {
    totalCount
    edges {
      cursor
      node {
        ...AuctionResultListItem_auctionResult
        artistID
        internalID
        id
      }
    }
  }
}

fragment CollectionsRail_collectionsModule on HomePageMarketingCollectionsModule {
  results {
    title
    slug
    artworksConnection(first: 3) {
      counts {
        total
      }
      edges {
        node {
          image {
            url(version: "large")
          }
          id
        }
      }
      id
    }
    id
  }
}

fragment EmailConfirmationBanner_me on Me {
  canRequestEmailConfirmation
}

fragment FairsRail_fairsModule on HomePageFairsModule {
  results {
    id
    internalID
    slug
    profile {
      slug
      id
    }
    name
    exhibitionPeriod
    image {
      url(version: "large")
    }
    location {
      city
      country
      id
    }
    followedArtistArtworks: filterArtworksConnection(first: 2, input: {includeArtworksByFollowedArtists: true}) {
      edges {
        node {
          image {
            url(version: "large")
          }
          id
        }
      }
      id
    }
    otherArtworks: filterArtworksConnection(first: 2) {
      edges {
        node {
          image {
            url(version: "large")
          }
          id
        }
      }
      id
    }
  }
}

fragment GenericGrid_artworks on Artwork {
  id
  image {
    aspect_ratio: aspectRatio
  }
  ...ArtworkGridItem_artwork
}

fragment HomeHero_homePage_1IwJ0h on HomePage {
  heroUnits(platform: MOBILE) {
    title
    subtitle
    creditLine
    linkText
    href
    backgroundImageURL(version: $heroImageVersion)
    id
  }
}

fragment Home_articlesConnection on ArticleConnection {
  ...ArticlesRail_articlesConnection
}

fragment Home_featured on ViewingRoomConnection {
  ...ViewingRoomsListFeatured_featured
}

fragment Home_homePageAbove_1IwJ0h on HomePage {
  artworkModules(maxRails: -1, maxFollowedGeneRails: -1, order: [ACTIVE_BIDS, FOLLOWED_ARTISTS, RECENTLY_VIEWED_WORKS], include: [ACTIVE_BIDS, FOLLOWED_ARTISTS, RECENTLY_VIEWED_WORKS]) {
    id
    ...ArtworkRail_rail
  }
  salesModule {
    ...SalesRail_salesModule
  }
  ...HomeHero_homePage_1IwJ0h
}

fragment Home_homePageBelow_1IwJ0h on HomePage {
  artworkModules(maxRails: -1, maxFollowedGeneRails: -1, order: [RECOMMENDED_WORKS, FOLLOWED_GALLERIES], exclude: [RECENTLY_VIEWED_WORKS, ACTIVE_BIDS, FOLLOWED_ARTISTS, SAVED_WORKS, GENERIC_GENES, LIVE_AUCTIONS, CURRENT_FAIRS, RELATED_ARTISTS, FOLLOWED_GENES]) {
    id
    ...ArtworkRail_rail
  }
  artistModules {
    id
    ...ArtistRail_rail
  }
  fairsModule {
    ...FairsRail_fairsModule
  }
  marketingCollectionsModule {
    ...CollectionsRail_collectionsModule
  }
  ...HomeHero_homePage_1IwJ0h
}

fragment Home_meAbove on Me {
  ...EmailConfirmationBanner_me
  ...SaleArtworksHomeRail_me
}

fragment Home_meBelow on Me {
  ...AuctionResultsRail_me
}

fragment SaleArtworkTileRailCard_saleArtwork on SaleArtwork {
  artwork {
    artistNames
    date
    href
    image {
      imageURL: url(version: "small")
      aspectRatio
    }
    internalID
    slug
    saleMessage
    title
    id
  }
  counts {
    bidderPositions
  }
  currentBid {
    display
  }
  lotLabel
  sale {
    isAuction
    isClosed
    displayTimelyAt
    id
  }
}

fragment SaleArtworksHomeRail_me on Me {
  lotsByFollowedArtistsConnection(first: 6, includeArtworksByFollowedArtists: true, isAuction: true, liveSale: true) {
    pageInfo {
      hasNextPage
      startCursor
      endCursor
    }
    edges {
      node {
        id
        href
        saleArtwork {
          ...SaleArtworkTileRailCard_saleArtwork
          id
        }
        __typename
      }
      cursor
      id
    }
  }
}

fragment SalesRail_salesModule on HomePageSalesModule {
  results {
    id
    slug
    internalID
    href
    name
    liveURLIfOpen
    liveStartAt
    displayTimelyAt
    saleArtworksConnection(first: 3) {
      edges {
        node {
          artwork {
            image {
              url(version: "large")
            }
            id
          }
          id
        }
      }
    }
  }
}

fragment SmallTileRail_artworks on Artwork {
  href
  saleMessage
  artistNames
  slug
  internalID
  sale {
    isAuction
    isClosed
    displayTimelyAt
    endAt
    id
  }
  saleArtwork {
    counts {
      bidderPositions
    }
    currentBid {
      display
    }
    id
  }
  partner {
    name
    id
  }
  image {
    imageURL
  }
}

fragment ViewingRoomsListFeatured_featured on ViewingRoomConnection {
  edges {
    node {
      internalID
      title
      slug
      heroImage: image {
        imageURLs {
          normalized
        }
      }
      status
      distanceToOpen(short: true)
      distanceToClose(short: true)
      partner {
        name
        id
      }
    }
  }
}
*/

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "heroImageVersion"
  }
],
v1 = [
  {
    "kind": "Variable",
    "name": "heroImageVersion",
    "variableName": "heroImageVersion"
  }
],
v2 = [
  {
    "kind": "Literal",
    "name": "featured",
    "value": true
  }
],
v3 = [
  {
    "kind": "Literal",
    "name": "first",
    "value": 10
  },
  {
    "kind": "Literal",
    "name": "inEditorialFeed",
    "value": true
  },
  {
    "kind": "Literal",
    "name": "sort",
    "value": "PUBLISHED_AT_DESC"
  }
],
v4 = [
  "ACTIVE_BIDS",
  "FOLLOWED_ARTISTS",
  "RECENTLY_VIEWED_WORKS"
],
v5 = {
  "kind": "Literal",
  "name": "maxFollowedGeneRails",
  "value": -1
},
v6 = {
  "kind": "Literal",
  "name": "maxRails",
  "value": -1
},
v7 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
},
v8 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "title",
  "storageKey": null
},
v9 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "key",
  "storageKey": null
},
v10 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "href",
  "storageKey": null
},
v11 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "saleMessage",
  "storageKey": null
},
v12 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "artistNames",
  "storageKey": null
},
v13 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "slug",
  "storageKey": null
},
v14 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "internalID",
  "storageKey": null
},
v15 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "isAuction",
  "storageKey": null
},
v16 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "isClosed",
  "storageKey": null
},
v17 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "displayTimelyAt",
  "storageKey": null
},
v18 = {
  "alias": null,
  "args": null,
  "concreteType": "SaleArtworkCounts",
  "kind": "LinkedField",
  "name": "counts",
  "plural": false,
  "selections": [
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "bidderPositions",
      "storageKey": null
    }
  ],
  "storageKey": null
},
v19 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "display",
  "storageKey": null
},
v20 = {
  "alias": null,
  "args": null,
  "concreteType": "SaleArtworkCurrentBid",
  "kind": "LinkedField",
  "name": "currentBid",
  "plural": false,
  "selections": [
    (v19/*: any*/)
  ],
  "storageKey": null
},
v21 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "lotLabel",
  "storageKey": null
},
v22 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "name",
  "storageKey": null
},
v23 = [
  (v22/*: any*/),
  (v7/*: any*/)
],
v24 = {
  "alias": null,
  "args": null,
  "concreteType": "Partner",
  "kind": "LinkedField",
  "name": "partner",
  "plural": false,
  "selections": (v23/*: any*/),
  "storageKey": null
},
v25 = {
  "alias": null,
  "args": [
    {
      "kind": "Literal",
      "name": "version",
      "value": "large"
    }
  ],
  "kind": "ScalarField",
  "name": "url",
  "storageKey": "url(version:\"large\")"
},
v26 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "aspectRatio",
  "storageKey": null
},
v27 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "date",
  "storageKey": null
},
v28 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "__typename",
  "storageKey": null
},
v29 = {
  "alias": null,
  "args": null,
  "concreteType": "Artist",
  "kind": "LinkedField",
  "name": "basedOn",
  "plural": false,
  "selections": (v23/*: any*/),
  "storageKey": null
},
v30 = [
  (v10/*: any*/)
],
v31 = [
  (v7/*: any*/),
  (v8/*: any*/),
  (v9/*: any*/),
  {
    "alias": null,
    "args": null,
    "concreteType": "Artwork",
    "kind": "LinkedField",
    "name": "results",
    "plural": true,
    "selections": [
      (v10/*: any*/),
      (v11/*: any*/),
      (v12/*: any*/),
      (v13/*: any*/),
      (v14/*: any*/),
      {
        "alias": null,
        "args": null,
        "concreteType": "Sale",
        "kind": "LinkedField",
        "name": "sale",
        "plural": false,
        "selections": [
          (v15/*: any*/),
          (v16/*: any*/),
          (v17/*: any*/),
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "endAt",
            "storageKey": null
          },
          (v7/*: any*/)
        ],
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "concreteType": "SaleArtwork",
        "kind": "LinkedField",
        "name": "saleArtwork",
        "plural": false,
        "selections": [
          (v18/*: any*/),
          (v20/*: any*/),
          (v7/*: any*/),
          (v21/*: any*/)
        ],
        "storageKey": null
      },
      (v24/*: any*/),
      {
        "alias": null,
        "args": null,
        "concreteType": "Image",
        "kind": "LinkedField",
        "name": "image",
        "plural": false,
        "selections": [
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "imageURL",
            "storageKey": null
          },
          {
            "alias": "aspect_ratio",
            "args": null,
            "kind": "ScalarField",
            "name": "aspectRatio",
            "storageKey": null
          },
          (v25/*: any*/),
          (v26/*: any*/)
        ],
        "storageKey": null
      },
      (v7/*: any*/),
      (v8/*: any*/),
      (v27/*: any*/)
    ],
    "storageKey": null
  },
  {
    "alias": null,
    "args": null,
    "concreteType": null,
    "kind": "LinkedField",
    "name": "context",
    "plural": false,
    "selections": [
      (v28/*: any*/),
      {
        "kind": "InlineFragment",
        "selections": [
          {
            "alias": null,
            "args": null,
            "concreteType": "Artist",
            "kind": "LinkedField",
            "name": "artist",
            "plural": false,
            "selections": [
              (v13/*: any*/),
              (v14/*: any*/),
              (v10/*: any*/),
              (v7/*: any*/)
            ],
            "storageKey": null
          },
          (v29/*: any*/)
        ],
        "type": "HomePageRelatedArtistArtworkModule",
        "abstractKey": null
      },
      {
        "kind": "InlineFragment",
        "selections": [
          {
            "alias": null,
            "args": null,
            "concreteType": "Artist",
            "kind": "LinkedField",
            "name": "artist",
            "plural": false,
            "selections": [
              (v10/*: any*/),
              (v7/*: any*/)
            ],
            "storageKey": null
          }
        ],
        "type": "HomePageFollowedArtistArtworkModule",
        "abstractKey": null
      },
      {
        "kind": "InlineFragment",
        "selections": (v30/*: any*/),
        "type": "Fair",
        "abstractKey": null
      },
      {
        "kind": "InlineFragment",
        "selections": (v30/*: any*/),
        "type": "Gene",
        "abstractKey": null
      },
      {
        "kind": "InlineFragment",
        "selections": (v30/*: any*/),
        "type": "Sale",
        "abstractKey": null
      },
      {
        "kind": "InlineFragment",
        "selections": [
          (v7/*: any*/)
        ],
        "type": "Node",
        "abstractKey": "__isNode"
      }
    ],
    "storageKey": null
  }
],
v32 = [
  {
    "kind": "Literal",
    "name": "first",
    "value": 3
  }
],
v33 = [
  (v25/*: any*/)
],
v34 = {
  "alias": null,
  "args": null,
  "concreteType": "Image",
  "kind": "LinkedField",
  "name": "image",
  "plural": false,
  "selections": (v33/*: any*/),
  "storageKey": null
},
v35 = [
  (v34/*: any*/),
  (v7/*: any*/)
],
v36 = {
  "alias": null,
  "args": [
    {
      "kind": "Literal",
      "name": "platform",
      "value": "MOBILE"
    }
  ],
  "concreteType": "HomePageHeroUnit",
  "kind": "LinkedField",
  "name": "heroUnits",
  "plural": true,
  "selections": [
    (v8/*: any*/),
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "subtitle",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "creditLine",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "linkText",
      "storageKey": null
    },
    (v10/*: any*/),
    {
      "alias": null,
      "args": [
        {
          "kind": "Variable",
          "name": "version",
          "variableName": "heroImageVersion"
        }
      ],
      "kind": "ScalarField",
      "name": "backgroundImageURL",
      "storageKey": null
    },
    (v7/*: any*/)
  ],
  "storageKey": "heroUnits(platform:\"MOBILE\")"
},
v37 = [
  {
    "kind": "Literal",
    "name": "version",
    "value": "small"
  }
],
v38 = [
  {
    "alias": null,
    "args": null,
    "concreteType": "Artwork",
    "kind": "LinkedField",
    "name": "node",
    "plural": false,
    "selections": (v35/*: any*/),
    "storageKey": null
  }
],
v39 = {
  "kind": "Literal",
  "name": "first",
  "value": 2
},
v40 = {
  "alias": null,
  "args": null,
  "concreteType": "FilterArtworksEdge",
  "kind": "LinkedField",
  "name": "edges",
  "plural": true,
  "selections": (v38/*: any*/),
  "storageKey": null
},
v41 = [
  (v40/*: any*/),
  (v7/*: any*/)
],
v42 = [
  {
    "kind": "Literal",
    "name": "first",
    "value": 6
  },
  {
    "kind": "Literal",
    "name": "includeArtworksByFollowedArtists",
    "value": true
  },
  {
    "kind": "Literal",
    "name": "isAuction",
    "value": true
  },
  {
    "kind": "Literal",
    "name": "liveSale",
    "value": true
  }
],
v43 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "cursor",
  "storageKey": null
},
v44 = {
  "alias": null,
  "args": (v32/*: any*/),
  "concreteType": "AuctionResultConnection",
  "kind": "LinkedField",
  "name": "auctionResultsByFollowedArtists",
  "plural": false,
  "selections": [
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "totalCount",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "concreteType": "AuctionResultEdge",
      "kind": "LinkedField",
      "name": "edges",
      "plural": true,
      "selections": [
        (v43/*: any*/),
        {
          "alias": null,
          "args": null,
          "concreteType": "AuctionResult",
          "kind": "LinkedField",
          "name": "node",
          "plural": false,
          "selections": [
            {
              "alias": null,
              "args": null,
              "kind": "ScalarField",
              "name": "currency",
              "storageKey": null
            },
            {
              "alias": null,
              "args": null,
              "kind": "ScalarField",
              "name": "dateText",
              "storageKey": null
            },
            (v7/*: any*/),
            (v14/*: any*/),
            {
              "alias": null,
              "args": null,
              "concreteType": "Artist",
              "kind": "LinkedField",
              "name": "artist",
              "plural": false,
              "selections": (v23/*: any*/),
              "storageKey": null
            },
            {
              "alias": null,
              "args": null,
              "concreteType": "AuctionLotImages",
              "kind": "LinkedField",
              "name": "images",
              "plural": false,
              "selections": [
                {
                  "alias": null,
                  "args": null,
                  "concreteType": "Image",
                  "kind": "LinkedField",
                  "name": "thumbnail",
                  "plural": false,
                  "selections": [
                    {
                      "alias": null,
                      "args": [
                        {
                          "kind": "Literal",
                          "name": "version",
                          "value": "square140"
                        }
                      ],
                      "kind": "ScalarField",
                      "name": "url",
                      "storageKey": "url(version:\"square140\")"
                    },
                    {
                      "alias": null,
                      "args": null,
                      "kind": "ScalarField",
                      "name": "height",
                      "storageKey": null
                    },
                    {
                      "alias": null,
                      "args": null,
                      "kind": "ScalarField",
                      "name": "width",
                      "storageKey": null
                    },
                    (v26/*: any*/)
                  ],
                  "storageKey": null
                }
              ],
              "storageKey": null
            },
            {
              "alias": null,
              "args": null,
              "concreteType": "AuctionLotEstimate",
              "kind": "LinkedField",
              "name": "estimate",
              "plural": false,
              "selections": [
                {
                  "alias": null,
                  "args": null,
                  "kind": "ScalarField",
                  "name": "low",
                  "storageKey": null
                }
              ],
              "storageKey": null
            },
            {
              "alias": null,
              "args": null,
              "kind": "ScalarField",
              "name": "mediumText",
              "storageKey": null
            },
            {
              "alias": null,
              "args": null,
              "kind": "ScalarField",
              "name": "organization",
              "storageKey": null
            },
            {
              "alias": null,
              "args": null,
              "kind": "ScalarField",
              "name": "boughtIn",
              "storageKey": null
            },
            {
              "alias": null,
              "args": null,
              "concreteType": "AuctionLotPerformance",
              "kind": "LinkedField",
              "name": "performance",
              "plural": false,
              "selections": [
                {
                  "alias": null,
                  "args": null,
                  "kind": "ScalarField",
                  "name": "mid",
                  "storageKey": null
                }
              ],
              "storageKey": null
            },
            {
              "alias": null,
              "args": null,
              "concreteType": "AuctionResultPriceRealized",
              "kind": "LinkedField",
              "name": "priceRealized",
              "plural": false,
              "selections": [
                (v19/*: any*/),
                {
                  "alias": null,
                  "args": null,
                  "kind": "ScalarField",
                  "name": "cents",
                  "storageKey": null
                }
              ],
              "storageKey": null
            },
            {
              "alias": null,
              "args": null,
              "kind": "ScalarField",
              "name": "saleDate",
              "storageKey": null
            },
            (v8/*: any*/),
            {
              "alias": null,
              "args": null,
              "kind": "ScalarField",
              "name": "artistID",
              "storageKey": null
            }
          ],
          "storageKey": null
        }
      ],
      "storageKey": null
    }
  ],
  "storageKey": "auctionResultsByFollowedArtists(first:3)"
},
v45 = [
  {
    "kind": "Literal",
    "name": "short",
    "value": true
  }
];
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "HomeRefetchQuery",
    "selections": [
      {
        "alias": null,
        "args": null,
        "concreteType": "HomePage",
        "kind": "LinkedField",
        "name": "homePage",
        "plural": false,
        "selections": [
          {
            "args": (v1/*: any*/),
            "kind": "FragmentSpread",
            "name": "Home_homePageAbove"
          }
        ],
        "storageKey": null
      },
      {
        "alias": "homePageBelow",
        "args": null,
        "concreteType": "HomePage",
        "kind": "LinkedField",
        "name": "homePage",
        "plural": false,
        "selections": [
          {
            "args": (v1/*: any*/),
            "kind": "FragmentSpread",
            "name": "Home_homePageBelow"
          }
        ],
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "concreteType": "Me",
        "kind": "LinkedField",
        "name": "me",
        "plural": false,
        "selections": [
          {
            "args": null,
            "kind": "FragmentSpread",
            "name": "Home_meAbove"
          },
          {
            "args": null,
            "kind": "FragmentSpread",
            "name": "AuctionResultsRail_me"
          }
        ],
        "storageKey": null
      },
      {
        "alias": "meBelow",
        "args": null,
        "concreteType": "Me",
        "kind": "LinkedField",
        "name": "me",
        "plural": false,
        "selections": [
          {
            "args": null,
            "kind": "FragmentSpread",
            "name": "Home_meBelow"
          }
        ],
        "storageKey": null
      },
      {
        "alias": "featured",
        "args": (v2/*: any*/),
        "concreteType": "ViewingRoomConnection",
        "kind": "LinkedField",
        "name": "viewingRooms",
        "plural": false,
        "selections": [
          {
            "args": null,
            "kind": "FragmentSpread",
            "name": "Home_featured"
          }
        ],
        "storageKey": "viewingRooms(featured:true)"
      },
      {
        "alias": null,
        "args": (v3/*: any*/),
        "concreteType": "ArticleConnection",
        "kind": "LinkedField",
        "name": "articlesConnection",
        "plural": false,
        "selections": [
          {
            "args": null,
            "kind": "FragmentSpread",
            "name": "Home_articlesConnection"
          }
        ],
        "storageKey": "articlesConnection(first:10,inEditorialFeed:true,sort:\"PUBLISHED_AT_DESC\")"
      }
    ],
    "type": "Query",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "HomeRefetchQuery",
    "selections": [
      {
        "alias": null,
        "args": null,
        "concreteType": "HomePage",
        "kind": "LinkedField",
        "name": "homePage",
        "plural": false,
        "selections": [
          {
            "alias": null,
            "args": [
              {
                "kind": "Literal",
                "name": "include",
                "value": (v4/*: any*/)
              },
              (v5/*: any*/),
              (v6/*: any*/),
              {
                "kind": "Literal",
                "name": "order",
                "value": (v4/*: any*/)
              }
            ],
            "concreteType": "HomePageArtworkModule",
            "kind": "LinkedField",
            "name": "artworkModules",
            "plural": true,
            "selections": (v31/*: any*/),
            "storageKey": "artworkModules(include:[\"ACTIVE_BIDS\",\"FOLLOWED_ARTISTS\",\"RECENTLY_VIEWED_WORKS\"],maxFollowedGeneRails:-1,maxRails:-1,order:[\"ACTIVE_BIDS\",\"FOLLOWED_ARTISTS\",\"RECENTLY_VIEWED_WORKS\"])"
          },
          {
            "alias": null,
            "args": null,
            "concreteType": "HomePageSalesModule",
            "kind": "LinkedField",
            "name": "salesModule",
            "plural": false,
            "selections": [
              {
                "alias": null,
                "args": null,
                "concreteType": "Sale",
                "kind": "LinkedField",
                "name": "results",
                "plural": true,
                "selections": [
                  (v7/*: any*/),
                  (v13/*: any*/),
                  (v14/*: any*/),
                  (v10/*: any*/),
                  (v22/*: any*/),
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "liveURLIfOpen",
                    "storageKey": null
                  },
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "liveStartAt",
                    "storageKey": null
                  },
                  (v17/*: any*/),
                  {
                    "alias": null,
                    "args": (v32/*: any*/),
                    "concreteType": "SaleArtworkConnection",
                    "kind": "LinkedField",
                    "name": "saleArtworksConnection",
                    "plural": false,
                    "selections": [
                      {
                        "alias": null,
                        "args": null,
                        "concreteType": "SaleArtworkEdge",
                        "kind": "LinkedField",
                        "name": "edges",
                        "plural": true,
                        "selections": [
                          {
                            "alias": null,
                            "args": null,
                            "concreteType": "SaleArtwork",
                            "kind": "LinkedField",
                            "name": "node",
                            "plural": false,
                            "selections": [
                              {
                                "alias": null,
                                "args": null,
                                "concreteType": "Artwork",
                                "kind": "LinkedField",
                                "name": "artwork",
                                "plural": false,
                                "selections": (v35/*: any*/),
                                "storageKey": null
                              },
                              (v7/*: any*/)
                            ],
                            "storageKey": null
                          }
                        ],
                        "storageKey": null
                      }
                    ],
                    "storageKey": "saleArtworksConnection(first:3)"
                  }
                ],
                "storageKey": null
              }
            ],
            "storageKey": null
          },
          (v36/*: any*/)
        ],
        "storageKey": null
      },
      {
        "alias": "homePageBelow",
        "args": null,
        "concreteType": "HomePage",
        "kind": "LinkedField",
        "name": "homePage",
        "plural": false,
        "selections": [
          {
            "alias": null,
            "args": [
              {
                "kind": "Literal",
                "name": "exclude",
                "value": [
                  "RECENTLY_VIEWED_WORKS",
                  "ACTIVE_BIDS",
                  "FOLLOWED_ARTISTS",
                  "SAVED_WORKS",
                  "GENERIC_GENES",
                  "LIVE_AUCTIONS",
                  "CURRENT_FAIRS",
                  "RELATED_ARTISTS",
                  "FOLLOWED_GENES"
                ]
              },
              (v5/*: any*/),
              (v6/*: any*/),
              {
                "kind": "Literal",
                "name": "order",
                "value": [
                  "RECOMMENDED_WORKS",
                  "FOLLOWED_GALLERIES"
                ]
              }
            ],
            "concreteType": "HomePageArtworkModule",
            "kind": "LinkedField",
            "name": "artworkModules",
            "plural": true,
            "selections": (v31/*: any*/),
            "storageKey": "artworkModules(exclude:[\"RECENTLY_VIEWED_WORKS\",\"ACTIVE_BIDS\",\"FOLLOWED_ARTISTS\",\"SAVED_WORKS\",\"GENERIC_GENES\",\"LIVE_AUCTIONS\",\"CURRENT_FAIRS\",\"RELATED_ARTISTS\",\"FOLLOWED_GENES\"],maxFollowedGeneRails:-1,maxRails:-1,order:[\"RECOMMENDED_WORKS\",\"FOLLOWED_GALLERIES\"])"
          },
          {
            "alias": null,
            "args": null,
            "concreteType": "HomePageArtistModule",
            "kind": "LinkedField",
            "name": "artistModules",
            "plural": true,
            "selections": [
              (v7/*: any*/),
              (v9/*: any*/),
              {
                "alias": null,
                "args": null,
                "concreteType": "Artist",
                "kind": "LinkedField",
                "name": "results",
                "plural": true,
                "selections": [
                  (v7/*: any*/),
                  (v13/*: any*/),
                  (v14/*: any*/),
                  (v10/*: any*/),
                  (v22/*: any*/),
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "formattedNationalityAndBirthday",
                    "storageKey": null
                  },
                  {
                    "alias": "avatar",
                    "args": null,
                    "concreteType": "Image",
                    "kind": "LinkedField",
                    "name": "image",
                    "plural": false,
                    "selections": [
                      {
                        "alias": null,
                        "args": (v37/*: any*/),
                        "kind": "ScalarField",
                        "name": "url",
                        "storageKey": "url(version:\"small\")"
                      }
                    ],
                    "storageKey": null
                  },
                  (v29/*: any*/),
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "isFollowed",
                    "storageKey": null
                  },
                  {
                    "alias": null,
                    "args": (v32/*: any*/),
                    "concreteType": "ArtworkConnection",
                    "kind": "LinkedField",
                    "name": "artworksConnection",
                    "plural": false,
                    "selections": [
                      {
                        "alias": null,
                        "args": null,
                        "concreteType": "ArtworkEdge",
                        "kind": "LinkedField",
                        "name": "edges",
                        "plural": true,
                        "selections": (v38/*: any*/),
                        "storageKey": null
                      }
                    ],
                    "storageKey": "artworksConnection(first:3)"
                  }
                ],
                "storageKey": null
              }
            ],
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "concreteType": "HomePageFairsModule",
            "kind": "LinkedField",
            "name": "fairsModule",
            "plural": false,
            "selections": [
              {
                "alias": null,
                "args": null,
                "concreteType": "Fair",
                "kind": "LinkedField",
                "name": "results",
                "plural": true,
                "selections": [
                  (v7/*: any*/),
                  (v14/*: any*/),
                  (v13/*: any*/),
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "Profile",
                    "kind": "LinkedField",
                    "name": "profile",
                    "plural": false,
                    "selections": [
                      (v13/*: any*/),
                      (v7/*: any*/)
                    ],
                    "storageKey": null
                  },
                  (v22/*: any*/),
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "exhibitionPeriod",
                    "storageKey": null
                  },
                  (v34/*: any*/),
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "Location",
                    "kind": "LinkedField",
                    "name": "location",
                    "plural": false,
                    "selections": [
                      {
                        "alias": null,
                        "args": null,
                        "kind": "ScalarField",
                        "name": "city",
                        "storageKey": null
                      },
                      {
                        "alias": null,
                        "args": null,
                        "kind": "ScalarField",
                        "name": "country",
                        "storageKey": null
                      },
                      (v7/*: any*/)
                    ],
                    "storageKey": null
                  },
                  {
                    "alias": "followedArtistArtworks",
                    "args": [
                      (v39/*: any*/),
                      {
                        "kind": "Literal",
                        "name": "input",
                        "value": {
                          "includeArtworksByFollowedArtists": true
                        }
                      }
                    ],
                    "concreteType": "FilterArtworksConnection",
                    "kind": "LinkedField",
                    "name": "filterArtworksConnection",
                    "plural": false,
                    "selections": (v41/*: any*/),
                    "storageKey": "filterArtworksConnection(first:2,input:{\"includeArtworksByFollowedArtists\":true})"
                  },
                  {
                    "alias": "otherArtworks",
                    "args": [
                      (v39/*: any*/)
                    ],
                    "concreteType": "FilterArtworksConnection",
                    "kind": "LinkedField",
                    "name": "filterArtworksConnection",
                    "plural": false,
                    "selections": (v41/*: any*/),
                    "storageKey": "filterArtworksConnection(first:2)"
                  }
                ],
                "storageKey": null
              }
            ],
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "concreteType": "HomePageMarketingCollectionsModule",
            "kind": "LinkedField",
            "name": "marketingCollectionsModule",
            "plural": false,
            "selections": [
              {
                "alias": null,
                "args": null,
                "concreteType": "MarketingCollection",
                "kind": "LinkedField",
                "name": "results",
                "plural": true,
                "selections": [
                  (v8/*: any*/),
                  (v13/*: any*/),
                  {
                    "alias": null,
                    "args": (v32/*: any*/),
                    "concreteType": "FilterArtworksConnection",
                    "kind": "LinkedField",
                    "name": "artworksConnection",
                    "plural": false,
                    "selections": [
                      {
                        "alias": null,
                        "args": null,
                        "concreteType": "FilterArtworksCounts",
                        "kind": "LinkedField",
                        "name": "counts",
                        "plural": false,
                        "selections": [
                          {
                            "alias": null,
                            "args": null,
                            "kind": "ScalarField",
                            "name": "total",
                            "storageKey": null
                          }
                        ],
                        "storageKey": null
                      },
                      (v40/*: any*/),
                      (v7/*: any*/)
                    ],
                    "storageKey": "artworksConnection(first:3)"
                  },
                  (v7/*: any*/)
                ],
                "storageKey": null
              }
            ],
            "storageKey": null
          },
          (v36/*: any*/)
        ],
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "concreteType": "Me",
        "kind": "LinkedField",
        "name": "me",
        "plural": false,
        "selections": [
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "canRequestEmailConfirmation",
            "storageKey": null
          },
          {
            "alias": null,
            "args": (v42/*: any*/),
            "concreteType": "SaleArtworksConnection",
            "kind": "LinkedField",
            "name": "lotsByFollowedArtistsConnection",
            "plural": false,
            "selections": [
              {
                "alias": null,
                "args": null,
                "concreteType": "PageInfo",
                "kind": "LinkedField",
                "name": "pageInfo",
                "plural": false,
                "selections": [
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "hasNextPage",
                    "storageKey": null
                  },
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "startCursor",
                    "storageKey": null
                  },
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "endCursor",
                    "storageKey": null
                  }
                ],
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "concreteType": "SaleArtwork",
                "kind": "LinkedField",
                "name": "edges",
                "plural": true,
                "selections": [
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "Artwork",
                    "kind": "LinkedField",
                    "name": "node",
                    "plural": false,
                    "selections": [
                      (v7/*: any*/),
                      (v10/*: any*/),
                      {
                        "alias": null,
                        "args": null,
                        "concreteType": "SaleArtwork",
                        "kind": "LinkedField",
                        "name": "saleArtwork",
                        "plural": false,
                        "selections": [
                          {
                            "alias": null,
                            "args": null,
                            "concreteType": "Artwork",
                            "kind": "LinkedField",
                            "name": "artwork",
                            "plural": false,
                            "selections": [
                              (v12/*: any*/),
                              (v27/*: any*/),
                              (v10/*: any*/),
                              {
                                "alias": null,
                                "args": null,
                                "concreteType": "Image",
                                "kind": "LinkedField",
                                "name": "image",
                                "plural": false,
                                "selections": [
                                  {
                                    "alias": "imageURL",
                                    "args": (v37/*: any*/),
                                    "kind": "ScalarField",
                                    "name": "url",
                                    "storageKey": "url(version:\"small\")"
                                  },
                                  (v26/*: any*/)
                                ],
                                "storageKey": null
                              },
                              (v14/*: any*/),
                              (v13/*: any*/),
                              (v11/*: any*/),
                              (v8/*: any*/),
                              (v7/*: any*/)
                            ],
                            "storageKey": null
                          },
                          (v18/*: any*/),
                          (v20/*: any*/),
                          (v21/*: any*/),
                          {
                            "alias": null,
                            "args": null,
                            "concreteType": "Sale",
                            "kind": "LinkedField",
                            "name": "sale",
                            "plural": false,
                            "selections": [
                              (v15/*: any*/),
                              (v16/*: any*/),
                              (v17/*: any*/),
                              (v7/*: any*/)
                            ],
                            "storageKey": null
                          },
                          (v7/*: any*/)
                        ],
                        "storageKey": null
                      },
                      (v28/*: any*/)
                    ],
                    "storageKey": null
                  },
                  (v43/*: any*/),
                  (v7/*: any*/)
                ],
                "storageKey": null
              }
            ],
            "storageKey": "lotsByFollowedArtistsConnection(first:6,includeArtworksByFollowedArtists:true,isAuction:true,liveSale:true)"
          },
          {
            "alias": null,
            "args": (v42/*: any*/),
            "filters": [
              "includeArtworksByFollowedArtists",
              "isAuction",
              "liveSale"
            ],
            "handle": "connection",
            "key": "SaleArtworksHomeRail_lotsByFollowedArtistsConnection",
            "kind": "LinkedHandle",
            "name": "lotsByFollowedArtistsConnection"
          },
          (v44/*: any*/),
          (v7/*: any*/)
        ],
        "storageKey": null
      },
      {
        "alias": "meBelow",
        "args": null,
        "concreteType": "Me",
        "kind": "LinkedField",
        "name": "me",
        "plural": false,
        "selections": [
          (v44/*: any*/),
          (v7/*: any*/)
        ],
        "storageKey": null
      },
      {
        "alias": "featured",
        "args": (v2/*: any*/),
        "concreteType": "ViewingRoomConnection",
        "kind": "LinkedField",
        "name": "viewingRooms",
        "plural": false,
        "selections": [
          {
            "alias": null,
            "args": null,
            "concreteType": "ViewingRoomEdge",
            "kind": "LinkedField",
            "name": "edges",
            "plural": true,
            "selections": [
              {
                "alias": null,
                "args": null,
                "concreteType": "ViewingRoom",
                "kind": "LinkedField",
                "name": "node",
                "plural": false,
                "selections": [
                  (v14/*: any*/),
                  (v8/*: any*/),
                  (v13/*: any*/),
                  {
                    "alias": "heroImage",
                    "args": null,
                    "concreteType": "ARImage",
                    "kind": "LinkedField",
                    "name": "image",
                    "plural": false,
                    "selections": [
                      {
                        "alias": null,
                        "args": null,
                        "concreteType": "ImageURLs",
                        "kind": "LinkedField",
                        "name": "imageURLs",
                        "plural": false,
                        "selections": [
                          {
                            "alias": null,
                            "args": null,
                            "kind": "ScalarField",
                            "name": "normalized",
                            "storageKey": null
                          }
                        ],
                        "storageKey": null
                      }
                    ],
                    "storageKey": null
                  },
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "status",
                    "storageKey": null
                  },
                  {
                    "alias": null,
                    "args": (v45/*: any*/),
                    "kind": "ScalarField",
                    "name": "distanceToOpen",
                    "storageKey": "distanceToOpen(short:true)"
                  },
                  {
                    "alias": null,
                    "args": (v45/*: any*/),
                    "kind": "ScalarField",
                    "name": "distanceToClose",
                    "storageKey": "distanceToClose(short:true)"
                  },
                  (v24/*: any*/)
                ],
                "storageKey": null
              }
            ],
            "storageKey": null
          }
        ],
        "storageKey": "viewingRooms(featured:true)"
      },
      {
        "alias": null,
        "args": (v3/*: any*/),
        "concreteType": "ArticleConnection",
        "kind": "LinkedField",
        "name": "articlesConnection",
        "plural": false,
        "selections": [
          {
            "alias": null,
            "args": null,
            "concreteType": "ArticleEdge",
            "kind": "LinkedField",
            "name": "edges",
            "plural": true,
            "selections": [
              {
                "alias": null,
                "args": null,
                "concreteType": "Article",
                "kind": "LinkedField",
                "name": "node",
                "plural": false,
                "selections": [
                  (v14/*: any*/),
                  (v13/*: any*/),
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "Author",
                    "kind": "LinkedField",
                    "name": "author",
                    "plural": false,
                    "selections": (v23/*: any*/),
                    "storageKey": null
                  },
                  (v10/*: any*/),
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "Image",
                    "kind": "LinkedField",
                    "name": "thumbnailImage",
                    "plural": false,
                    "selections": (v33/*: any*/),
                    "storageKey": null
                  },
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "thumbnailTitle",
                    "storageKey": null
                  },
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "vertical",
                    "storageKey": null
                  },
                  (v7/*: any*/)
                ],
                "storageKey": null
              }
            ],
            "storageKey": null
          }
        ],
        "storageKey": "articlesConnection(first:10,inEditorialFeed:true,sort:\"PUBLISHED_AT_DESC\")"
      }
    ]
  },
  "params": {
    "id": "717924f2f8d316675bed943adbb8e722",
    "metadata": {},
    "name": "HomeRefetchQuery",
    "operationKind": "query",
    "text": null
  }
};
})();
(node as any).hash = '3005f20c6fb4b75449f1bcfeb72c556b';
export default node;
