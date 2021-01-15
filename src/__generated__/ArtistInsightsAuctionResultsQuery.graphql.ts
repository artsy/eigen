/* tslint:disable */
/* eslint-disable */
// @ts-nocheck
/* @relayHash 42819f2d79be5edfaa573de024be909d */

import { ConcreteRequest } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type ArtworkSizes = "LARGE" | "MEDIUM" | "SMALL" | "%future added value";
export type AuctionResultSorts = "DATE_DESC" | "ESTIMATE_AND_DATE_DESC" | "PRICE_AND_DATE_DESC" | "%future added value";
export type ArtistInsightsAuctionResultsQueryVariables = {
    count: number;
    cursor?: string | null;
    sort?: AuctionResultSorts | null;
    sizes?: Array<ArtworkSizes | null> | null;
    categories?: Array<string | null> | null;
    artistID: string;
};
export type ArtistInsightsAuctionResultsQueryResponse = {
    readonly artist: {
        readonly " $fragmentRefs": FragmentRefs<"ArtistInsightsAuctionResults_artist">;
    } | null;
};
export type ArtistInsightsAuctionResultsQuery = {
    readonly response: ArtistInsightsAuctionResultsQueryResponse;
    readonly variables: ArtistInsightsAuctionResultsQueryVariables;
};



/*
query ArtistInsightsAuctionResultsQuery(
  $count: Int!
  $cursor: String
  $sort: AuctionResultSorts
  $sizes: [ArtworkSizes]
  $categories: [String]
  $artistID: String!
) {
  artist(id: $artistID) {
    ...ArtistInsightsAuctionResults_artist_1h0nbq
    id
  }
}

fragment ArtistInsightsAuctionResults_artist_1h0nbq on Artist {
  slug
  auctionResultsConnection(first: $count, after: $cursor, sort: $sort, sizes: $sizes, categories: $categories) {
    edges {
      node {
        id
        internalID
        ...AuctionResult_auctionResult
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

fragment AuctionResult_auctionResult on AuctionResult {
  currency
  dateText
  id
  internalID
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
  priceRealized {
    display
    cents
  }
  saleDate
  title
}
*/

const node: ConcreteRequest = (function(){
var v0 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "artistID"
},
v1 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "categories"
},
v2 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "count"
},
v3 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "cursor"
},
v4 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "sizes"
},
v5 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "sort"
},
v6 = [
  {
    "kind": "Variable",
    "name": "id",
    "variableName": "artistID"
  }
],
v7 = {
  "kind": "Variable",
  "name": "categories",
  "variableName": "categories"
},
v8 = {
  "kind": "Variable",
  "name": "sizes",
  "variableName": "sizes"
},
v9 = {
  "kind": "Variable",
  "name": "sort",
  "variableName": "sort"
},
v10 = [
  {
    "kind": "Variable",
    "name": "after",
    "variableName": "cursor"
  },
  (v7/*: any*/),
  {
    "kind": "Variable",
    "name": "first",
    "variableName": "count"
  },
  (v8/*: any*/),
  (v9/*: any*/)
],
v11 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
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
      (v5/*: any*/)
    ],
    "kind": "Fragment",
    "metadata": null,
    "name": "ArtistInsightsAuctionResultsQuery",
    "selections": [
      {
        "alias": null,
        "args": (v6/*: any*/),
        "concreteType": "Artist",
        "kind": "LinkedField",
        "name": "artist",
        "plural": false,
        "selections": [
          {
            "args": [
              (v7/*: any*/),
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
              (v8/*: any*/),
              (v9/*: any*/)
            ],
            "kind": "FragmentSpread",
            "name": "ArtistInsightsAuctionResults_artist"
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
      (v2/*: any*/),
      (v3/*: any*/),
      (v5/*: any*/),
      (v4/*: any*/),
      (v1/*: any*/),
      (v0/*: any*/)
    ],
    "kind": "Operation",
    "name": "ArtistInsightsAuctionResultsQuery",
    "selections": [
      {
        "alias": null,
        "args": (v6/*: any*/),
        "concreteType": "Artist",
        "kind": "LinkedField",
        "name": "artist",
        "plural": false,
        "selections": [
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "slug",
            "storageKey": null
          },
          {
            "alias": null,
            "args": (v10/*: any*/),
            "concreteType": "AuctionResultConnection",
            "kind": "LinkedField",
            "name": "auctionResultsConnection",
            "plural": false,
            "selections": [
              {
                "alias": null,
                "args": null,
                "concreteType": "AuctionResultEdge",
                "kind": "LinkedField",
                "name": "edges",
                "plural": true,
                "selections": [
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "AuctionResult",
                    "kind": "LinkedField",
                    "name": "node",
                    "plural": false,
                    "selections": [
                      (v11/*: any*/),
                      {
                        "alias": null,
                        "args": null,
                        "kind": "ScalarField",
                        "name": "internalID",
                        "storageKey": null
                      },
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
                              {
                                "alias": null,
                                "args": null,
                                "kind": "ScalarField",
                                "name": "aspectRatio",
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
                        "concreteType": "AuctionResultPriceRealized",
                        "kind": "LinkedField",
                        "name": "priceRealized",
                        "plural": false,
                        "selections": [
                          {
                            "alias": null,
                            "args": null,
                            "kind": "ScalarField",
                            "name": "display",
                            "storageKey": null
                          },
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
                        "name": "__typename",
                        "storageKey": null
                      }
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
              }
            ],
            "storageKey": null
          },
          {
            "alias": null,
            "args": (v10/*: any*/),
            "filters": [
              "sort",
              "sizes",
              "categories"
            ],
            "handle": "connection",
            "key": "artist_auctionResultsConnection",
            "kind": "LinkedHandle",
            "name": "auctionResultsConnection"
          },
          (v11/*: any*/)
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "id": "42819f2d79be5edfaa573de024be909d",
    "metadata": {},
    "name": "ArtistInsightsAuctionResultsQuery",
    "operationKind": "query",
    "text": null
  }
};
})();
(node as any).hash = 'f6a1690494804759b2ffbbdf56ef1621';
export default node;
