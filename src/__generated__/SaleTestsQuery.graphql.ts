/* tslint:disable */
/* eslint-disable */
// @ts-nocheck
/* @relayHash 12f6487f288288b2a06238a67d696e81 */

import { ConcreteRequest } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type SaleTestsQueryVariables = {
    saleID: string;
};
export type SaleTestsQueryResponse = {
    readonly sale: {
        readonly internalID: string;
        readonly slug: string;
        readonly liveStartAt: string | null;
        readonly endAt: string | null;
        readonly registrationEndsAt: string | null;
        readonly " $fragmentRefs": FragmentRefs<"SaleHeader_sale" | "RegisterToBidButton_sale">;
    } | null;
    readonly me: {
        readonly " $fragmentRefs": FragmentRefs<"SaleArtworksRail_me" | "SaleActiveBids_me" | "RegisterToBidButton_me">;
    } | null;
    readonly " $fragmentRefs": FragmentRefs<"SaleLotsList_saleArtworksConnection">;
};
export type SaleTestsQuery = {
    readonly response: SaleTestsQueryResponse;
    readonly variables: SaleTestsQueryVariables;
};



/*
query SaleTestsQuery(
  $saleID: String!
) {
  sale(id: $saleID) {
    internalID
    slug
    liveStartAt
    endAt
    registrationEndsAt
    ...SaleHeader_sale
    ...RegisterToBidButton_sale
    id
  }
  me {
    ...SaleArtworksRail_me
    ...SaleActiveBids_me_nfIph
    ...RegisterToBidButton_me_nfIph
    id
  }
  ...SaleLotsList_saleArtworksConnection_49HmpD
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

fragment InfiniteScrollArtworksGrid_connection on ArtworkConnectionInterface {
  __isArtworkConnectionInterface: __typename
  pageInfo {
    hasNextPage
    startCursor
    endCursor
  }
  edges {
    __typename
    node {
      slug
      id
      image {
        aspectRatio
      }
      ...ArtworkGridItem_artwork
    }
    ... on Node {
      __isNode: __typename
      id
    }
  }
}

fragment Lot_saleArtwork on SaleArtwork {
  lotLabel
  artwork {
    artistNames
    href
    image {
      url(version: "medium")
    }
    id
  }
}

fragment RegisterToBidButton_me_nfIph on Me {
  biddedLots: lotStandings(saleID: $saleID) {
    saleArtwork {
      id
    }
  }
}

fragment RegisterToBidButton_sale on Sale {
  slug
  startAt
  endAt
  requireIdentityVerification
  registrationStatus {
    qualifiedForBidding
    id
  }
}

fragment SaleActiveBidItem_lotStanding on LotStanding {
  activeBid {
    isWinning
    id
  }
  mostRecentBid {
    maxBid {
      display
    }
    id
  }
  saleArtwork {
    reserveStatus
    counts {
      bidderPositions
    }
    currentBid {
      display
    }
    ...Lot_saleArtwork
    id
  }
  sale {
    liveStartAt
    id
  }
}

fragment SaleActiveBids_me_nfIph on Me {
  lotStandings(saleID: $saleID) {
    ...SaleActiveBidItem_lotStanding
    saleArtwork {
      slug
      id
    }
  }
}

fragment SaleArtworkListItem_artwork on Artwork {
  artistNames
  date
  href
  image {
    small: url(version: "small")
    aspectRatio
    height
    width
  }
  saleMessage
  slug
  title
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
    lotLabel
    id
  }
}

fragment SaleArtworkList_connection on ArtworkConnectionInterface {
  __isArtworkConnectionInterface: __typename
  edges {
    __typename
    node {
      id
      ...SaleArtworkListItem_artwork
    }
    ... on Node {
      __isNode: __typename
      id
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

fragment SaleArtworksRail_me on Me {
  lotsByFollowedArtistsConnection(first: 10, includeArtworksByFollowedArtists: true) {
    edges {
      node {
        id
        href
        saleArtwork {
          ...SaleArtworkTileRailCard_saleArtwork
          id
        }
      }
      id
    }
  }
}

fragment SaleHeader_sale on Sale {
  name
  internalID
  liveStartAt
  endAt
  startAt
  timeZone
  coverImage {
    url
  }
}

fragment SaleLotsList_saleArtworksConnection_49HmpD on Query {
  saleArtworksConnection(saleID: "sale-slug", artistIDs: [], geneIDs: [], aggregations: [FOLLOWED_ARTISTS, ARTIST, MEDIUM, TOTAL], estimateRange: "", first: 10, includeArtworksByFollowedArtists: false, sort: "position") {
    aggregations {
      slice
      counts {
        count
        name
        value
      }
    }
    counts {
      followedArtists
      total
    }
    edges {
      node {
        id
        __typename
      }
      cursor
      id
    }
    ...SaleArtworkList_connection
    ...InfiniteScrollArtworksGrid_connection
    pageInfo {
      endCursor
      hasNextPage
    }
  }
}
*/

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "saleID"
  }
],
v1 = [
  {
    "kind": "Variable",
    "name": "id",
    "variableName": "saleID"
  }
],
v2 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "internalID",
  "storageKey": null
},
v3 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "slug",
  "storageKey": null
},
v4 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "liveStartAt",
  "storageKey": null
},
v5 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "endAt",
  "storageKey": null
},
v6 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "registrationEndsAt",
  "storageKey": null
},
v7 = [
  {
    "kind": "Variable",
    "name": "saleID",
    "variableName": "saleID"
  }
],
v8 = {
  "kind": "Literal",
  "name": "saleID",
  "value": "sale-slug"
},
v9 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "name",
  "storageKey": null
},
v10 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
},
v11 = {
  "kind": "Literal",
  "name": "first",
  "value": 10
},
v12 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "href",
  "storageKey": null
},
v13 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "artistNames",
  "storageKey": null
},
v14 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "date",
  "storageKey": null
},
v15 = [
  {
    "kind": "Literal",
    "name": "version",
    "value": "small"
  }
],
v16 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "aspectRatio",
  "storageKey": null
},
v17 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "saleMessage",
  "storageKey": null
},
v18 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "title",
  "storageKey": null
},
v19 = {
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
v20 = [
  {
    "alias": null,
    "args": null,
    "kind": "ScalarField",
    "name": "display",
    "storageKey": null
  }
],
v21 = {
  "alias": null,
  "args": null,
  "concreteType": "SaleArtworkCurrentBid",
  "kind": "LinkedField",
  "name": "currentBid",
  "plural": false,
  "selections": (v20/*: any*/),
  "storageKey": null
},
v22 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "lotLabel",
  "storageKey": null
},
v23 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "isAuction",
  "storageKey": null
},
v24 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "isClosed",
  "storageKey": null
},
v25 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "displayTimelyAt",
  "storageKey": null
},
v26 = [
  {
    "kind": "Literal",
    "name": "aggregations",
    "value": [
      "FOLLOWED_ARTISTS",
      "ARTIST",
      "MEDIUM",
      "TOTAL"
    ]
  },
  {
    "kind": "Literal",
    "name": "artistIDs",
    "value": ([]/*: any*/)
  },
  {
    "kind": "Literal",
    "name": "estimateRange",
    "value": ""
  },
  (v11/*: any*/),
  {
    "kind": "Literal",
    "name": "geneIDs",
    "value": ([]/*: any*/)
  },
  {
    "kind": "Literal",
    "name": "includeArtworksByFollowedArtists",
    "value": false
  },
  (v8/*: any*/),
  {
    "kind": "Literal",
    "name": "sort",
    "value": "position"
  }
],
v27 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "__typename",
  "storageKey": null
},
v28 = {
  "enumValues": null,
  "nullable": true,
  "plural": true,
  "type": "LotStanding"
},
v29 = {
  "enumValues": null,
  "nullable": true,
  "plural": false,
  "type": "SaleArtwork"
},
v30 = {
  "enumValues": null,
  "nullable": false,
  "plural": false,
  "type": "ID"
},
v31 = {
  "enumValues": null,
  "nullable": true,
  "plural": false,
  "type": "BidderPosition"
},
v32 = {
  "enumValues": null,
  "nullable": true,
  "plural": false,
  "type": "Boolean"
},
v33 = {
  "enumValues": null,
  "nullable": true,
  "plural": false,
  "type": "String"
},
v34 = {
  "enumValues": null,
  "nullable": true,
  "plural": false,
  "type": "Sale"
},
v35 = {
  "enumValues": null,
  "nullable": true,
  "plural": false,
  "type": "Artwork"
},
v36 = {
  "enumValues": null,
  "nullable": true,
  "plural": false,
  "type": "Image"
},
v37 = {
  "enumValues": null,
  "nullable": true,
  "plural": false,
  "type": "SaleArtworkCounts"
},
v38 = {
  "enumValues": null,
  "nullable": true,
  "plural": false,
  "type": "FormattedNumber"
},
v39 = {
  "enumValues": null,
  "nullable": true,
  "plural": false,
  "type": "SaleArtworkCurrentBid"
},
v40 = {
  "enumValues": null,
  "nullable": true,
  "plural": false,
  "type": "SaleArtworksConnection"
},
v41 = {
  "enumValues": null,
  "nullable": false,
  "plural": false,
  "type": "Float"
},
v42 = {
  "enumValues": null,
  "nullable": false,
  "plural": false,
  "type": "String"
},
v43 = {
  "enumValues": null,
  "nullable": true,
  "plural": false,
  "type": "Int"
};
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "SaleTestsQuery",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": "Sale",
        "kind": "LinkedField",
        "name": "sale",
        "plural": false,
        "selections": [
          (v2/*: any*/),
          (v3/*: any*/),
          (v4/*: any*/),
          (v5/*: any*/),
          (v6/*: any*/),
          {
            "args": null,
            "kind": "FragmentSpread",
            "name": "SaleHeader_sale"
          },
          {
            "args": null,
            "kind": "FragmentSpread",
            "name": "RegisterToBidButton_sale"
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
            "name": "SaleArtworksRail_me"
          },
          {
            "args": (v7/*: any*/),
            "kind": "FragmentSpread",
            "name": "SaleActiveBids_me"
          },
          {
            "args": (v7/*: any*/),
            "kind": "FragmentSpread",
            "name": "RegisterToBidButton_me"
          }
        ],
        "storageKey": null
      },
      {
        "args": [
          (v8/*: any*/)
        ],
        "kind": "FragmentSpread",
        "name": "SaleLotsList_saleArtworksConnection"
      }
    ],
    "type": "Query",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "SaleTestsQuery",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": "Sale",
        "kind": "LinkedField",
        "name": "sale",
        "plural": false,
        "selections": [
          (v2/*: any*/),
          (v3/*: any*/),
          (v4/*: any*/),
          (v5/*: any*/),
          (v6/*: any*/),
          (v9/*: any*/),
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "startAt",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "timeZone",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "concreteType": "Image",
            "kind": "LinkedField",
            "name": "coverImage",
            "plural": false,
            "selections": [
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "url",
                "storageKey": null
              }
            ],
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "requireIdentityVerification",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "concreteType": "Bidder",
            "kind": "LinkedField",
            "name": "registrationStatus",
            "plural": false,
            "selections": [
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "qualifiedForBidding",
                "storageKey": null
              },
              (v10/*: any*/)
            ],
            "storageKey": null
          },
          (v10/*: any*/)
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
            "args": [
              (v11/*: any*/),
              {
                "kind": "Literal",
                "name": "includeArtworksByFollowedArtists",
                "value": true
              }
            ],
            "concreteType": "SaleArtworksConnection",
            "kind": "LinkedField",
            "name": "lotsByFollowedArtistsConnection",
            "plural": false,
            "selections": [
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
                      (v10/*: any*/),
                      (v12/*: any*/),
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
                              (v13/*: any*/),
                              (v14/*: any*/),
                              (v12/*: any*/),
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
                                    "args": (v15/*: any*/),
                                    "kind": "ScalarField",
                                    "name": "url",
                                    "storageKey": "url(version:\"small\")"
                                  },
                                  (v16/*: any*/)
                                ],
                                "storageKey": null
                              },
                              (v2/*: any*/),
                              (v3/*: any*/),
                              (v17/*: any*/),
                              (v18/*: any*/),
                              (v10/*: any*/)
                            ],
                            "storageKey": null
                          },
                          (v19/*: any*/),
                          (v21/*: any*/),
                          (v22/*: any*/),
                          {
                            "alias": null,
                            "args": null,
                            "concreteType": "Sale",
                            "kind": "LinkedField",
                            "name": "sale",
                            "plural": false,
                            "selections": [
                              (v23/*: any*/),
                              (v24/*: any*/),
                              (v25/*: any*/),
                              (v10/*: any*/)
                            ],
                            "storageKey": null
                          },
                          (v10/*: any*/)
                        ],
                        "storageKey": null
                      }
                    ],
                    "storageKey": null
                  },
                  (v10/*: any*/)
                ],
                "storageKey": null
              }
            ],
            "storageKey": "lotsByFollowedArtistsConnection(first:10,includeArtworksByFollowedArtists:true)"
          },
          {
            "alias": null,
            "args": (v7/*: any*/),
            "concreteType": "LotStanding",
            "kind": "LinkedField",
            "name": "lotStandings",
            "plural": true,
            "selections": [
              {
                "alias": null,
                "args": null,
                "concreteType": "BidderPosition",
                "kind": "LinkedField",
                "name": "activeBid",
                "plural": false,
                "selections": [
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "isWinning",
                    "storageKey": null
                  },
                  (v10/*: any*/)
                ],
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "concreteType": "BidderPosition",
                "kind": "LinkedField",
                "name": "mostRecentBid",
                "plural": false,
                "selections": [
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "BidderPositionMaxBid",
                    "kind": "LinkedField",
                    "name": "maxBid",
                    "plural": false,
                    "selections": (v20/*: any*/),
                    "storageKey": null
                  },
                  (v10/*: any*/)
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
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "reserveStatus",
                    "storageKey": null
                  },
                  (v19/*: any*/),
                  (v21/*: any*/),
                  (v22/*: any*/),
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "Artwork",
                    "kind": "LinkedField",
                    "name": "artwork",
                    "plural": false,
                    "selections": [
                      (v13/*: any*/),
                      (v12/*: any*/),
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
                                "name": "version",
                                "value": "medium"
                              }
                            ],
                            "kind": "ScalarField",
                            "name": "url",
                            "storageKey": "url(version:\"medium\")"
                          }
                        ],
                        "storageKey": null
                      },
                      (v10/*: any*/)
                    ],
                    "storageKey": null
                  },
                  (v10/*: any*/),
                  (v3/*: any*/)
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
                  (v4/*: any*/),
                  (v10/*: any*/)
                ],
                "storageKey": null
              }
            ],
            "storageKey": null
          },
          {
            "alias": "biddedLots",
            "args": (v7/*: any*/),
            "concreteType": "LotStanding",
            "kind": "LinkedField",
            "name": "lotStandings",
            "plural": true,
            "selections": [
              {
                "alias": null,
                "args": null,
                "concreteType": "SaleArtwork",
                "kind": "LinkedField",
                "name": "saleArtwork",
                "plural": false,
                "selections": [
                  (v10/*: any*/)
                ],
                "storageKey": null
              }
            ],
            "storageKey": null
          },
          (v10/*: any*/)
        ],
        "storageKey": null
      },
      {
        "alias": null,
        "args": (v26/*: any*/),
        "concreteType": "SaleArtworksConnection",
        "kind": "LinkedField",
        "name": "saleArtworksConnection",
        "plural": false,
        "selections": [
          {
            "alias": null,
            "args": null,
            "concreteType": "SaleArtworksAggregationResults",
            "kind": "LinkedField",
            "name": "aggregations",
            "plural": true,
            "selections": [
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "slice",
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "concreteType": "AggregationCount",
                "kind": "LinkedField",
                "name": "counts",
                "plural": true,
                "selections": [
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "count",
                    "storageKey": null
                  },
                  (v9/*: any*/),
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "value",
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
            "concreteType": "FilterSaleArtworksCounts",
            "kind": "LinkedField",
            "name": "counts",
            "plural": false,
            "selections": [
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "followedArtists",
                "storageKey": null
              },
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
                  (v10/*: any*/),
                  (v27/*: any*/)
                ],
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "cursor",
                "storageKey": null
              },
              (v10/*: any*/)
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
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "endCursor",
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "hasNextPage",
                "storageKey": null
              }
            ],
            "storageKey": null
          },
          {
            "kind": "InlineFragment",
            "selections": [
              {
                "alias": null,
                "args": null,
                "concreteType": null,
                "kind": "LinkedField",
                "name": "edges",
                "plural": true,
                "selections": [
                  (v27/*: any*/),
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "Artwork",
                    "kind": "LinkedField",
                    "name": "node",
                    "plural": false,
                    "selections": [
                      (v13/*: any*/),
                      (v14/*: any*/),
                      (v12/*: any*/),
                      {
                        "alias": null,
                        "args": null,
                        "concreteType": "Image",
                        "kind": "LinkedField",
                        "name": "image",
                        "plural": false,
                        "selections": [
                          {
                            "alias": "small",
                            "args": (v15/*: any*/),
                            "kind": "ScalarField",
                            "name": "url",
                            "storageKey": "url(version:\"small\")"
                          },
                          (v16/*: any*/),
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
                        "storageKey": null
                      },
                      (v17/*: any*/),
                      (v3/*: any*/),
                      (v18/*: any*/),
                      (v2/*: any*/),
                      {
                        "alias": null,
                        "args": null,
                        "concreteType": "Sale",
                        "kind": "LinkedField",
                        "name": "sale",
                        "plural": false,
                        "selections": [
                          (v23/*: any*/),
                          (v24/*: any*/),
                          (v25/*: any*/),
                          (v5/*: any*/),
                          (v10/*: any*/)
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
                          (v19/*: any*/),
                          (v21/*: any*/),
                          (v22/*: any*/),
                          (v10/*: any*/)
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
                        "selections": [
                          (v9/*: any*/),
                          (v10/*: any*/)
                        ],
                        "storageKey": null
                      }
                    ],
                    "storageKey": null
                  },
                  {
                    "kind": "TypeDiscriminator",
                    "abstractKey": "__isNode"
                  }
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
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "startCursor",
                    "storageKey": null
                  }
                ],
                "storageKey": null
              }
            ],
            "type": "ArtworkConnectionInterface",
            "abstractKey": "__isArtworkConnectionInterface"
          }
        ],
        "storageKey": "saleArtworksConnection(aggregations:[\"FOLLOWED_ARTISTS\",\"ARTIST\",\"MEDIUM\",\"TOTAL\"],artistIDs:[],estimateRange:\"\",first:10,geneIDs:[],includeArtworksByFollowedArtists:false,saleID:\"sale-slug\",sort:\"position\")"
      },
      {
        "alias": null,
        "args": (v26/*: any*/),
        "filters": [
          "saleID",
          "artistIDs",
          "geneIDs",
          "aggregations",
          "estimateRange",
          "includeArtworksByFollowedArtists",
          "sort"
        ],
        "handle": "connection",
        "key": "SaleLotsList_saleArtworksConnection",
        "kind": "LinkedHandle",
        "name": "saleArtworksConnection"
      }
    ]
  },
  "params": {
    "id": "12f6487f288288b2a06238a67d696e81",
    "metadata": {
      "relayTestingSelectionTypeInfo": {
        "me": {
          "enumValues": null,
          "nullable": true,
          "plural": false,
          "type": "Me"
        },
        "me.biddedLots": (v28/*: any*/),
        "me.biddedLots.saleArtwork": (v29/*: any*/),
        "me.biddedLots.saleArtwork.id": (v30/*: any*/),
        "me.id": (v30/*: any*/),
        "me.lotStandings": (v28/*: any*/),
        "me.lotStandings.activeBid": (v31/*: any*/),
        "me.lotStandings.activeBid.id": (v30/*: any*/),
        "me.lotStandings.activeBid.isWinning": (v32/*: any*/),
        "me.lotStandings.mostRecentBid": (v31/*: any*/),
        "me.lotStandings.mostRecentBid.id": (v30/*: any*/),
        "me.lotStandings.mostRecentBid.maxBid": {
          "enumValues": null,
          "nullable": true,
          "plural": false,
          "type": "BidderPositionMaxBid"
        },
        "me.lotStandings.mostRecentBid.maxBid.display": (v33/*: any*/),
        "me.lotStandings.sale": (v34/*: any*/),
        "me.lotStandings.sale.id": (v30/*: any*/),
        "me.lotStandings.sale.liveStartAt": (v33/*: any*/),
        "me.lotStandings.saleArtwork": (v29/*: any*/),
        "me.lotStandings.saleArtwork.artwork": (v35/*: any*/),
        "me.lotStandings.saleArtwork.artwork.artistNames": (v33/*: any*/),
        "me.lotStandings.saleArtwork.artwork.href": (v33/*: any*/),
        "me.lotStandings.saleArtwork.artwork.id": (v30/*: any*/),
        "me.lotStandings.saleArtwork.artwork.image": (v36/*: any*/),
        "me.lotStandings.saleArtwork.artwork.image.url": (v33/*: any*/),
        "me.lotStandings.saleArtwork.counts": (v37/*: any*/),
        "me.lotStandings.saleArtwork.counts.bidderPositions": (v38/*: any*/),
        "me.lotStandings.saleArtwork.currentBid": (v39/*: any*/),
        "me.lotStandings.saleArtwork.currentBid.display": (v33/*: any*/),
        "me.lotStandings.saleArtwork.id": (v30/*: any*/),
        "me.lotStandings.saleArtwork.lotLabel": (v33/*: any*/),
        "me.lotStandings.saleArtwork.reserveStatus": (v33/*: any*/),
        "me.lotStandings.saleArtwork.slug": (v30/*: any*/),
        "me.lotsByFollowedArtistsConnection": (v40/*: any*/),
        "me.lotsByFollowedArtistsConnection.edges": {
          "enumValues": null,
          "nullable": true,
          "plural": true,
          "type": "SaleArtwork"
        },
        "me.lotsByFollowedArtistsConnection.edges.id": (v30/*: any*/),
        "me.lotsByFollowedArtistsConnection.edges.node": (v35/*: any*/),
        "me.lotsByFollowedArtistsConnection.edges.node.href": (v33/*: any*/),
        "me.lotsByFollowedArtistsConnection.edges.node.id": (v30/*: any*/),
        "me.lotsByFollowedArtistsConnection.edges.node.saleArtwork": (v29/*: any*/),
        "me.lotsByFollowedArtistsConnection.edges.node.saleArtwork.artwork": (v35/*: any*/),
        "me.lotsByFollowedArtistsConnection.edges.node.saleArtwork.artwork.artistNames": (v33/*: any*/),
        "me.lotsByFollowedArtistsConnection.edges.node.saleArtwork.artwork.date": (v33/*: any*/),
        "me.lotsByFollowedArtistsConnection.edges.node.saleArtwork.artwork.href": (v33/*: any*/),
        "me.lotsByFollowedArtistsConnection.edges.node.saleArtwork.artwork.id": (v30/*: any*/),
        "me.lotsByFollowedArtistsConnection.edges.node.saleArtwork.artwork.image": (v36/*: any*/),
        "me.lotsByFollowedArtistsConnection.edges.node.saleArtwork.artwork.image.aspectRatio": (v41/*: any*/),
        "me.lotsByFollowedArtistsConnection.edges.node.saleArtwork.artwork.image.imageURL": (v33/*: any*/),
        "me.lotsByFollowedArtistsConnection.edges.node.saleArtwork.artwork.internalID": (v30/*: any*/),
        "me.lotsByFollowedArtistsConnection.edges.node.saleArtwork.artwork.saleMessage": (v33/*: any*/),
        "me.lotsByFollowedArtistsConnection.edges.node.saleArtwork.artwork.slug": (v30/*: any*/),
        "me.lotsByFollowedArtistsConnection.edges.node.saleArtwork.artwork.title": (v33/*: any*/),
        "me.lotsByFollowedArtistsConnection.edges.node.saleArtwork.counts": (v37/*: any*/),
        "me.lotsByFollowedArtistsConnection.edges.node.saleArtwork.counts.bidderPositions": (v38/*: any*/),
        "me.lotsByFollowedArtistsConnection.edges.node.saleArtwork.currentBid": (v39/*: any*/),
        "me.lotsByFollowedArtistsConnection.edges.node.saleArtwork.currentBid.display": (v33/*: any*/),
        "me.lotsByFollowedArtistsConnection.edges.node.saleArtwork.id": (v30/*: any*/),
        "me.lotsByFollowedArtistsConnection.edges.node.saleArtwork.lotLabel": (v33/*: any*/),
        "me.lotsByFollowedArtistsConnection.edges.node.saleArtwork.sale": (v34/*: any*/),
        "me.lotsByFollowedArtistsConnection.edges.node.saleArtwork.sale.displayTimelyAt": (v33/*: any*/),
        "me.lotsByFollowedArtistsConnection.edges.node.saleArtwork.sale.id": (v30/*: any*/),
        "me.lotsByFollowedArtistsConnection.edges.node.saleArtwork.sale.isAuction": (v32/*: any*/),
        "me.lotsByFollowedArtistsConnection.edges.node.saleArtwork.sale.isClosed": (v32/*: any*/),
        "sale": (v34/*: any*/),
        "sale.coverImage": (v36/*: any*/),
        "sale.coverImage.url": (v33/*: any*/),
        "sale.endAt": (v33/*: any*/),
        "sale.id": (v30/*: any*/),
        "sale.internalID": (v30/*: any*/),
        "sale.liveStartAt": (v33/*: any*/),
        "sale.name": (v33/*: any*/),
        "sale.registrationEndsAt": (v33/*: any*/),
        "sale.registrationStatus": {
          "enumValues": null,
          "nullable": true,
          "plural": false,
          "type": "Bidder"
        },
        "sale.registrationStatus.id": (v30/*: any*/),
        "sale.registrationStatus.qualifiedForBidding": (v32/*: any*/),
        "sale.requireIdentityVerification": (v32/*: any*/),
        "sale.slug": (v30/*: any*/),
        "sale.startAt": (v33/*: any*/),
        "sale.timeZone": (v33/*: any*/),
        "saleArtworksConnection": (v40/*: any*/),
        "saleArtworksConnection.__isArtworkConnectionInterface": (v42/*: any*/),
        "saleArtworksConnection.aggregations": {
          "enumValues": null,
          "nullable": true,
          "plural": true,
          "type": "SaleArtworksAggregationResults"
        },
        "saleArtworksConnection.aggregations.counts": {
          "enumValues": null,
          "nullable": true,
          "plural": true,
          "type": "AggregationCount"
        },
        "saleArtworksConnection.aggregations.counts.count": {
          "enumValues": null,
          "nullable": false,
          "plural": false,
          "type": "Int"
        },
        "saleArtworksConnection.aggregations.counts.name": (v42/*: any*/),
        "saleArtworksConnection.aggregations.counts.value": (v42/*: any*/),
        "saleArtworksConnection.aggregations.slice": {
          "enumValues": [
            "ARTIST",
            "FOLLOWED_ARTISTS",
            "MEDIUM",
            "TOTAL"
          ],
          "nullable": true,
          "plural": false,
          "type": "SaleArtworkAggregation"
        },
        "saleArtworksConnection.counts": {
          "enumValues": null,
          "nullable": true,
          "plural": false,
          "type": "FilterSaleArtworksCounts"
        },
        "saleArtworksConnection.counts.followedArtists": (v38/*: any*/),
        "saleArtworksConnection.counts.total": (v38/*: any*/),
        "saleArtworksConnection.edges": {
          "enumValues": null,
          "nullable": true,
          "plural": true,
          "type": "ArtworkEdgeInterface"
        },
        "saleArtworksConnection.edges.__isNode": (v42/*: any*/),
        "saleArtworksConnection.edges.__typename": (v42/*: any*/),
        "saleArtworksConnection.edges.cursor": (v33/*: any*/),
        "saleArtworksConnection.edges.id": (v30/*: any*/),
        "saleArtworksConnection.edges.node": (v35/*: any*/),
        "saleArtworksConnection.edges.node.__typename": (v42/*: any*/),
        "saleArtworksConnection.edges.node.artistNames": (v33/*: any*/),
        "saleArtworksConnection.edges.node.date": (v33/*: any*/),
        "saleArtworksConnection.edges.node.href": (v33/*: any*/),
        "saleArtworksConnection.edges.node.id": (v30/*: any*/),
        "saleArtworksConnection.edges.node.image": (v36/*: any*/),
        "saleArtworksConnection.edges.node.image.aspectRatio": (v41/*: any*/),
        "saleArtworksConnection.edges.node.image.height": (v43/*: any*/),
        "saleArtworksConnection.edges.node.image.small": (v33/*: any*/),
        "saleArtworksConnection.edges.node.image.url": (v33/*: any*/),
        "saleArtworksConnection.edges.node.image.width": (v43/*: any*/),
        "saleArtworksConnection.edges.node.internalID": (v30/*: any*/),
        "saleArtworksConnection.edges.node.partner": {
          "enumValues": null,
          "nullable": true,
          "plural": false,
          "type": "Partner"
        },
        "saleArtworksConnection.edges.node.partner.id": (v30/*: any*/),
        "saleArtworksConnection.edges.node.partner.name": (v33/*: any*/),
        "saleArtworksConnection.edges.node.sale": (v34/*: any*/),
        "saleArtworksConnection.edges.node.sale.displayTimelyAt": (v33/*: any*/),
        "saleArtworksConnection.edges.node.sale.endAt": (v33/*: any*/),
        "saleArtworksConnection.edges.node.sale.id": (v30/*: any*/),
        "saleArtworksConnection.edges.node.sale.isAuction": (v32/*: any*/),
        "saleArtworksConnection.edges.node.sale.isClosed": (v32/*: any*/),
        "saleArtworksConnection.edges.node.saleArtwork": (v29/*: any*/),
        "saleArtworksConnection.edges.node.saleArtwork.counts": (v37/*: any*/),
        "saleArtworksConnection.edges.node.saleArtwork.counts.bidderPositions": (v38/*: any*/),
        "saleArtworksConnection.edges.node.saleArtwork.currentBid": (v39/*: any*/),
        "saleArtworksConnection.edges.node.saleArtwork.currentBid.display": (v33/*: any*/),
        "saleArtworksConnection.edges.node.saleArtwork.id": (v30/*: any*/),
        "saleArtworksConnection.edges.node.saleArtwork.lotLabel": (v33/*: any*/),
        "saleArtworksConnection.edges.node.saleMessage": (v33/*: any*/),
        "saleArtworksConnection.edges.node.slug": (v30/*: any*/),
        "saleArtworksConnection.edges.node.title": (v33/*: any*/),
        "saleArtworksConnection.pageInfo": {
          "enumValues": null,
          "nullable": false,
          "plural": false,
          "type": "PageInfo"
        },
        "saleArtworksConnection.pageInfo.endCursor": (v33/*: any*/),
        "saleArtworksConnection.pageInfo.hasNextPage": {
          "enumValues": null,
          "nullable": false,
          "plural": false,
          "type": "Boolean"
        },
        "saleArtworksConnection.pageInfo.startCursor": (v33/*: any*/)
      }
    },
    "name": "SaleTestsQuery",
    "operationKind": "query",
    "text": null
  }
};
})();
(node as any).hash = 'da79dac5dbb8735ba4921ba4e128589b';
export default node;
