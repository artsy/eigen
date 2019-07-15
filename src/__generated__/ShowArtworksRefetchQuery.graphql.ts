/* tslint:disable */

import { ConcreteRequest } from "relay-runtime";
import { ShowArtworks_show$ref } from "./ShowArtworks_show.graphql";
export type ShowArtworksRefetchQueryVariables = {
    readonly showID: string;
    readonly medium?: string | null;
    readonly price_range?: string | null;
};
export type ShowArtworksRefetchQueryResponse = {
    readonly show: {
        readonly " $fragmentRefs": ShowArtworks_show$ref;
    } | null;
};
export type ShowArtworksRefetchQuery = {
    readonly response: ShowArtworksRefetchQueryResponse;
    readonly variables: ShowArtworksRefetchQueryVariables;
};



/*
query ShowArtworksRefetchQuery(
  $showID: String!
  $medium: String
  $price_range: String
) {
  show(id: $showID) {
    ...ShowArtworks_show_2UkO81
    id
  }
}

fragment ShowArtworks_show_2UkO81 on Show {
  id
  slug
  internalID
  filteredArtworks(size: 0, medium: $medium, price_range: $price_range, aggregations: [MEDIUM, PRICE_RANGE, TOTAL]) {
    ...FilteredInfiniteScrollGrid_filteredArtworks
    id
  }
}

fragment FilteredInfiniteScrollGrid_filteredArtworks on FilterArtworks {
  ...Filters_filteredArtworks
  ...ArtworksGridPaginationContainer_filteredArtworks
}

fragment Filters_filteredArtworks on FilterArtworks {
  aggregations {
    slice
    counts {
      internalID
      name
      id
    }
  }
}

fragment ArtworksGridPaginationContainer_filteredArtworks on FilterArtworks {
  id
  artworks: artworks_connection(first: 10) {
    pageInfo {
      hasNextPage
      startCursor
      endCursor
    }
    edges {
      node {
        slug
        id
        image {
          aspect_ratio
        }
        ...ArtworkGridItem_artwork
        __typename
      }
      cursor
    }
  }
}

fragment ArtworkGridItem_artwork on Artwork {
  title
  date
  sale_message
  is_in_auction
  is_biddable
  is_acquireable
  is_offerable
  slug
  sale {
    is_auction
    is_live_open
    is_open
    is_closed
    display_timely_at
    id
  }
  sale_artwork {
    current_bid {
      display
    }
    id
  }
  image {
    url(version: "large")
    aspect_ratio
  }
  artists(shallow: true) {
    name
    id
  }
  partner {
    name
    id
  }
  href
}
*/

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "kind": "LocalArgument",
    "name": "showID",
    "type": "String!",
    "defaultValue": null
  },
  {
    "kind": "LocalArgument",
    "name": "medium",
    "type": "String",
    "defaultValue": null
  },
  {
    "kind": "LocalArgument",
    "name": "price_range",
    "type": "String",
    "defaultValue": null
  }
],
v1 = [
  {
    "kind": "Variable",
    "name": "id",
    "variableName": "showID"
  }
],
v2 = {
  "kind": "Variable",
  "name": "medium",
  "variableName": "medium"
},
v3 = {
  "kind": "Variable",
  "name": "price_range",
  "variableName": "price_range"
},
v4 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "id",
  "args": null,
  "storageKey": null
},
v5 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "slug",
  "args": null,
  "storageKey": null
},
v6 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "internalID",
  "args": null,
  "storageKey": null
},
v7 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "name",
  "args": null,
  "storageKey": null
},
v8 = [
  {
    "kind": "Literal",
    "name": "first",
    "value": 10
  }
],
v9 = [
  (v7/*: any*/),
  (v4/*: any*/)
];
return {
  "kind": "Request",
  "fragment": {
    "kind": "Fragment",
    "name": "ShowArtworksRefetchQuery",
    "type": "Query",
    "metadata": null,
    "argumentDefinitions": (v0/*: any*/),
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "show",
        "storageKey": null,
        "args": (v1/*: any*/),
        "concreteType": "Show",
        "plural": false,
        "selections": [
          {
            "kind": "FragmentSpread",
            "name": "ShowArtworks_show",
            "args": [
              (v2/*: any*/),
              (v3/*: any*/)
            ]
          }
        ]
      }
    ]
  },
  "operation": {
    "kind": "Operation",
    "name": "ShowArtworksRefetchQuery",
    "argumentDefinitions": (v0/*: any*/),
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "show",
        "storageKey": null,
        "args": (v1/*: any*/),
        "concreteType": "Show",
        "plural": false,
        "selections": [
          (v4/*: any*/),
          (v5/*: any*/),
          (v6/*: any*/),
          {
            "kind": "LinkedField",
            "alias": null,
            "name": "filteredArtworks",
            "storageKey": null,
            "args": [
              {
                "kind": "Literal",
                "name": "aggregations",
                "value": [
                  "MEDIUM",
                  "PRICE_RANGE",
                  "TOTAL"
                ]
              },
              (v2/*: any*/),
              (v3/*: any*/),
              {
                "kind": "Literal",
                "name": "size",
                "value": 0
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
                      (v6/*: any*/),
                      (v7/*: any*/),
                      (v4/*: any*/)
                    ]
                  }
                ]
              },
              (v4/*: any*/),
              {
                "kind": "LinkedField",
                "alias": "artworks",
                "name": "artworks_connection",
                "storageKey": "artworks_connection(first:10)",
                "args": (v8/*: any*/),
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
                          (v5/*: any*/),
                          (v4/*: any*/),
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
                                    "value": "large"
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
                          {
                            "kind": "ScalarField",
                            "alias": null,
                            "name": "is_acquireable",
                            "args": null,
                            "storageKey": null
                          },
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
                              {
                                "kind": "ScalarField",
                                "alias": null,
                                "name": "is_closed",
                                "args": null,
                                "storageKey": null
                              },
                              {
                                "kind": "ScalarField",
                                "alias": null,
                                "name": "display_timely_at",
                                "args": null,
                                "storageKey": null
                              },
                              (v4/*: any*/)
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
                                "name": "current_bid",
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
                              (v4/*: any*/)
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
                                "value": true
                              }
                            ],
                            "concreteType": "Artist",
                            "plural": true,
                            "selections": (v9/*: any*/)
                          },
                          {
                            "kind": "LinkedField",
                            "alias": null,
                            "name": "partner",
                            "storageKey": null,
                            "args": null,
                            "concreteType": "Partner",
                            "plural": false,
                            "selections": (v9/*: any*/)
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
                "args": (v8/*: any*/),
                "handle": "connection",
                "key": "ArtworksGridPaginationContainer_artworks",
                "filters": null
              }
            ]
          }
        ]
      }
    ]
  },
  "params": {
    "operationKind": "query",
    "name": "ShowArtworksRefetchQuery",
    "id": "cfe05958f0111fbd09fc57e85e64c51a",
    "text": null,
    "metadata": {}
  }
};
})();
(node as any).hash = '537f787cacd5e1451f9ac64267f2816a';
export default node;
