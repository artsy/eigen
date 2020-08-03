/* tslint:disable */
/* eslint-disable */
/* @relayHash c0fba7d35b00d5daa933d7e28512621d */

import { ConcreteRequest } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type HomePageHeroUnitImageVersion = "NARROW" | "WIDE" | "%future added value";
export type HomeRefetchQueryVariables = {
    heroImageVersion: HomePageHeroUnitImageVersion;
};
export type HomeRefetchQueryResponse = {
    readonly homePage: {
        readonly " $fragmentRefs": FragmentRefs<"Home_homePage">;
    } | null;
    readonly me: {
        readonly " $fragmentRefs": FragmentRefs<"Home_me">;
    } | null;
    readonly featured: {
        readonly " $fragmentRefs": FragmentRefs<"Home_featured">;
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
  homePage {
    ...Home_homePage_1IwJ0h
  }
  me {
    ...Home_me
    id
  }
  featured: viewingRooms(featured: true) {
    ...Home_featured
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
  artistNames
  href
  sale {
    isAuction
    isClosed
    displayTimelyAt
    id
  }
  saleArtwork {
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
      id
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
    followedArtistArtworks: filterArtworksConnection(first: 2, includeArtworksByFollowedArtists: true) {
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

fragment Home_featured on ViewingRoomConnection {
  ...ViewingRoomsListFeatured_featured
}

fragment Home_homePage_1IwJ0h on HomePage {
  artworkModules(maxRails: -1, maxFollowedGeneRails: -1, order: [ACTIVE_BIDS, FOLLOWED_ARTISTS, RECENTLY_VIEWED_WORKS, SAVED_WORKS, RECOMMENDED_WORKS, FOLLOWED_GALLERIES], exclude: [GENERIC_GENES, LIVE_AUCTIONS, CURRENT_FAIRS, RELATED_ARTISTS, FOLLOWED_GENES]) {
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
  salesModule {
    ...SalesRail_salesModule
  }
  marketingCollectionsModule {
    ...CollectionsRail_collectionsModule
  }
  ...HomeHero_homePage_1IwJ0h
}

fragment Home_me on Me {
  ...EmailConfirmationBanner_me
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
    id
  }
  saleArtwork {
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
    "kind": "LocalArgument",
    "name": "heroImageVersion",
    "type": "HomePageHeroUnitImageVersion!",
    "defaultValue": null
  }
],
v1 = [
  {
    "kind": "Literal",
    "name": "featured",
    "value": true
  }
],
v2 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "id",
  "args": null,
  "storageKey": null
},
v3 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "title",
  "args": null,
  "storageKey": null
},
v4 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "key",
  "args": null,
  "storageKey": null
},
v5 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "href",
  "args": null,
  "storageKey": null
},
v6 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "slug",
  "args": null,
  "storageKey": null
},
v7 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "internalID",
  "args": null,
  "storageKey": null
},
v8 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "displayTimelyAt",
  "args": null,
  "storageKey": null
},
v9 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "name",
  "args": null,
  "storageKey": null
},
v10 = [
  (v9/*: any*/),
  (v2/*: any*/)
],
v11 = {
  "kind": "LinkedField",
  "alias": null,
  "name": "partner",
  "storageKey": null,
  "args": null,
  "concreteType": "Partner",
  "plural": false,
  "selections": (v10/*: any*/)
},
v12 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "url",
  "args": [
    {
      "kind": "Literal",
      "name": "version",
      "value": "large"
    }
  ],
  "storageKey": "url(version:\"large\")"
},
v13 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "__typename",
  "args": null,
  "storageKey": null
},
v14 = {
  "kind": "LinkedField",
  "alias": null,
  "name": "basedOn",
  "storageKey": null,
  "args": null,
  "concreteType": "Artist",
  "plural": false,
  "selections": (v10/*: any*/)
},
v15 = [
  (v5/*: any*/)
],
v16 = [
  {
    "kind": "Literal",
    "name": "first",
    "value": 3
  }
],
v17 = {
  "kind": "LinkedField",
  "alias": null,
  "name": "image",
  "storageKey": null,
  "args": null,
  "concreteType": "Image",
  "plural": false,
  "selections": [
    (v12/*: any*/)
  ]
},
v18 = [
  (v17/*: any*/),
  (v2/*: any*/)
],
v19 = [
  {
    "kind": "LinkedField",
    "alias": null,
    "name": "node",
    "storageKey": null,
    "args": null,
    "concreteType": "Artwork",
    "plural": false,
    "selections": (v18/*: any*/)
  }
],
v20 = {
  "kind": "Literal",
  "name": "first",
  "value": 2
},
v21 = {
  "kind": "LinkedField",
  "alias": null,
  "name": "edges",
  "storageKey": null,
  "args": null,
  "concreteType": "FilterArtworksEdge",
  "plural": true,
  "selections": (v19/*: any*/)
},
v22 = [
  (v21/*: any*/),
  (v2/*: any*/)
],
v23 = [
  {
    "kind": "Literal",
    "name": "short",
    "value": true
  }
];
return {
  "kind": "Request",
  "fragment": {
    "kind": "Fragment",
    "name": "HomeRefetchQuery",
    "type": "Query",
    "metadata": null,
    "argumentDefinitions": (v0/*: any*/),
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "homePage",
        "storageKey": null,
        "args": null,
        "concreteType": "HomePage",
        "plural": false,
        "selections": [
          {
            "kind": "FragmentSpread",
            "name": "Home_homePage",
            "args": [
              {
                "kind": "Variable",
                "name": "heroImageVersion",
                "variableName": "heroImageVersion"
              }
            ]
          }
        ]
      },
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "me",
        "storageKey": null,
        "args": null,
        "concreteType": "Me",
        "plural": false,
        "selections": [
          {
            "kind": "FragmentSpread",
            "name": "Home_me",
            "args": null
          }
        ]
      },
      {
        "kind": "LinkedField",
        "alias": "featured",
        "name": "viewingRooms",
        "storageKey": "viewingRooms(featured:true)",
        "args": (v1/*: any*/),
        "concreteType": "ViewingRoomConnection",
        "plural": false,
        "selections": [
          {
            "kind": "FragmentSpread",
            "name": "Home_featured",
            "args": null
          }
        ]
      }
    ]
  },
  "operation": {
    "kind": "Operation",
    "name": "HomeRefetchQuery",
    "argumentDefinitions": (v0/*: any*/),
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "homePage",
        "storageKey": null,
        "args": null,
        "concreteType": "HomePage",
        "plural": false,
        "selections": [
          {
            "kind": "LinkedField",
            "alias": null,
            "name": "artworkModules",
            "storageKey": "artworkModules(exclude:[\"GENERIC_GENES\",\"LIVE_AUCTIONS\",\"CURRENT_FAIRS\",\"RELATED_ARTISTS\",\"FOLLOWED_GENES\"],maxFollowedGeneRails:-1,maxRails:-1,order:[\"ACTIVE_BIDS\",\"FOLLOWED_ARTISTS\",\"RECENTLY_VIEWED_WORKS\",\"SAVED_WORKS\",\"RECOMMENDED_WORKS\",\"FOLLOWED_GALLERIES\"])",
            "args": [
              {
                "kind": "Literal",
                "name": "exclude",
                "value": [
                  "GENERIC_GENES",
                  "LIVE_AUCTIONS",
                  "CURRENT_FAIRS",
                  "RELATED_ARTISTS",
                  "FOLLOWED_GENES"
                ]
              },
              {
                "kind": "Literal",
                "name": "maxFollowedGeneRails",
                "value": -1
              },
              {
                "kind": "Literal",
                "name": "maxRails",
                "value": -1
              },
              {
                "kind": "Literal",
                "name": "order",
                "value": [
                  "ACTIVE_BIDS",
                  "FOLLOWED_ARTISTS",
                  "RECENTLY_VIEWED_WORKS",
                  "SAVED_WORKS",
                  "RECOMMENDED_WORKS",
                  "FOLLOWED_GALLERIES"
                ]
              }
            ],
            "concreteType": "HomePageArtworkModule",
            "plural": true,
            "selections": [
              (v2/*: any*/),
              (v3/*: any*/),
              (v4/*: any*/),
              {
                "kind": "LinkedField",
                "alias": null,
                "name": "results",
                "storageKey": null,
                "args": null,
                "concreteType": "Artwork",
                "plural": true,
                "selections": [
                  (v5/*: any*/),
                  {
                    "kind": "ScalarField",
                    "alias": null,
                    "name": "saleMessage",
                    "args": null,
                    "storageKey": null
                  },
                  {
                    "kind": "ScalarField",
                    "alias": null,
                    "name": "artistNames",
                    "args": null,
                    "storageKey": null
                  },
                  (v6/*: any*/),
                  (v7/*: any*/),
                  {
                    "kind": "LinkedField",
                    "alias": null,
                    "name": "sale",
                    "storageKey": null,
                    "args": null,
                    "concreteType": "Sale",
                    "plural": false,
                    "selections": [
                      {
                        "kind": "ScalarField",
                        "alias": null,
                        "name": "isAuction",
                        "args": null,
                        "storageKey": null
                      },
                      {
                        "kind": "ScalarField",
                        "alias": null,
                        "name": "isClosed",
                        "args": null,
                        "storageKey": null
                      },
                      (v8/*: any*/),
                      (v2/*: any*/)
                    ]
                  },
                  {
                    "kind": "LinkedField",
                    "alias": null,
                    "name": "saleArtwork",
                    "storageKey": null,
                    "args": null,
                    "concreteType": "SaleArtwork",
                    "plural": false,
                    "selections": [
                      {
                        "kind": "LinkedField",
                        "alias": null,
                        "name": "currentBid",
                        "storageKey": null,
                        "args": null,
                        "concreteType": "SaleArtworkCurrentBid",
                        "plural": false,
                        "selections": [
                          {
                            "kind": "ScalarField",
                            "alias": null,
                            "name": "display",
                            "args": null,
                            "storageKey": null
                          }
                        ]
                      },
                      (v2/*: any*/)
                    ]
                  },
                  (v11/*: any*/),
                  {
                    "kind": "LinkedField",
                    "alias": null,
                    "name": "image",
                    "storageKey": null,
                    "args": null,
                    "concreteType": "Image",
                    "plural": false,
                    "selections": [
                      {
                        "kind": "ScalarField",
                        "alias": null,
                        "name": "imageURL",
                        "args": null,
                        "storageKey": null
                      },
                      {
                        "kind": "ScalarField",
                        "alias": "aspect_ratio",
                        "name": "aspectRatio",
                        "args": null,
                        "storageKey": null
                      },
                      (v12/*: any*/),
                      {
                        "kind": "ScalarField",
                        "alias": null,
                        "name": "aspectRatio",
                        "args": null,
                        "storageKey": null
                      }
                    ]
                  },
                  (v2/*: any*/),
                  (v3/*: any*/),
                  {
                    "kind": "ScalarField",
                    "alias": null,
                    "name": "date",
                    "args": null,
                    "storageKey": null
                  }
                ]
              },
              {
                "kind": "LinkedField",
                "alias": null,
                "name": "context",
                "storageKey": null,
                "args": null,
                "concreteType": null,
                "plural": false,
                "selections": [
                  (v13/*: any*/),
                  (v2/*: any*/),
                  {
                    "kind": "InlineFragment",
                    "type": "HomePageRelatedArtistArtworkModule",
                    "selections": [
                      (v13/*: any*/),
                      {
                        "kind": "LinkedField",
                        "alias": null,
                        "name": "artist",
                        "storageKey": null,
                        "args": null,
                        "concreteType": "Artist",
                        "plural": false,
                        "selections": [
                          (v6/*: any*/),
                          (v7/*: any*/),
                          (v5/*: any*/),
                          (v2/*: any*/)
                        ]
                      },
                      (v14/*: any*/)
                    ]
                  },
                  {
                    "kind": "InlineFragment",
                    "type": "HomePageFollowedArtistArtworkModule",
                    "selections": [
                      {
                        "kind": "LinkedField",
                        "alias": null,
                        "name": "artist",
                        "storageKey": null,
                        "args": null,
                        "concreteType": "Artist",
                        "plural": false,
                        "selections": [
                          (v5/*: any*/),
                          (v2/*: any*/)
                        ]
                      }
                    ]
                  },
                  {
                    "kind": "InlineFragment",
                    "type": "Fair",
                    "selections": (v15/*: any*/)
                  },
                  {
                    "kind": "InlineFragment",
                    "type": "Gene",
                    "selections": (v15/*: any*/)
                  },
                  {
                    "kind": "InlineFragment",
                    "type": "Sale",
                    "selections": (v15/*: any*/)
                  }
                ]
              }
            ]
          },
          {
            "kind": "LinkedField",
            "alias": null,
            "name": "artistModules",
            "storageKey": null,
            "args": null,
            "concreteType": "HomePageArtistModule",
            "plural": true,
            "selections": [
              (v2/*: any*/),
              (v4/*: any*/),
              {
                "kind": "LinkedField",
                "alias": null,
                "name": "results",
                "storageKey": null,
                "args": null,
                "concreteType": "Artist",
                "plural": true,
                "selections": [
                  (v2/*: any*/),
                  (v6/*: any*/),
                  (v7/*: any*/),
                  (v5/*: any*/),
                  (v9/*: any*/),
                  {
                    "kind": "ScalarField",
                    "alias": null,
                    "name": "formattedNationalityAndBirthday",
                    "args": null,
                    "storageKey": null
                  },
                  {
                    "kind": "LinkedField",
                    "alias": "avatar",
                    "name": "image",
                    "storageKey": null,
                    "args": null,
                    "concreteType": "Image",
                    "plural": false,
                    "selections": [
                      {
                        "kind": "ScalarField",
                        "alias": null,
                        "name": "url",
                        "args": [
                          {
                            "kind": "Literal",
                            "name": "version",
                            "value": "small"
                          }
                        ],
                        "storageKey": "url(version:\"small\")"
                      }
                    ]
                  },
                  (v14/*: any*/),
                  {
                    "kind": "ScalarField",
                    "alias": null,
                    "name": "isFollowed",
                    "args": null,
                    "storageKey": null
                  },
                  {
                    "kind": "LinkedField",
                    "alias": null,
                    "name": "artworksConnection",
                    "storageKey": "artworksConnection(first:3)",
                    "args": (v16/*: any*/),
                    "concreteType": "ArtworkConnection",
                    "plural": false,
                    "selections": [
                      {
                        "kind": "LinkedField",
                        "alias": null,
                        "name": "edges",
                        "storageKey": null,
                        "args": null,
                        "concreteType": "ArtworkEdge",
                        "plural": true,
                        "selections": (v19/*: any*/)
                      }
                    ]
                  }
                ]
              }
            ]
          },
          {
            "kind": "LinkedField",
            "alias": null,
            "name": "fairsModule",
            "storageKey": null,
            "args": null,
            "concreteType": "HomePageFairsModule",
            "plural": false,
            "selections": [
              {
                "kind": "LinkedField",
                "alias": null,
                "name": "results",
                "storageKey": null,
                "args": null,
                "concreteType": "Fair",
                "plural": true,
                "selections": [
                  (v2/*: any*/),
                  (v7/*: any*/),
                  (v6/*: any*/),
                  {
                    "kind": "LinkedField",
                    "alias": null,
                    "name": "profile",
                    "storageKey": null,
                    "args": null,
                    "concreteType": "Profile",
                    "plural": false,
                    "selections": [
                      (v6/*: any*/),
                      (v2/*: any*/)
                    ]
                  },
                  (v9/*: any*/),
                  {
                    "kind": "ScalarField",
                    "alias": null,
                    "name": "exhibitionPeriod",
                    "args": null,
                    "storageKey": null
                  },
                  (v17/*: any*/),
                  {
                    "kind": "LinkedField",
                    "alias": null,
                    "name": "location",
                    "storageKey": null,
                    "args": null,
                    "concreteType": "Location",
                    "plural": false,
                    "selections": [
                      {
                        "kind": "ScalarField",
                        "alias": null,
                        "name": "city",
                        "args": null,
                        "storageKey": null
                      },
                      {
                        "kind": "ScalarField",
                        "alias": null,
                        "name": "country",
                        "args": null,
                        "storageKey": null
                      },
                      (v2/*: any*/)
                    ]
                  },
                  {
                    "kind": "LinkedField",
                    "alias": "followedArtistArtworks",
                    "name": "filterArtworksConnection",
                    "storageKey": "filterArtworksConnection(first:2,includeArtworksByFollowedArtists:true)",
                    "args": [
                      (v20/*: any*/),
                      {
                        "kind": "Literal",
                        "name": "includeArtworksByFollowedArtists",
                        "value": true
                      }
                    ],
                    "concreteType": "FilterArtworksConnection",
                    "plural": false,
                    "selections": (v22/*: any*/)
                  },
                  {
                    "kind": "LinkedField",
                    "alias": "otherArtworks",
                    "name": "filterArtworksConnection",
                    "storageKey": "filterArtworksConnection(first:2)",
                    "args": [
                      (v20/*: any*/)
                    ],
                    "concreteType": "FilterArtworksConnection",
                    "plural": false,
                    "selections": (v22/*: any*/)
                  }
                ]
              }
            ]
          },
          {
            "kind": "LinkedField",
            "alias": null,
            "name": "salesModule",
            "storageKey": null,
            "args": null,
            "concreteType": "HomePageSalesModule",
            "plural": false,
            "selections": [
              {
                "kind": "LinkedField",
                "alias": null,
                "name": "results",
                "storageKey": null,
                "args": null,
                "concreteType": "Sale",
                "plural": true,
                "selections": [
                  (v2/*: any*/),
                  (v6/*: any*/),
                  (v7/*: any*/),
                  (v5/*: any*/),
                  (v9/*: any*/),
                  {
                    "kind": "ScalarField",
                    "alias": null,
                    "name": "liveURLIfOpen",
                    "args": null,
                    "storageKey": null
                  },
                  {
                    "kind": "ScalarField",
                    "alias": null,
                    "name": "liveStartAt",
                    "args": null,
                    "storageKey": null
                  },
                  (v8/*: any*/),
                  {
                    "kind": "LinkedField",
                    "alias": null,
                    "name": "saleArtworksConnection",
                    "storageKey": "saleArtworksConnection(first:3)",
                    "args": (v16/*: any*/),
                    "concreteType": "SaleArtworkConnection",
                    "plural": false,
                    "selections": [
                      {
                        "kind": "LinkedField",
                        "alias": null,
                        "name": "edges",
                        "storageKey": null,
                        "args": null,
                        "concreteType": "SaleArtworkEdge",
                        "plural": true,
                        "selections": [
                          {
                            "kind": "LinkedField",
                            "alias": null,
                            "name": "node",
                            "storageKey": null,
                            "args": null,
                            "concreteType": "SaleArtwork",
                            "plural": false,
                            "selections": [
                              {
                                "kind": "LinkedField",
                                "alias": null,
                                "name": "artwork",
                                "storageKey": null,
                                "args": null,
                                "concreteType": "Artwork",
                                "plural": false,
                                "selections": (v18/*: any*/)
                              },
                              (v2/*: any*/)
                            ]
                          }
                        ]
                      }
                    ]
                  }
                ]
              }
            ]
          },
          {
            "kind": "LinkedField",
            "alias": null,
            "name": "marketingCollectionsModule",
            "storageKey": null,
            "args": null,
            "concreteType": "HomePageMarketingCollectionsModule",
            "plural": false,
            "selections": [
              {
                "kind": "LinkedField",
                "alias": null,
                "name": "results",
                "storageKey": null,
                "args": null,
                "concreteType": "MarketingCollection",
                "plural": true,
                "selections": [
                  (v3/*: any*/),
                  (v6/*: any*/),
                  {
                    "kind": "LinkedField",
                    "alias": null,
                    "name": "artworksConnection",
                    "storageKey": "artworksConnection(first:3)",
                    "args": (v16/*: any*/),
                    "concreteType": "FilterArtworksConnection",
                    "plural": false,
                    "selections": [
                      {
                        "kind": "LinkedField",
                        "alias": null,
                        "name": "counts",
                        "storageKey": null,
                        "args": null,
                        "concreteType": "FilterArtworksCounts",
                        "plural": false,
                        "selections": [
                          {
                            "kind": "ScalarField",
                            "alias": null,
                            "name": "total",
                            "args": null,
                            "storageKey": null
                          }
                        ]
                      },
                      (v21/*: any*/),
                      (v2/*: any*/)
                    ]
                  },
                  (v2/*: any*/)
                ]
              }
            ]
          },
          {
            "kind": "LinkedField",
            "alias": null,
            "name": "heroUnits",
            "storageKey": "heroUnits(platform:\"MOBILE\")",
            "args": [
              {
                "kind": "Literal",
                "name": "platform",
                "value": "MOBILE"
              }
            ],
            "concreteType": "HomePageHeroUnit",
            "plural": true,
            "selections": [
              (v3/*: any*/),
              {
                "kind": "ScalarField",
                "alias": null,
                "name": "subtitle",
                "args": null,
                "storageKey": null
              },
              {
                "kind": "ScalarField",
                "alias": null,
                "name": "creditLine",
                "args": null,
                "storageKey": null
              },
              {
                "kind": "ScalarField",
                "alias": null,
                "name": "linkText",
                "args": null,
                "storageKey": null
              },
              (v5/*: any*/),
              {
                "kind": "ScalarField",
                "alias": null,
                "name": "backgroundImageURL",
                "args": [
                  {
                    "kind": "Variable",
                    "name": "version",
                    "variableName": "heroImageVersion"
                  }
                ],
                "storageKey": null
              },
              (v2/*: any*/)
            ]
          }
        ]
      },
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "me",
        "storageKey": null,
        "args": null,
        "concreteType": "Me",
        "plural": false,
        "selections": [
          {
            "kind": "ScalarField",
            "alias": null,
            "name": "canRequestEmailConfirmation",
            "args": null,
            "storageKey": null
          },
          (v2/*: any*/)
        ]
      },
      {
        "kind": "LinkedField",
        "alias": "featured",
        "name": "viewingRooms",
        "storageKey": "viewingRooms(featured:true)",
        "args": (v1/*: any*/),
        "concreteType": "ViewingRoomConnection",
        "plural": false,
        "selections": [
          {
            "kind": "LinkedField",
            "alias": null,
            "name": "edges",
            "storageKey": null,
            "args": null,
            "concreteType": "ViewingRoomEdge",
            "plural": true,
            "selections": [
              {
                "kind": "LinkedField",
                "alias": null,
                "name": "node",
                "storageKey": null,
                "args": null,
                "concreteType": "ViewingRoom",
                "plural": false,
                "selections": [
                  (v7/*: any*/),
                  (v3/*: any*/),
                  (v6/*: any*/),
                  {
                    "kind": "LinkedField",
                    "alias": "heroImage",
                    "name": "image",
                    "storageKey": null,
                    "args": null,
                    "concreteType": "ARImage",
                    "plural": false,
                    "selections": [
                      {
                        "kind": "LinkedField",
                        "alias": null,
                        "name": "imageURLs",
                        "storageKey": null,
                        "args": null,
                        "concreteType": "ImageURLs",
                        "plural": false,
                        "selections": [
                          {
                            "kind": "ScalarField",
                            "alias": null,
                            "name": "normalized",
                            "args": null,
                            "storageKey": null
                          }
                        ]
                      }
                    ]
                  },
                  {
                    "kind": "ScalarField",
                    "alias": null,
                    "name": "status",
                    "args": null,
                    "storageKey": null
                  },
                  {
                    "kind": "ScalarField",
                    "alias": null,
                    "name": "distanceToOpen",
                    "args": (v23/*: any*/),
                    "storageKey": "distanceToOpen(short:true)"
                  },
                  {
                    "kind": "ScalarField",
                    "alias": null,
                    "name": "distanceToClose",
                    "args": (v23/*: any*/),
                    "storageKey": "distanceToClose(short:true)"
                  },
                  (v11/*: any*/)
                ]
              }
            ]
          }
        ]
      }
    ]
  },
  "params": {
    "operationKind": "query",
    "name": "HomeRefetchQuery",
    "id": "9c4e06821bddb3777a68e3d61708fb21",
    "text": null,
    "metadata": {}
  }
};
})();
(node as any).hash = 'a39badc3f9196bd570985bfed6c01d32';
export default node;
