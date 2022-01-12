/* tslint:disable */
/* eslint-disable */
// @ts-nocheck
/* @relayHash 6c442434b2fe03d1aeab56b09bbbc4ad */

import { ConcreteRequest } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type HomePageHeroUnitImageVersion = "NARROW" | "WIDE" | "%future added value";
export type HomeAboveTheFoldQueryVariables = {
    heroImageVersion?: HomePageHeroUnitImageVersion | null | undefined;
};
export type HomeAboveTheFoldQueryResponse = {
    readonly homePage: {
        readonly " $fragmentRefs": FragmentRefs<"Home_homePageAbove">;
    } | null;
    readonly me: {
        readonly " $fragmentRefs": FragmentRefs<"Home_meAbove" | "NewWorksForYouRail_me">;
    } | null;
    readonly articlesConnection: {
        readonly " $fragmentRefs": FragmentRefs<"Home_articlesConnection">;
    } | null;
};
export type HomeAboveTheFoldQuery = {
    readonly response: HomeAboveTheFoldQueryResponse;
    readonly variables: HomeAboveTheFoldQueryVariables;
};



/*
query HomeAboveTheFoldQuery(
  $heroImageVersion: HomePageHeroUnitImageVersion
) {
  homePage @optionalField {
    ...Home_homePageAbove_1IwJ0h
  }
  me @optionalField {
    ...Home_meAbove
    ...NewWorksForYouRail_me
    id
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
    image {
      url(version: "small")
    }
    basedOn {
      name
      id
    }
    isFollowed
  }
}

fragment ArtworkHomeRail_rail on HomePageArtworkModule {
  title
  key
  results {
    ...LargeArtworkRail_artworks
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

fragment ArtworkRailCard_artwork_Q5Onb on Artwork {
  slug
  internalID
  href
  artistNames
  date
  image {
    resized(width: 295) {
      src
      srcSet
      width
      height
    }
    aspectRatio
    height
  }
  sale {
    isAuction
    isClosed
    endAt
    id
  }
  saleMessage
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
  title
}

fragment EmailConfirmationBanner_me on Me {
  canRequestEmailConfirmation
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

fragment Home_homePageAbove_1IwJ0h on HomePage {
  followedArtistsArtworkModule: artworkModule(key: FOLLOWED_ARTISTS) {
    id
    ...ArtworkHomeRail_rail
  }
  activeBidsArtworkModule: artworkModule(key: ACTIVE_BIDS) {
    id
    ...ArtworkHomeRail_rail
  }
  salesModule {
    ...SalesRail_salesModule
  }
  recommendedArtistsArtistModule: artistModule(key: SUGGESTED) {
    id
    ...ArtistRail_rail
  }
  ...HomeHero_homePage_1IwJ0h
}

fragment Home_meAbove on Me {
  ...EmailConfirmationBanner_me
  ...LotsByFollowedArtistsRail_me
  ...NewWorksForYouRail_me
  ...RecommendedArtistsRail_me
}

fragment LargeArtworkRail_artworks on Artwork {
  ...ArtworkRailCard_artwork_Q5Onb
  href
  slug
}

fragment LotsByFollowedArtistsRail_me on Me {
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

fragment NewWorksForYouRail_me on Me {
  newWorksByInterestingArtists(first: 30) {
    edges {
      node {
        ...LargeArtworkRail_artworks
        id
      }
    }
  }
}

fragment RecommendedArtistsRail_me on Me {
  artistRecommendations(first: 6) {
    edges {
      node {
        name
        id
        slug
        internalID
        href
        formattedNationalityAndBirthday
        image {
          url(version: "small")
        }
        basedOn {
          name
          id
        }
        isFollowed
        __typename
      }
      cursor
    }
    pageInfo {
      endCursor
      hasNextPage
    }
  }
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
v2 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
},
v3 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "title",
  "storageKey": null
},
v4 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "key",
  "storageKey": null
},
v5 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "slug",
  "storageKey": null
},
v6 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "internalID",
  "storageKey": null
},
v7 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "href",
  "storageKey": null
},
v8 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "artistNames",
  "storageKey": null
},
v9 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "date",
  "storageKey": null
},
v10 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "height",
  "storageKey": null
},
v11 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "aspectRatio",
  "storageKey": null
},
v12 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "isAuction",
  "storageKey": null
},
v13 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "isClosed",
  "storageKey": null
},
v14 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "saleMessage",
  "storageKey": null
},
v15 = {
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
v16 = {
  "alias": null,
  "args": null,
  "concreteType": "SaleArtworkCurrentBid",
  "kind": "LinkedField",
  "name": "currentBid",
  "plural": false,
  "selections": [
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "display",
      "storageKey": null
    }
  ],
  "storageKey": null
},
v17 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "name",
  "storageKey": null
},
v18 = [
  (v17/*: any*/),
  (v2/*: any*/)
],
v19 = [
  (v5/*: any*/),
  (v6/*: any*/),
  (v7/*: any*/),
  (v8/*: any*/),
  (v9/*: any*/),
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
        "args": [
          {
            "kind": "Literal",
            "name": "width",
            "value": 295
          }
        ],
        "concreteType": "ResizedImageUrl",
        "kind": "LinkedField",
        "name": "resized",
        "plural": false,
        "selections": [
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "src",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "srcSet",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "width",
            "storageKey": null
          },
          (v10/*: any*/)
        ],
        "storageKey": "resized(width:295)"
      },
      (v11/*: any*/),
      (v10/*: any*/)
    ],
    "storageKey": null
  },
  {
    "alias": null,
    "args": null,
    "concreteType": "Sale",
    "kind": "LinkedField",
    "name": "sale",
    "plural": false,
    "selections": [
      (v12/*: any*/),
      (v13/*: any*/),
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "endAt",
        "storageKey": null
      },
      (v2/*: any*/)
    ],
    "storageKey": null
  },
  (v14/*: any*/),
  {
    "alias": null,
    "args": null,
    "concreteType": "SaleArtwork",
    "kind": "LinkedField",
    "name": "saleArtwork",
    "plural": false,
    "selections": [
      (v15/*: any*/),
      (v16/*: any*/),
      (v2/*: any*/)
    ],
    "storageKey": null
  },
  {
    "alias": null,
    "args": null,
    "concreteType": "Partner",
    "kind": "LinkedField",
    "name": "partner",
    "plural": false,
    "selections": (v18/*: any*/),
    "storageKey": null
  },
  (v3/*: any*/),
  (v2/*: any*/)
],
v20 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "__typename",
  "storageKey": null
},
v21 = {
  "alias": null,
  "args": null,
  "concreteType": "Artist",
  "kind": "LinkedField",
  "name": "basedOn",
  "plural": false,
  "selections": (v18/*: any*/),
  "storageKey": null
},
v22 = [
  (v7/*: any*/)
],
v23 = [
  (v2/*: any*/),
  (v3/*: any*/),
  (v4/*: any*/),
  {
    "alias": null,
    "args": null,
    "concreteType": "Artwork",
    "kind": "LinkedField",
    "name": "results",
    "plural": true,
    "selections": (v19/*: any*/),
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
      (v20/*: any*/),
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
              (v5/*: any*/),
              (v6/*: any*/),
              (v7/*: any*/),
              (v2/*: any*/)
            ],
            "storageKey": null
          },
          (v21/*: any*/)
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
              (v7/*: any*/),
              (v2/*: any*/)
            ],
            "storageKey": null
          }
        ],
        "type": "HomePageFollowedArtistArtworkModule",
        "abstractKey": null
      },
      {
        "kind": "InlineFragment",
        "selections": (v22/*: any*/),
        "type": "Fair",
        "abstractKey": null
      },
      {
        "kind": "InlineFragment",
        "selections": (v22/*: any*/),
        "type": "Gene",
        "abstractKey": null
      },
      {
        "kind": "InlineFragment",
        "selections": (v22/*: any*/),
        "type": "Sale",
        "abstractKey": null
      },
      {
        "kind": "InlineFragment",
        "selections": [
          (v2/*: any*/)
        ],
        "type": "Node",
        "abstractKey": "__isNode"
      }
    ],
    "storageKey": null
  }
],
v24 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "displayTimelyAt",
  "storageKey": null
},
v25 = [
  {
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
  }
],
v26 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "formattedNationalityAndBirthday",
  "storageKey": null
},
v27 = [
  {
    "kind": "Literal",
    "name": "version",
    "value": "small"
  }
],
v28 = {
  "alias": null,
  "args": null,
  "concreteType": "Image",
  "kind": "LinkedField",
  "name": "image",
  "plural": false,
  "selections": [
    {
      "alias": null,
      "args": (v27/*: any*/),
      "kind": "ScalarField",
      "name": "url",
      "storageKey": "url(version:\"small\")"
    }
  ],
  "storageKey": null
},
v29 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "isFollowed",
  "storageKey": null
},
v30 = {
  "kind": "Literal",
  "name": "first",
  "value": 6
},
v31 = [
  (v30/*: any*/),
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
v32 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "hasNextPage",
  "storageKey": null
},
v33 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "endCursor",
  "storageKey": null
},
v34 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "cursor",
  "storageKey": null
},
v35 = [
  (v30/*: any*/)
];
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "HomeAboveTheFoldQuery",
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
            "args": [
              {
                "kind": "Variable",
                "name": "heroImageVersion",
                "variableName": "heroImageVersion"
              }
            ],
            "kind": "FragmentSpread",
            "name": "Home_homePageAbove"
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
            "name": "NewWorksForYouRail_me"
          }
        ],
        "storageKey": null
      },
      {
        "alias": null,
        "args": (v1/*: any*/),
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
    "name": "HomeAboveTheFoldQuery",
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
            "alias": "followedArtistsArtworkModule",
            "args": [
              {
                "kind": "Literal",
                "name": "key",
                "value": "FOLLOWED_ARTISTS"
              }
            ],
            "concreteType": "HomePageArtworkModule",
            "kind": "LinkedField",
            "name": "artworkModule",
            "plural": false,
            "selections": (v23/*: any*/),
            "storageKey": "artworkModule(key:\"FOLLOWED_ARTISTS\")"
          },
          {
            "alias": "activeBidsArtworkModule",
            "args": [
              {
                "kind": "Literal",
                "name": "key",
                "value": "ACTIVE_BIDS"
              }
            ],
            "concreteType": "HomePageArtworkModule",
            "kind": "LinkedField",
            "name": "artworkModule",
            "plural": false,
            "selections": (v23/*: any*/),
            "storageKey": "artworkModule(key:\"ACTIVE_BIDS\")"
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
                  (v2/*: any*/),
                  (v5/*: any*/),
                  (v6/*: any*/),
                  (v7/*: any*/),
                  (v17/*: any*/),
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
                  (v24/*: any*/),
                  {
                    "alias": null,
                    "args": [
                      {
                        "kind": "Literal",
                        "name": "first",
                        "value": 3
                      }
                    ],
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
                                "selections": [
                                  {
                                    "alias": null,
                                    "args": null,
                                    "concreteType": "Image",
                                    "kind": "LinkedField",
                                    "name": "image",
                                    "plural": false,
                                    "selections": (v25/*: any*/),
                                    "storageKey": null
                                  },
                                  (v2/*: any*/)
                                ],
                                "storageKey": null
                              },
                              (v2/*: any*/)
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
          {
            "alias": "recommendedArtistsArtistModule",
            "args": [
              {
                "kind": "Literal",
                "name": "key",
                "value": "SUGGESTED"
              }
            ],
            "concreteType": "HomePageArtistModule",
            "kind": "LinkedField",
            "name": "artistModule",
            "plural": false,
            "selections": [
              (v2/*: any*/),
              (v4/*: any*/),
              {
                "alias": null,
                "args": null,
                "concreteType": "Artist",
                "kind": "LinkedField",
                "name": "results",
                "plural": true,
                "selections": [
                  (v2/*: any*/),
                  (v5/*: any*/),
                  (v6/*: any*/),
                  (v7/*: any*/),
                  (v17/*: any*/),
                  (v26/*: any*/),
                  (v28/*: any*/),
                  (v21/*: any*/),
                  (v29/*: any*/)
                ],
                "storageKey": null
              }
            ],
            "storageKey": "artistModule(key:\"SUGGESTED\")"
          },
          {
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
              (v3/*: any*/),
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
              (v7/*: any*/),
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
              (v2/*: any*/)
            ],
            "storageKey": "heroUnits(platform:\"MOBILE\")"
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
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "canRequestEmailConfirmation",
            "storageKey": null
          },
          {
            "alias": null,
            "args": (v31/*: any*/),
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
                  (v32/*: any*/),
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "startCursor",
                    "storageKey": null
                  },
                  (v33/*: any*/)
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
                      (v2/*: any*/),
                      (v7/*: any*/),
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
                              (v8/*: any*/),
                              (v9/*: any*/),
                              (v7/*: any*/),
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
                                    "args": (v27/*: any*/),
                                    "kind": "ScalarField",
                                    "name": "url",
                                    "storageKey": "url(version:\"small\")"
                                  },
                                  (v11/*: any*/)
                                ],
                                "storageKey": null
                              },
                              (v6/*: any*/),
                              (v5/*: any*/),
                              (v14/*: any*/),
                              (v3/*: any*/),
                              (v2/*: any*/)
                            ],
                            "storageKey": null
                          },
                          (v15/*: any*/),
                          (v16/*: any*/),
                          {
                            "alias": null,
                            "args": null,
                            "kind": "ScalarField",
                            "name": "lotLabel",
                            "storageKey": null
                          },
                          {
                            "alias": null,
                            "args": null,
                            "concreteType": "Sale",
                            "kind": "LinkedField",
                            "name": "sale",
                            "plural": false,
                            "selections": [
                              (v12/*: any*/),
                              (v13/*: any*/),
                              (v24/*: any*/),
                              (v2/*: any*/)
                            ],
                            "storageKey": null
                          },
                          (v2/*: any*/)
                        ],
                        "storageKey": null
                      },
                      (v20/*: any*/)
                    ],
                    "storageKey": null
                  },
                  (v34/*: any*/),
                  (v2/*: any*/)
                ],
                "storageKey": null
              }
            ],
            "storageKey": "lotsByFollowedArtistsConnection(first:6,includeArtworksByFollowedArtists:true,isAuction:true,liveSale:true)"
          },
          {
            "alias": null,
            "args": (v31/*: any*/),
            "filters": [
              "includeArtworksByFollowedArtists",
              "isAuction",
              "liveSale"
            ],
            "handle": "connection",
            "key": "LotsByFollowedArtistsRail_lotsByFollowedArtistsConnection",
            "kind": "LinkedHandle",
            "name": "lotsByFollowedArtistsConnection"
          },
          {
            "alias": null,
            "args": [
              {
                "kind": "Literal",
                "name": "first",
                "value": 30
              }
            ],
            "concreteType": "ArtworkConnection",
            "kind": "LinkedField",
            "name": "newWorksByInterestingArtists",
            "plural": false,
            "selections": [
              {
                "alias": null,
                "args": null,
                "concreteType": "ArtworkEdge",
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
                    "selections": (v19/*: any*/),
                    "storageKey": null
                  }
                ],
                "storageKey": null
              }
            ],
            "storageKey": "newWorksByInterestingArtists(first:30)"
          },
          {
            "alias": null,
            "args": (v35/*: any*/),
            "concreteType": "ArtistConnection",
            "kind": "LinkedField",
            "name": "artistRecommendations",
            "plural": false,
            "selections": [
              {
                "alias": null,
                "args": null,
                "concreteType": "ArtistEdge",
                "kind": "LinkedField",
                "name": "edges",
                "plural": true,
                "selections": [
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "Artist",
                    "kind": "LinkedField",
                    "name": "node",
                    "plural": false,
                    "selections": [
                      (v17/*: any*/),
                      (v2/*: any*/),
                      (v5/*: any*/),
                      (v6/*: any*/),
                      (v7/*: any*/),
                      (v26/*: any*/),
                      (v28/*: any*/),
                      (v21/*: any*/),
                      (v29/*: any*/),
                      (v20/*: any*/)
                    ],
                    "storageKey": null
                  },
                  (v34/*: any*/)
                ],
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "concreteType": "PageInfo",
                "kind": "LinkedField",
                "name": "pageInfo",
                "plural": false,
                "selections": [
                  (v33/*: any*/),
                  (v32/*: any*/)
                ],
                "storageKey": null
              }
            ],
            "storageKey": "artistRecommendations(first:6)"
          },
          {
            "alias": null,
            "args": (v35/*: any*/),
            "filters": null,
            "handle": "connection",
            "key": "RecommendedArtistsRail_artistRecommendations",
            "kind": "LinkedHandle",
            "name": "artistRecommendations"
          },
          (v2/*: any*/)
        ],
        "storageKey": null
      },
      {
        "alias": null,
        "args": (v1/*: any*/),
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
                  (v6/*: any*/),
                  (v5/*: any*/),
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "Author",
                    "kind": "LinkedField",
                    "name": "author",
                    "plural": false,
                    "selections": (v18/*: any*/),
                    "storageKey": null
                  },
                  (v7/*: any*/),
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "Image",
                    "kind": "LinkedField",
                    "name": "thumbnailImage",
                    "plural": false,
                    "selections": (v25/*: any*/),
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
                  (v2/*: any*/)
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
    "id": "6c442434b2fe03d1aeab56b09bbbc4ad",
    "metadata": {},
    "name": "HomeAboveTheFoldQuery",
    "operationKind": "query",
    "text": null
  }
};
})();
(node as any).hash = '7769f818211c9939dfc0ce7c40d7c4de';
export default node;
