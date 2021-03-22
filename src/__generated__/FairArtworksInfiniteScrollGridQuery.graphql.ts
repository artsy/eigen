/* tslint:disable */
/* eslint-disable */
// @ts-nocheck
/* @relayHash a74cf139f15c74f36d9c8408bb5de356 */

import { ConcreteRequest } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type FairArtworksInfiniteScrollGridQueryVariables = {
    id: string;
    count: number;
    cursor?: string | null;
    sort?: string | null;
    additionalGeneIDs?: Array<string | null> | null;
    priceRange?: string | null;
    color?: string | null;
    colors?: Array<string | null> | null;
    partnerID?: string | null;
    dimensionRange?: string | null;
    majorPeriods?: Array<string | null> | null;
    acquireable?: boolean | null;
    inquireableOnly?: boolean | null;
    atAuction?: boolean | null;
    offerable?: boolean | null;
    includeArtworksByFollowedArtists?: boolean | null;
    artistIDs?: Array<string | null> | null;
    attributionClass?: Array<string | null> | null;
};
export type FairArtworksInfiniteScrollGridQueryResponse = {
    readonly fair: {
        readonly " $fragmentRefs": FragmentRefs<"FairArtworks_fair">;
    } | null;
};
export type FairArtworksInfiniteScrollGridQuery = {
    readonly response: FairArtworksInfiniteScrollGridQueryResponse;
    readonly variables: FairArtworksInfiniteScrollGridQueryVariables;
};



/*
query FairArtworksInfiniteScrollGridQuery(
  $id: String!
  $cursor: String
  $sort: String
  $additionalGeneIDs: [String]
  $priceRange: String
  $color: String
  $colors: [String]
  $partnerID: ID
  $dimensionRange: String
  $majorPeriods: [String]
  $acquireable: Boolean
  $inquireableOnly: Boolean
  $atAuction: Boolean
  $offerable: Boolean
  $includeArtworksByFollowedArtists: Boolean
  $artistIDs: [String]
  $attributionClass: [String]
) {
  fair(id: $id) {
    ...FairArtworks_fair_1UUP6H
    id
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

fragment FairArtworks_fair_1UUP6H on Fair {
  slug
  internalID
  fairArtworks: filterArtworksConnection(first: 30, after: $cursor, sort: $sort, additionalGeneIDs: $additionalGeneIDs, priceRange: $priceRange, color: $color, colors: $colors, partnerID: $partnerID, dimensionRange: $dimensionRange, majorPeriods: $majorPeriods, acquireable: $acquireable, inquireableOnly: $inquireableOnly, atAuction: $atAuction, offerable: $offerable, includeArtworksByFollowedArtists: $includeArtworksByFollowedArtists, artistIDs: $artistIDs, aggregations: [COLOR, DIMENSION_RANGE, GALLERY, INSTITUTION, MAJOR_PERIOD, MEDIUM, PRICE_RANGE, FOLLOWED_ARTISTS, ARTIST], attributionClass: $attributionClass) {
    aggregations {
      slice
      counts {
        count
        name
        value
      }
    }
    edges {
      node {
        id
        __typename
      }
      cursor
    }
    counts {
      total
      followedArtists
    }
    ...InfiniteScrollArtworksGrid_connection
    pageInfo {
      endCursor
      hasNextPage
    }
    id
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
*/

const node: ConcreteRequest = (function(){
var v0 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "acquireable"
},
v1 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "additionalGeneIDs"
},
v2 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "artistIDs"
},
v3 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "atAuction"
},
v4 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "attributionClass"
},
v5 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "color"
},
v6 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "colors"
},
v7 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "count"
},
v8 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "cursor"
},
v9 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "dimensionRange"
},
v10 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "id"
},
v11 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "includeArtworksByFollowedArtists"
},
v12 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "inquireableOnly"
},
v13 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "majorPeriods"
},
v14 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "offerable"
},
v15 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "partnerID"
},
v16 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "priceRange"
},
v17 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "sort"
},
v18 = [
  {
    "kind": "Variable",
    "name": "id",
    "variableName": "id"
  }
],
v19 = {
  "kind": "Variable",
  "name": "acquireable",
  "variableName": "acquireable"
},
v20 = {
  "kind": "Variable",
  "name": "additionalGeneIDs",
  "variableName": "additionalGeneIDs"
},
v21 = {
  "kind": "Variable",
  "name": "artistIDs",
  "variableName": "artistIDs"
},
v22 = {
  "kind": "Variable",
  "name": "atAuction",
  "variableName": "atAuction"
},
v23 = {
  "kind": "Variable",
  "name": "attributionClass",
  "variableName": "attributionClass"
},
v24 = {
  "kind": "Variable",
  "name": "color",
  "variableName": "color"
},
v25 = {
  "kind": "Variable",
  "name": "colors",
  "variableName": "colors"
},
v26 = {
  "kind": "Variable",
  "name": "dimensionRange",
  "variableName": "dimensionRange"
},
v27 = {
  "kind": "Variable",
  "name": "includeArtworksByFollowedArtists",
  "variableName": "includeArtworksByFollowedArtists"
},
v28 = {
  "kind": "Variable",
  "name": "inquireableOnly",
  "variableName": "inquireableOnly"
},
v29 = {
  "kind": "Variable",
  "name": "majorPeriods",
  "variableName": "majorPeriods"
},
v30 = {
  "kind": "Variable",
  "name": "offerable",
  "variableName": "offerable"
},
v31 = {
  "kind": "Variable",
  "name": "partnerID",
  "variableName": "partnerID"
},
v32 = {
  "kind": "Variable",
  "name": "priceRange",
  "variableName": "priceRange"
},
v33 = {
  "kind": "Variable",
  "name": "sort",
  "variableName": "sort"
},
v34 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "slug",
  "storageKey": null
},
v35 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "internalID",
  "storageKey": null
},
v36 = [
  (v19/*: any*/),
  (v20/*: any*/),
  {
    "kind": "Variable",
    "name": "after",
    "variableName": "cursor"
  },
  {
    "kind": "Literal",
    "name": "aggregations",
    "value": [
      "COLOR",
      "DIMENSION_RANGE",
      "GALLERY",
      "INSTITUTION",
      "MAJOR_PERIOD",
      "MEDIUM",
      "PRICE_RANGE",
      "FOLLOWED_ARTISTS",
      "ARTIST"
    ]
  },
  (v21/*: any*/),
  (v22/*: any*/),
  (v23/*: any*/),
  (v24/*: any*/),
  (v25/*: any*/),
  (v26/*: any*/),
  {
    "kind": "Literal",
    "name": "first",
    "value": 30
  },
  (v27/*: any*/),
  (v28/*: any*/),
  (v29/*: any*/),
  (v30/*: any*/),
  (v31/*: any*/),
  (v32/*: any*/),
  (v33/*: any*/)
],
v37 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "name",
  "storageKey": null
},
v38 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
},
v39 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "__typename",
  "storageKey": null
};
return {
  "fragment": {
    "argumentDefinitions": [
      (v0/*: any*/),
      (v1/*: any*/),
      (v2/*: any*/),
      (v3/*: any*/),
      (v4/*: any*/),
      (v5/*: any*/),
      (v6/*: any*/),
      (v7/*: any*/),
      (v8/*: any*/),
      (v9/*: any*/),
      (v10/*: any*/),
      (v11/*: any*/),
      (v12/*: any*/),
      (v13/*: any*/),
      (v14/*: any*/),
      (v15/*: any*/),
      (v16/*: any*/),
      (v17/*: any*/)
    ],
    "kind": "Fragment",
    "metadata": null,
    "name": "FairArtworksInfiniteScrollGridQuery",
    "selections": [
      {
        "alias": null,
        "args": (v18/*: any*/),
        "concreteType": "Fair",
        "kind": "LinkedField",
        "name": "fair",
        "plural": false,
        "selections": [
          {
            "args": [
              (v19/*: any*/),
              (v20/*: any*/),
              (v21/*: any*/),
              (v22/*: any*/),
              (v23/*: any*/),
              (v24/*: any*/),
              (v25/*: any*/),
              {
                "kind": "Variable",
                "name": "count",
                "variableName": "count"
              },
              {
                "kind": "Variable",
                "name": "cursor",
                "variableName": "cursor"
              },
              (v26/*: any*/),
              (v27/*: any*/),
              (v28/*: any*/),
              (v29/*: any*/),
              (v30/*: any*/),
              (v31/*: any*/),
              (v32/*: any*/),
              (v33/*: any*/)
            ],
            "kind": "FragmentSpread",
            "name": "FairArtworks_fair"
          }
        ],
        "storageKey": null
      }
    ],
    "type": "Query",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": [
      (v10/*: any*/),
      (v7/*: any*/),
      (v8/*: any*/),
      (v17/*: any*/),
      (v1/*: any*/),
      (v16/*: any*/),
      (v5/*: any*/),
      (v6/*: any*/),
      (v15/*: any*/),
      (v9/*: any*/),
      (v13/*: any*/),
      (v0/*: any*/),
      (v12/*: any*/),
      (v3/*: any*/),
      (v14/*: any*/),
      (v11/*: any*/),
      (v2/*: any*/),
      (v4/*: any*/)
    ],
    "kind": "Operation",
    "name": "FairArtworksInfiniteScrollGridQuery",
    "selections": [
      {
        "alias": null,
        "args": (v18/*: any*/),
        "concreteType": "Fair",
        "kind": "LinkedField",
        "name": "fair",
        "plural": false,
        "selections": [
          (v34/*: any*/),
          (v35/*: any*/),
          {
            "alias": "fairArtworks",
            "args": (v36/*: any*/),
            "concreteType": "FilterArtworksConnection",
            "kind": "LinkedField",
            "name": "filterArtworksConnection",
            "plural": false,
            "selections": [
              {
                "alias": null,
                "args": null,
                "concreteType": "ArtworksAggregationResults",
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
                      (v37/*: any*/),
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
                "concreteType": "FilterArtworksEdge",
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
                      (v38/*: any*/),
                      (v39/*: any*/)
                    ],
                    "storageKey": null
                  },
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "cursor",
                    "storageKey": null
                  }
                ],
                "storageKey": null
              },
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
                  },
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "followedArtists",
                    "storageKey": null
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
              (v38/*: any*/),
              {
                "kind": "InlineFragment",
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
                        "name": "startCursor",
                        "storageKey": null
                      }
                    ],
                    "storageKey": null
                  },
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": null,
                    "kind": "LinkedField",
                    "name": "edges",
                    "plural": true,
                    "selections": [
                      (v39/*: any*/),
                      {
                        "alias": null,
                        "args": null,
                        "concreteType": "Artwork",
                        "kind": "LinkedField",
                        "name": "node",
                        "plural": false,
                        "selections": [
                          (v34/*: any*/),
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
                                "name": "aspectRatio",
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
                          {
                            "alias": null,
                            "args": null,
                            "kind": "ScalarField",
                            "name": "title",
                            "storageKey": null
                          },
                          {
                            "alias": null,
                            "args": null,
                            "kind": "ScalarField",
                            "name": "date",
                            "storageKey": null
                          },
                          {
                            "alias": null,
                            "args": null,
                            "kind": "ScalarField",
                            "name": "saleMessage",
                            "storageKey": null
                          },
                          (v35/*: any*/),
                          {
                            "alias": null,
                            "args": null,
                            "kind": "ScalarField",
                            "name": "artistNames",
                            "storageKey": null
                          },
                          {
                            "alias": null,
                            "args": null,
                            "kind": "ScalarField",
                            "name": "href",
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
                              {
                                "alias": null,
                                "args": null,
                                "kind": "ScalarField",
                                "name": "isAuction",
                                "storageKey": null
                              },
                              {
                                "alias": null,
                                "args": null,
                                "kind": "ScalarField",
                                "name": "isClosed",
                                "storageKey": null
                              },
                              {
                                "alias": null,
                                "args": null,
                                "kind": "ScalarField",
                                "name": "displayTimelyAt",
                                "storageKey": null
                              },
                              {
                                "alias": null,
                                "args": null,
                                "kind": "ScalarField",
                                "name": "endAt",
                                "storageKey": null
                              },
                              (v38/*: any*/)
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
                              {
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
                              {
                                "alias": null,
                                "args": null,
                                "kind": "ScalarField",
                                "name": "lotLabel",
                                "storageKey": null
                              },
                              (v38/*: any*/)
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
                              (v37/*: any*/),
                              (v38/*: any*/)
                            ],
                            "storageKey": null
                          }
                        ],
                        "storageKey": null
                      },
                      {
                        "kind": "InlineFragment",
                        "selections": [
                          (v38/*: any*/)
                        ],
                        "type": "Node",
                        "abstractKey": "__isNode"
                      }
                    ],
                    "storageKey": null
                  }
                ],
                "type": "ArtworkConnectionInterface",
                "abstractKey": "__isArtworkConnectionInterface"
              }
            ],
            "storageKey": null
          },
          {
            "alias": "fairArtworks",
            "args": (v36/*: any*/),
            "filters": [
              "sort",
              "additionalGeneIDs",
              "priceRange",
              "color",
              "colors",
              "partnerID",
              "dimensionRange",
              "majorPeriods",
              "acquireable",
              "inquireableOnly",
              "atAuction",
              "offerable",
              "includeArtworksByFollowedArtists",
              "artistIDs",
              "aggregations",
              "attributionClass"
            ],
            "handle": "connection",
            "key": "Fair_fairArtworks",
            "kind": "LinkedHandle",
            "name": "filterArtworksConnection"
          },
          (v38/*: any*/)
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "id": "a74cf139f15c74f36d9c8408bb5de356",
    "metadata": {},
    "name": "FairArtworksInfiniteScrollGridQuery",
    "operationKind": "query",
    "text": null
  }
};
})();
(node as any).hash = '69f9c563d79af537d76021e2e4ff4732';
export default node;
