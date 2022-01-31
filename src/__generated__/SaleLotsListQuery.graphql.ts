/* tslint:disable */
/* eslint-disable */
// @ts-nocheck
/* @relayHash f16e0ca6a10ef0362d2dbd6ffaf4a8c4 */

import { ConcreteRequest } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type SaleArtworkAggregation = "ARTIST" | "FOLLOWED_ARTISTS" | "MEDIUM" | "TOTAL" | "%future added value";
export type SaleLotsListQueryVariables = {
    geneIDs?: Array<string | null> | null | undefined;
    artistIDs?: Array<string | null> | null | undefined;
    count: number;
    cursor?: string | null | undefined;
    estimateRange?: string | null | undefined;
    saleID?: string | null | undefined;
    sort?: string | null | undefined;
    includeArtworksByFollowedArtists?: boolean | null | undefined;
};
export type SaleLotsListQueryResponse = {
    readonly " $fragmentRefs": FragmentRefs<"SaleLotsList_saleArtworksConnection">;
};
export type SaleLotsListQueryRawResponse = {
    readonly saleArtworksConnection: ({
        readonly aggregations: ReadonlyArray<({
            readonly slice: SaleArtworkAggregation | null;
            readonly counts: ReadonlyArray<({
                readonly count: number;
                readonly name: string;
                readonly value: string;
            }) | null> | null;
        }) | null> | null;
        readonly counts: ({
            readonly followedArtists: number | null;
            readonly total: number | null;
        }) | null;
        readonly edges: ReadonlyArray<({
            readonly node: ({
                readonly id: string;
                readonly __typename: "Artwork";
                readonly artistNames?: string | null | undefined;
                readonly date?: string | null | undefined;
                readonly href?: string | null | undefined;
                readonly image?: ({
                    readonly small: string | null;
                    readonly aspectRatio: number;
                    readonly height: number | null;
                    readonly width: number | null;
                    readonly url: string | null;
                }) | null | undefined;
                readonly saleMessage?: string | null | undefined;
                readonly slug?: string | undefined;
                readonly title?: string | null | undefined;
                readonly internalID?: string | undefined;
                readonly sale?: ({
                    readonly isAuction: boolean | null;
                    readonly isClosed: boolean | null;
                    readonly displayTimelyAt: string | null;
                    readonly endAt: string | null;
                    readonly id: string;
                }) | null | undefined;
                readonly saleArtwork?: ({
                    readonly counts: ({
                        readonly bidderPositions: number | null;
                    }) | null;
                    readonly currentBid: ({
                        readonly display: string | null;
                    }) | null;
                    readonly lotLabel: string | null;
                    readonly id: string;
                }) | null | undefined;
                readonly partner?: ({
                    readonly name: string | null;
                    readonly id: string;
                }) | null | undefined;
                readonly realizedPrice?: string | null | undefined;
            }) | null;
            readonly cursor: string | null;
            readonly id: string;
            readonly __typename?: string | undefined;
            readonly __isNode?: string | undefined;
        }) | null> | null;
        readonly pageInfo: {
            readonly endCursor: string | null;
            readonly hasNextPage: boolean;
            readonly startCursor?: string | null | undefined;
        };
        readonly __isArtworkConnectionInterface: "SaleArtworksConnection";
    }) | null;
};
export type SaleLotsListQuery = {
    readonly response: SaleLotsListQueryResponse;
    readonly variables: SaleLotsListQueryVariables;
    readonly rawResponse: SaleLotsListQueryRawResponse;
};



/*
query SaleLotsListQuery(
  $geneIDs: [String]
  $artistIDs: [String]
  $count: Int!
  $cursor: String
  $estimateRange: String
  $saleID: ID
  $sort: String
  $includeArtworksByFollowedArtists: Boolean
) {
  ...SaleLotsList_saleArtworksConnection_19IfRN
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
  realizedPrice
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

fragment SaleLotsList_saleArtworksConnection_19IfRN on Query {
  saleArtworksConnection(after: $cursor, saleID: $saleID, artistIDs: $artistIDs, geneIDs: $geneIDs, aggregations: [FOLLOWED_ARTISTS, ARTIST, MEDIUM, TOTAL], estimateRange: $estimateRange, first: $count, includeArtworksByFollowedArtists: $includeArtworksByFollowedArtists, sort: $sort) {
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
var v0 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "artistIDs"
},
v1 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "count"
},
v2 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "cursor"
},
v3 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "estimateRange"
},
v4 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "geneIDs"
},
v5 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "includeArtworksByFollowedArtists"
},
v6 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "saleID"
},
v7 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "sort"
},
v8 = {
  "kind": "Variable",
  "name": "artistIDs",
  "variableName": "artistIDs"
},
v9 = {
  "kind": "Variable",
  "name": "estimateRange",
  "variableName": "estimateRange"
},
v10 = {
  "kind": "Variable",
  "name": "geneIDs",
  "variableName": "geneIDs"
},
v11 = {
  "kind": "Variable",
  "name": "includeArtworksByFollowedArtists",
  "variableName": "includeArtworksByFollowedArtists"
},
v12 = {
  "kind": "Variable",
  "name": "saleID",
  "variableName": "saleID"
},
v13 = {
  "kind": "Variable",
  "name": "sort",
  "variableName": "sort"
},
v14 = [
  {
    "kind": "Variable",
    "name": "after",
    "variableName": "cursor"
  },
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
  (v8/*: any*/),
  (v9/*: any*/),
  {
    "kind": "Variable",
    "name": "first",
    "variableName": "count"
  },
  (v10/*: any*/),
  (v11/*: any*/),
  (v12/*: any*/),
  (v13/*: any*/)
],
v15 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "name",
  "storageKey": null
},
v16 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
},
v17 = {
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
      (v7/*: any*/)
    ],
    "kind": "Fragment",
    "metadata": null,
    "name": "SaleLotsListQuery",
    "selections": [
      {
        "args": [
          (v8/*: any*/),
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
          (v9/*: any*/),
          (v10/*: any*/),
          (v11/*: any*/),
          (v12/*: any*/),
          (v13/*: any*/)
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
    "argumentDefinitions": [
      (v4/*: any*/),
      (v0/*: any*/),
      (v1/*: any*/),
      (v2/*: any*/),
      (v3/*: any*/),
      (v6/*: any*/),
      (v7/*: any*/),
      (v5/*: any*/)
    ],
    "kind": "Operation",
    "name": "SaleLotsListQuery",
    "selections": [
      {
        "alias": null,
        "args": (v14/*: any*/),
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
                  (v15/*: any*/),
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
                  (v16/*: any*/),
                  (v17/*: any*/)
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
              (v16/*: any*/)
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
                  (v17/*: any*/),
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "Artwork",
                    "kind": "LinkedField",
                    "name": "node",
                    "plural": false,
                    "selections": [
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
                        "name": "date",
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
                        "concreteType": "Image",
                        "kind": "LinkedField",
                        "name": "image",
                        "plural": false,
                        "selections": [
                          {
                            "alias": "small",
                            "args": [
                              {
                                "kind": "Literal",
                                "name": "version",
                                "value": "small"
                              }
                            ],
                            "kind": "ScalarField",
                            "name": "url",
                            "storageKey": "url(version:\"small\")"
                          },
                          {
                            "alias": null,
                            "args": null,
                            "kind": "ScalarField",
                            "name": "aspectRatio",
                            "storageKey": null
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
                        "name": "saleMessage",
                        "storageKey": null
                      },
                      {
                        "alias": null,
                        "args": null,
                        "kind": "ScalarField",
                        "name": "slug",
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
                        "name": "internalID",
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
                          (v16/*: any*/)
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
                          (v16/*: any*/)
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
                          (v15/*: any*/),
                          (v16/*: any*/)
                        ],
                        "storageKey": null
                      },
                      {
                        "alias": null,
                        "args": null,
                        "kind": "ScalarField",
                        "name": "realizedPrice",
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
        "storageKey": null
      },
      {
        "alias": null,
        "args": (v14/*: any*/),
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
    "id": "f16e0ca6a10ef0362d2dbd6ffaf4a8c4",
    "metadata": {},
    "name": "SaleLotsListQuery",
    "operationKind": "query",
    "text": null
  }
};
})();
(node as any).hash = 'cd1c2fed0e773559dcdf80b7584d2a98';
export default node;
