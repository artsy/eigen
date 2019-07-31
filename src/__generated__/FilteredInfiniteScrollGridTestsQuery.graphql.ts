/* tslint:disable */

import { ConcreteRequest } from "relay-runtime";
import { FilteredInfiniteScrollGrid_filteredArtworks$ref } from "./FilteredInfiniteScrollGrid_filteredArtworks.graphql";
export type FilteredInfiniteScrollGridTestsQueryVariables = {};
export type FilteredInfiniteScrollGridTestsQueryResponse = {
    readonly show: {
        readonly filteredArtworks: {
            readonly " $fragmentRefs": FilteredInfiniteScrollGrid_filteredArtworks$ref;
        } | null;
    } | null;
};
export type FilteredInfiniteScrollGridTestsQuery = {
    readonly response: FilteredInfiniteScrollGridTestsQueryResponse;
    readonly variables: FilteredInfiniteScrollGridTestsQueryVariables;
};



/*
query FilteredInfiniteScrollGridTestsQuery {
  show(id: "anderson-fine-art-gallery-flickinger-collection") {
    filteredArtworks(size: 0, medium: "*", priceRange: "*-*", aggregations: [MEDIUM, PRICE_RANGE, TOTAL]) {
      ...FilteredInfiniteScrollGrid_filteredArtworks
      id
    }
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
  artworks: artworksConnection(first: 10) {
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
          aspect_ratio: aspectRatio
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
  sale_message: saleMessage
  is_in_auction: isInAuction
  is_biddable: isBiddable
  is_acquireable: isAcquireable
  is_offerable: isOfferable
  slug
  sale {
    is_auction: isAuction
    is_live_open: isLiveOpen
    is_open: isOpen
    is_closed: isClosed
    display_timely_at: displayTimelyAt
    id
  }
  sale_artwork: saleArtwork {
    current_bid: currentBid {
      display
    }
    id
  }
  image {
    url(version: "large")
    aspect_ratio: aspectRatio
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
    "kind": "Literal",
    "name": "id",
    "value": "anderson-fine-art-gallery-flickinger-collection"
  }
],
v1 = [
  {
    "kind": "Literal",
    "name": "aggregations",
    "value": [
      "MEDIUM",
      "PRICE_RANGE",
      "TOTAL"
    ]
  },
  {
    "kind": "Literal",
    "name": "medium",
    "value": "*"
  },
  {
    "kind": "Literal",
    "name": "priceRange",
    "value": "*-*"
  },
  {
    "kind": "Literal",
    "name": "size",
    "value": 0
  }
],
v2 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "name",
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
v4 = [
  {
    "kind": "Literal",
    "name": "first",
    "value": 10
  }
],
v5 = [
  (v2/*: any*/),
  (v3/*: any*/)
];
return {
  "kind": "Request",
  "fragment": {
    "kind": "Fragment",
    "name": "FilteredInfiniteScrollGridTestsQuery",
    "type": "Query",
    "metadata": null,
    "argumentDefinitions": [],
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "show",
        "storageKey": "show(id:\"anderson-fine-art-gallery-flickinger-collection\")",
        "args": (v0/*: any*/),
        "concreteType": "Show",
        "plural": false,
        "selections": [
          {
            "kind": "LinkedField",
            "alias": null,
            "name": "filteredArtworks",
            "storageKey": "filteredArtworks(aggregations:[\"MEDIUM\",\"PRICE_RANGE\",\"TOTAL\"],medium:\"*\",priceRange:\"*-*\",size:0)",
            "args": (v1/*: any*/),
            "concreteType": "FilterArtworks",
            "plural": false,
            "selections": [
              {
                "kind": "FragmentSpread",
                "name": "FilteredInfiniteScrollGrid_filteredArtworks",
                "args": null
              }
            ]
          }
        ]
      }
    ]
  },
  "operation": {
    "kind": "Operation",
    "name": "FilteredInfiniteScrollGridTestsQuery",
    "argumentDefinitions": [],
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "show",
        "storageKey": "show(id:\"anderson-fine-art-gallery-flickinger-collection\")",
        "args": (v0/*: any*/),
        "concreteType": "Show",
        "plural": false,
        "selections": [
          {
            "kind": "LinkedField",
            "alias": null,
            "name": "filteredArtworks",
            "storageKey": "filteredArtworks(aggregations:[\"MEDIUM\",\"PRICE_RANGE\",\"TOTAL\"],medium:\"*\",priceRange:\"*-*\",size:0)",
            "args": (v1/*: any*/),
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
                      {
                        "kind": "ScalarField",
                        "alias": null,
                        "name": "internalID",
                        "args": null,
                        "storageKey": null
                      },
                      (v2/*: any*/),
                      (v3/*: any*/)
                    ]
                  }
                ]
              },
              (v3/*: any*/),
              {
                "kind": "LinkedField",
                "alias": "artworks",
                "name": "artworksConnection",
                "storageKey": "artworksConnection(first:10)",
                "args": (v4/*: any*/),
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
                            "name": "slug",
                            "args": null,
                            "storageKey": null
                          },
                          (v3/*: any*/),
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
                                "alias": "aspect_ratio",
                                "name": "aspectRatio",
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
                            "alias": "sale_message",
                            "name": "saleMessage",
                            "args": null,
                            "storageKey": null
                          },
                          {
                            "kind": "ScalarField",
                            "alias": "is_in_auction",
                            "name": "isInAuction",
                            "args": null,
                            "storageKey": null
                          },
                          {
                            "kind": "ScalarField",
                            "alias": "is_biddable",
                            "name": "isBiddable",
                            "args": null,
                            "storageKey": null
                          },
                          {
                            "kind": "ScalarField",
                            "alias": "is_acquireable",
                            "name": "isAcquireable",
                            "args": null,
                            "storageKey": null
                          },
                          {
                            "kind": "ScalarField",
                            "alias": "is_offerable",
                            "name": "isOfferable",
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
                                "alias": "is_auction",
                                "name": "isAuction",
                                "args": null,
                                "storageKey": null
                              },
                              {
                                "kind": "ScalarField",
                                "alias": "is_live_open",
                                "name": "isLiveOpen",
                                "args": null,
                                "storageKey": null
                              },
                              {
                                "kind": "ScalarField",
                                "alias": "is_open",
                                "name": "isOpen",
                                "args": null,
                                "storageKey": null
                              },
                              {
                                "kind": "ScalarField",
                                "alias": "is_closed",
                                "name": "isClosed",
                                "args": null,
                                "storageKey": null
                              },
                              {
                                "kind": "ScalarField",
                                "alias": "display_timely_at",
                                "name": "displayTimelyAt",
                                "args": null,
                                "storageKey": null
                              },
                              (v3/*: any*/)
                            ]
                          },
                          {
                            "kind": "LinkedField",
                            "alias": "sale_artwork",
                            "name": "saleArtwork",
                            "storageKey": null,
                            "args": null,
                            "concreteType": "SaleArtwork",
                            "plural": false,
                            "selections": [
                              {
                                "kind": "LinkedField",
                                "alias": "current_bid",
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
                              (v3/*: any*/)
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
                            "selections": (v5/*: any*/)
                          },
                          {
                            "kind": "LinkedField",
                            "alias": null,
                            "name": "partner",
                            "storageKey": null,
                            "args": null,
                            "concreteType": "Partner",
                            "plural": false,
                            "selections": (v5/*: any*/)
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
                "name": "artworksConnection",
                "args": (v4/*: any*/),
                "handle": "connection",
                "key": "ArtworksGridPaginationContainer_artworks",
                "filters": null
              }
            ]
          },
          (v3/*: any*/)
        ]
      }
    ]
  },
  "params": {
    "operationKind": "query",
    "name": "FilteredInfiniteScrollGridTestsQuery",
    "id": "85e98cfadd50004f8569b10088813804",
    "text": null,
    "metadata": {}
  }
};
})();
(node as any).hash = '3ddb8c12c287d2554b8ef39b204f94b7';
export default node;
