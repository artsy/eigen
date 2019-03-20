/* tslint:disable */

import { ConcreteRequest } from "relay-runtime";
import { ShowArtworks_show$ref } from "./ShowArtworks_show.graphql";
export type QueryRenderersShowArtworksQueryVariables = {
    readonly showID: string;
};
export type QueryRenderersShowArtworksQueryResponse = {
    readonly show: ({
        readonly " $fragmentRefs": ShowArtworks_show$ref;
    }) | null;
};
export type QueryRenderersShowArtworksQuery = {
    readonly response: QueryRenderersShowArtworksQueryResponse;
    readonly variables: QueryRenderersShowArtworksQueryVariables;
};



/*
query QueryRenderersShowArtworksQuery(
  $showID: String!
) {
  show(id: $showID) {
    ...ShowArtworks_show
    __id
  }
}

fragment ShowArtworks_show on Show {
  __id
  id
  _id
  filteredArtworks(size: 0, medium: "*", price_range: "*-*", aggregations: [MEDIUM, PRICE_RANGE, TOTAL]) {
    ...FilteredInfiniteScrollGrid_filteredArtworks
    __id
  }
}

fragment FilteredInfiniteScrollGrid_filteredArtworks on FilterArtworks {
  ...Filters_filteredArtworks
  ...ArtworksGridPaginationContainer_filteredArtworks
  __id
}

fragment Filters_filteredArtworks on FilterArtworks {
  aggregations {
    slice
    counts {
      id
      name
      __id
    }
  }
  __id
}

fragment ArtworksGridPaginationContainer_filteredArtworks on FilterArtworks {
  __id
  artworks: artworks_connection(first: 10) {
    pageInfo {
      hasNextPage
      startCursor
      endCursor
    }
    edges {
      node {
        id
        __id
        image {
          aspect_ratio
        }
        ...Artwork_artwork
        __typename
      }
      cursor
    }
  }
}

fragment Artwork_artwork on Artwork {
  title
  date
  sale_message
  is_in_auction
  is_biddable
  is_acquireable
  is_offerable
  id
  sale {
    is_auction
    is_live_open
    is_open
    is_closed
    display_timely_at
    __id
  }
  sale_artwork {
    opening_bid {
      display
    }
    current_bid {
      display
    }
    bidder_positions_count
    sale {
      is_closed
      __id
    }
    __id
  }
  image {
    url(version: "large")
    aspect_ratio
  }
  artists(shallow: true) {
    name
    __id
  }
  partner {
    name
    __id
  }
  href
  __id
}
*/

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "kind": "LocalArgument",
    "name": "showID",
    "type": "String!",
    "defaultValue": null
  }
],
v1 = [
  {
    "kind": "Variable",
    "name": "id",
    "variableName": "showID",
    "type": "String!"
  }
],
v2 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "__id",
  "args": null,
  "storageKey": null
},
v3 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "id",
  "args": null,
  "storageKey": null
},
v4 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "name",
  "args": null,
  "storageKey": null
},
v5 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "is_closed",
  "args": null,
  "storageKey": null
},
v6 = [
  {
    "kind": "ScalarField",
    "alias": null,
    "name": "display",
    "args": null,
    "storageKey": null
  }
],
v7 = [
  v4,
  v2
];
return {
  "kind": "Request",
  "operationKind": "query",
  "name": "QueryRenderersShowArtworksQuery",
  "id": "87b37fe5ac84471b688ab4de332c7c3e",
  "text": null,
  "metadata": {},
  "fragment": {
    "kind": "Fragment",
    "name": "QueryRenderersShowArtworksQuery",
    "type": "Query",
    "metadata": null,
    "argumentDefinitions": v0,
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "show",
        "storageKey": null,
        "args": v1,
        "concreteType": "Show",
        "plural": false,
        "selections": [
          {
            "kind": "FragmentSpread",
            "name": "ShowArtworks_show",
            "args": null
          },
          v2
        ]
      }
    ]
  },
  "operation": {
    "kind": "Operation",
    "name": "QueryRenderersShowArtworksQuery",
    "argumentDefinitions": v0,
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "show",
        "storageKey": null,
        "args": v1,
        "concreteType": "Show",
        "plural": false,
        "selections": [
          v2,
          v3,
          {
            "kind": "ScalarField",
            "alias": null,
            "name": "_id",
            "args": null,
            "storageKey": null
          },
          {
            "kind": "LinkedField",
            "alias": null,
            "name": "filteredArtworks",
            "storageKey": "filteredArtworks(aggregations:[\"MEDIUM\",\"PRICE_RANGE\",\"TOTAL\"],medium:\"*\",price_range:\"*-*\",size:0)",
            "args": [
              {
                "kind": "Literal",
                "name": "aggregations",
                "value": [
                  "MEDIUM",
                  "PRICE_RANGE",
                  "TOTAL"
                ],
                "type": "[ArtworkAggregation]"
              },
              {
                "kind": "Literal",
                "name": "medium",
                "value": "*",
                "type": "String"
              },
              {
                "kind": "Literal",
                "name": "price_range",
                "value": "*-*",
                "type": "String"
              },
              {
                "kind": "Literal",
                "name": "size",
                "value": 0,
                "type": "Int"
              }
            ],
            "concreteType": "FilterArtworks",
            "plural": false,
            "selections": [
              {
                "kind": "LinkedField",
                "alias": null,
                "name": "aggregations",
                "storageKey": null,
                "args": null,
                "concreteType": "ArtworksAggregationResults",
                "plural": true,
                "selections": [
                  {
                    "kind": "ScalarField",
                    "alias": null,
                    "name": "slice",
                    "args": null,
                    "storageKey": null
                  },
                  {
                    "kind": "LinkedField",
                    "alias": null,
                    "name": "counts",
                    "storageKey": null,
                    "args": null,
                    "concreteType": "AggregationCount",
                    "plural": true,
                    "selections": [
                      v3,
                      v4,
                      v2
                    ]
                  }
                ]
              },
              v2,
              {
                "kind": "LinkedField",
                "alias": "artworks",
                "name": "artworks_connection",
                "storageKey": "artworks_connection(first:10)",
                "args": [
                  {
                    "kind": "Literal",
                    "name": "first",
                    "value": 10,
                    "type": "Int"
                  }
                ],
                "concreteType": "ArtworkConnection",
                "plural": false,
                "selections": [
                  {
                    "kind": "LinkedField",
                    "alias": null,
                    "name": "pageInfo",
                    "storageKey": null,
                    "args": null,
                    "concreteType": "PageInfo",
                    "plural": false,
                    "selections": [
                      {
                        "kind": "ScalarField",
                        "alias": null,
                        "name": "hasNextPage",
                        "args": null,
                        "storageKey": null
                      },
                      {
                        "kind": "ScalarField",
                        "alias": null,
                        "name": "startCursor",
                        "args": null,
                        "storageKey": null
                      },
                      {
                        "kind": "ScalarField",
                        "alias": null,
                        "name": "endCursor",
                        "args": null,
                        "storageKey": null
                      }
                    ]
                  },
                  {
                    "kind": "LinkedField",
                    "alias": null,
                    "name": "edges",
                    "storageKey": null,
                    "args": null,
                    "concreteType": "ArtworkEdge",
                    "plural": true,
                    "selections": [
                      {
                        "kind": "LinkedField",
                        "alias": null,
                        "name": "node",
                        "storageKey": null,
                        "args": null,
                        "concreteType": "Artwork",
                        "plural": false,
                        "selections": [
                          {
                            "kind": "ScalarField",
                            "alias": null,
                            "name": "is_acquireable",
                            "args": null,
                            "storageKey": null
                          },
                          v3,
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
                                "name": "aspect_ratio",
                                "args": null,
                                "storageKey": null
                              },
                              {
                                "kind": "ScalarField",
                                "alias": null,
                                "name": "url",
                                "args": [
                                  {
                                    "kind": "Literal",
                                    "name": "version",
                                    "value": "large",
                                    "type": "[String]"
                                  }
                                ],
                                "storageKey": "url(version:\"large\")"
                              }
                            ]
                          },
                          {
                            "kind": "ScalarField",
                            "alias": null,
                            "name": "title",
                            "args": null,
                            "storageKey": null
                          },
                          {
                            "kind": "ScalarField",
                            "alias": null,
                            "name": "date",
                            "args": null,
                            "storageKey": null
                          },
                          {
                            "kind": "ScalarField",
                            "alias": null,
                            "name": "sale_message",
                            "args": null,
                            "storageKey": null
                          },
                          {
                            "kind": "ScalarField",
                            "alias": null,
                            "name": "is_in_auction",
                            "args": null,
                            "storageKey": null
                          },
                          {
                            "kind": "ScalarField",
                            "alias": null,
                            "name": "is_biddable",
                            "args": null,
                            "storageKey": null
                          },
                          v2,
                          {
                            "kind": "ScalarField",
                            "alias": null,
                            "name": "is_offerable",
                            "args": null,
                            "storageKey": null
                          },
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
                                "name": "is_auction",
                                "args": null,
                                "storageKey": null
                              },
                              {
                                "kind": "ScalarField",
                                "alias": null,
                                "name": "is_live_open",
                                "args": null,
                                "storageKey": null
                              },
                              {
                                "kind": "ScalarField",
                                "alias": null,
                                "name": "is_open",
                                "args": null,
                                "storageKey": null
                              },
                              v5,
                              {
                                "kind": "ScalarField",
                                "alias": null,
                                "name": "display_timely_at",
                                "args": null,
                                "storageKey": null
                              },
                              v2
                            ]
                          },
                          {
                            "kind": "LinkedField",
                            "alias": null,
                            "name": "sale_artwork",
                            "storageKey": null,
                            "args": null,
                            "concreteType": "SaleArtwork",
                            "plural": false,
                            "selections": [
                              {
                                "kind": "LinkedField",
                                "alias": null,
                                "name": "opening_bid",
                                "storageKey": null,
                                "args": null,
                                "concreteType": "SaleArtworkOpeningBid",
                                "plural": false,
                                "selections": v6
                              },
                              {
                                "kind": "LinkedField",
                                "alias": null,
                                "name": "current_bid",
                                "storageKey": null,
                                "args": null,
                                "concreteType": "SaleArtworkCurrentBid",
                                "plural": false,
                                "selections": v6
                              },
                              {
                                "kind": "ScalarField",
                                "alias": null,
                                "name": "bidder_positions_count",
                                "args": null,
                                "storageKey": null
                              },
                              {
                                "kind": "LinkedField",
                                "alias": null,
                                "name": "sale",
                                "storageKey": null,
                                "args": null,
                                "concreteType": "Sale",
                                "plural": false,
                                "selections": [
                                  v5,
                                  v2
                                ]
                              },
                              v2
                            ]
                          },
                          {
                            "kind": "LinkedField",
                            "alias": null,
                            "name": "artists",
                            "storageKey": "artists(shallow:true)",
                            "args": [
                              {
                                "kind": "Literal",
                                "name": "shallow",
                                "value": true,
                                "type": "Boolean"
                              }
                            ],
                            "concreteType": "Artist",
                            "plural": true,
                            "selections": v7
                          },
                          {
                            "kind": "LinkedField",
                            "alias": null,
                            "name": "partner",
                            "storageKey": null,
                            "args": null,
                            "concreteType": "Partner",
                            "plural": false,
                            "selections": v7
                          },
                          {
                            "kind": "ScalarField",
                            "alias": null,
                            "name": "href",
                            "args": null,
                            "storageKey": null
                          },
                          {
                            "kind": "ScalarField",
                            "alias": null,
                            "name": "__typename",
                            "args": null,
                            "storageKey": null
                          }
                        ]
                      },
                      {
                        "kind": "ScalarField",
                        "alias": null,
                        "name": "cursor",
                        "args": null,
                        "storageKey": null
                      }
                    ]
                  }
                ]
              },
              {
                "kind": "LinkedHandle",
                "alias": "artworks",
                "name": "artworks_connection",
                "args": [
                  {
                    "kind": "Literal",
                    "name": "first",
                    "value": 10,
                    "type": "Int"
                  }
                ],
                "handle": "connection",
                "key": "ArtworksGridPaginationContainer_artworks",
                "filters": null
              }
            ]
          }
        ]
      }
    ]
  }
};
})();
(node as any).hash = '5c80348b34e75502c27428412dcc531f';
export default node;
