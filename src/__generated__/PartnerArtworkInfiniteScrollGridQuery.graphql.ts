/* tslint:disable */
/* eslint-disable */
// @ts-nocheck
/* @relayHash d38c00931be0fca769d272f548f1a5af */

import { ConcreteRequest } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type PartnerArtworkInfiniteScrollGridQueryVariables = {
    acquireable?: boolean | null;
    attributionClass?: Array<string | null> | null;
    color?: string | null;
    colors?: Array<string | null> | null;
    count: number;
    cursor?: string | null;
    dimensionRange?: string | null;
    additionalGeneIDs?: Array<string | null> | null;
    id: string;
    inquireableOnly?: boolean | null;
    majorPeriods?: Array<string | null> | null;
    offerable?: boolean | null;
    priceRange?: string | null;
    sort?: string | null;
};
export type PartnerArtworkInfiniteScrollGridQueryResponse = {
    readonly partner: {
        readonly " $fragmentRefs": FragmentRefs<"PartnerArtwork_partner">;
    } | null;
};
export type PartnerArtworkInfiniteScrollGridQuery = {
    readonly response: PartnerArtworkInfiniteScrollGridQueryResponse;
    readonly variables: PartnerArtworkInfiniteScrollGridQueryVariables;
};



/*
query PartnerArtworkInfiniteScrollGridQuery(
  $acquireable: Boolean
  $attributionClass: [String]
  $color: String
  $colors: [String]
  $count: Int!
  $cursor: String
  $dimensionRange: String
  $additionalGeneIDs: [String]
  $id: String!
  $inquireableOnly: Boolean
  $majorPeriods: [String]
  $offerable: Boolean
  $priceRange: String
  $sort: String
) {
  partner(id: $id) {
    ...PartnerArtwork_partner_2wu630
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

fragment PartnerArtwork_partner_2wu630 on Partner {
  internalID
  slug
  artworks: filterArtworksConnection(acquireable: $acquireable, after: $cursor, aggregations: [COLOR, DIMENSION_RANGE, MAJOR_PERIOD, MEDIUM, PRICE_RANGE], attributionClass: $attributionClass, color: $color, colors: $colors, dimensionRange: $dimensionRange, additionalGeneIDs: $additionalGeneIDs, first: $count, inquireableOnly: $inquireableOnly, majorPeriods: $majorPeriods, offerable: $offerable, priceRange: $priceRange, sort: $sort) {
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
    ...InfiniteScrollArtworksGrid_connection
    pageInfo {
      endCursor
      hasNextPage
    }
    id
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
  "name": "attributionClass"
},
v3 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "color"
},
v4 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "colors"
},
v5 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "count"
},
v6 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "cursor"
},
v7 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "dimensionRange"
},
v8 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "id"
},
v9 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "inquireableOnly"
},
v10 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "majorPeriods"
},
v11 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "offerable"
},
v12 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "priceRange"
},
v13 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "sort"
},
v14 = [
  {
    "kind": "Variable",
    "name": "id",
    "variableName": "id"
  }
],
v15 = {
  "kind": "Variable",
  "name": "acquireable",
  "variableName": "acquireable"
},
v16 = {
  "kind": "Variable",
  "name": "additionalGeneIDs",
  "variableName": "additionalGeneIDs"
},
v17 = {
  "kind": "Variable",
  "name": "attributionClass",
  "variableName": "attributionClass"
},
v18 = {
  "kind": "Variable",
  "name": "color",
  "variableName": "color"
},
v19 = {
  "kind": "Variable",
  "name": "colors",
  "variableName": "colors"
},
v20 = {
  "kind": "Variable",
  "name": "dimensionRange",
  "variableName": "dimensionRange"
},
v21 = {
  "kind": "Variable",
  "name": "inquireableOnly",
  "variableName": "inquireableOnly"
},
v22 = {
  "kind": "Variable",
  "name": "majorPeriods",
  "variableName": "majorPeriods"
},
v23 = {
  "kind": "Variable",
  "name": "offerable",
  "variableName": "offerable"
},
v24 = {
  "kind": "Variable",
  "name": "priceRange",
  "variableName": "priceRange"
},
v25 = {
  "kind": "Variable",
  "name": "sort",
  "variableName": "sort"
},
v26 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "internalID",
  "storageKey": null
},
v27 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "slug",
  "storageKey": null
},
v28 = [
  (v15/*: any*/),
  (v16/*: any*/),
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
      "MAJOR_PERIOD",
      "MEDIUM",
      "PRICE_RANGE"
    ]
  },
  (v17/*: any*/),
  (v18/*: any*/),
  (v19/*: any*/),
  (v20/*: any*/),
  {
    "kind": "Variable",
    "name": "first",
    "variableName": "count"
  },
  (v21/*: any*/),
  (v22/*: any*/),
  (v23/*: any*/),
  (v24/*: any*/),
  (v25/*: any*/)
],
v29 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "name",
  "storageKey": null
},
v30 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
},
v31 = {
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
      (v13/*: any*/)
    ],
    "kind": "Fragment",
    "metadata": null,
    "name": "PartnerArtworkInfiniteScrollGridQuery",
    "selections": [
      {
        "alias": null,
        "args": (v14/*: any*/),
        "concreteType": "Partner",
        "kind": "LinkedField",
        "name": "partner",
        "plural": false,
        "selections": [
          {
            "args": [
              (v15/*: any*/),
              (v16/*: any*/),
              (v17/*: any*/),
              (v18/*: any*/),
              (v19/*: any*/),
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
              (v20/*: any*/),
              (v21/*: any*/),
              (v22/*: any*/),
              (v23/*: any*/),
              (v24/*: any*/),
              (v25/*: any*/)
            ],
            "kind": "FragmentSpread",
            "name": "PartnerArtwork_partner"
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
      (v0/*: any*/),
      (v2/*: any*/),
      (v3/*: any*/),
      (v4/*: any*/),
      (v5/*: any*/),
      (v6/*: any*/),
      (v7/*: any*/),
      (v1/*: any*/),
      (v8/*: any*/),
      (v9/*: any*/),
      (v10/*: any*/),
      (v11/*: any*/),
      (v12/*: any*/),
      (v13/*: any*/)
    ],
    "kind": "Operation",
    "name": "PartnerArtworkInfiniteScrollGridQuery",
    "selections": [
      {
        "alias": null,
        "args": (v14/*: any*/),
        "concreteType": "Partner",
        "kind": "LinkedField",
        "name": "partner",
        "plural": false,
        "selections": [
          (v26/*: any*/),
          (v27/*: any*/),
          {
            "alias": "artworks",
            "args": (v28/*: any*/),
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
                      (v29/*: any*/),
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
                      (v30/*: any*/),
                      (v31/*: any*/)
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
              },
              (v30/*: any*/),
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
                      (v31/*: any*/),
                      {
                        "alias": null,
                        "args": null,
                        "concreteType": "Artwork",
                        "kind": "LinkedField",
                        "name": "node",
                        "plural": false,
                        "selections": [
                          (v27/*: any*/),
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
                          (v26/*: any*/),
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
                              (v30/*: any*/)
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
                              (v30/*: any*/)
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
                              (v29/*: any*/),
                              (v30/*: any*/)
                            ],
                            "storageKey": null
                          }
                        ],
                        "storageKey": null
                      },
                      {
                        "kind": "InlineFragment",
                        "selections": [
                          (v30/*: any*/)
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
            "alias": "artworks",
            "args": (v28/*: any*/),
            "filters": [
              "acquireable",
              "aggregations",
              "attributionClass",
              "color",
              "colors",
              "dimensionRange",
              "additionalGeneIDs",
              "inquireableOnly",
              "majorPeriods",
              "offerable",
              "priceRange",
              "sort"
            ],
            "handle": "connection",
            "key": "Partner_artworks",
            "kind": "LinkedHandle",
            "name": "filterArtworksConnection"
          },
          (v30/*: any*/)
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "id": "d38c00931be0fca769d272f548f1a5af",
    "metadata": {},
    "name": "PartnerArtworkInfiniteScrollGridQuery",
    "operationKind": "query",
    "text": null
  }
};
})();
(node as any).hash = '2c748a6f7659147bcc96dafccc811b3b';
export default node;
