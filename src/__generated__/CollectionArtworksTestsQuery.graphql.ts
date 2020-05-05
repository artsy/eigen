/* tslint:disable */
/* eslint-disable */
/* @relayHash e50668fea441f41dec8f86f86ec08d11 */

import { ConcreteRequest } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type ArtworkAggregation = "COLOR" | "DIMENSION_RANGE" | "FOLLOWED_ARTISTS" | "GALLERY" | "INSTITUTION" | "MAJOR_PERIOD" | "MEDIUM" | "MERCHANDISABLE_ARTISTS" | "PARTNER_CITY" | "PERIOD" | "PRICE_RANGE" | "TOTAL" | "%future added value";
export type CollectionArtworksTestsQueryVariables = {};
export type CollectionArtworksTestsQueryResponse = {
    readonly marketingCollection: {
        readonly " $fragmentRefs": FragmentRefs<"CollectionArtworks_collection">;
    } | null;
};
export type CollectionArtworksTestsQueryRawResponse = {
    readonly marketingCollection: ({
        readonly isDepartment: boolean;
        readonly slug: string;
        readonly id: string;
        readonly collectionArtworks: ({
            readonly counts: ({
                readonly total: number | null;
            }) | null;
            readonly aggregations: ReadonlyArray<({
                readonly slice: ArtworkAggregation | null;
                readonly counts: ReadonlyArray<({
                    readonly value: string;
                    readonly name: string;
                    readonly count: number;
                }) | null> | null;
            }) | null> | null;
            readonly edges: ReadonlyArray<({
                readonly node: ({
                    readonly id: string;
                    readonly slug: string;
                    readonly image: ({
                        readonly aspectRatio: number;
                        readonly url: string | null;
                    }) | null;
                    readonly title: string | null;
                    readonly date: string | null;
                    readonly saleMessage: string | null;
                    readonly artistNames: string | null;
                    readonly href: string | null;
                    readonly sale: ({
                        readonly isAuction: boolean | null;
                        readonly isClosed: boolean | null;
                        readonly displayTimelyAt: string | null;
                        readonly id: string | null;
                    }) | null;
                    readonly saleArtwork: ({
                        readonly currentBid: ({
                            readonly display: string | null;
                        }) | null;
                        readonly id: string | null;
                    }) | null;
                    readonly __typename: "Artwork";
                }) | null;
                readonly cursor: string;
                readonly id: string | null;
            }) | null> | null;
            readonly pageInfo: {
                readonly hasNextPage: boolean;
                readonly startCursor: string | null;
                readonly endCursor: string | null;
            };
            readonly id: string | null;
        }) | null;
    }) | null;
};
export type CollectionArtworksTestsQuery = {
    readonly response: CollectionArtworksTestsQueryResponse;
    readonly variables: CollectionArtworksTestsQueryVariables;
    readonly rawResponse: CollectionArtworksTestsQueryRawResponse;
};



/*
query CollectionArtworksTestsQuery {
  marketingCollection(slug: "street-art-now") {
    ...CollectionArtworks_collection
    id
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
  image {
    url(version: "large")
    aspectRatio
  }
}

fragment CollectionArtworks_collection on MarketingCollection {
  isDepartment
  slug
  id
  collectionArtworks: artworksConnection(first: 10, after: "", sort: "-decayed_merch", medium: "*", aggregations: [MEDIUM], priceRange: "") {
    counts {
      total
    }
    aggregations {
      slice
      counts {
        value
        name
        count
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

fragment InfiniteScrollArtworksGrid_connection on ArtworkConnectionInterface {
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
      id
    }
  }
}
*/

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "kind": "Literal",
    "name": "slug",
    "value": "street-art-now"
  }
],
v1 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "slug",
  "args": null,
  "storageKey": null
},
v2 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "id",
  "args": null,
  "storageKey": null
},
v3 = [
  {
    "kind": "Literal",
    "name": "after",
    "value": ""
  },
  {
    "kind": "Literal",
    "name": "aggregations",
    "value": [
      "MEDIUM"
    ]
  },
  {
    "kind": "Literal",
    "name": "first",
    "value": 10
  },
  {
    "kind": "Literal",
    "name": "medium",
    "value": "*"
  },
  {
    "kind": "Literal",
    "name": "priceRange",
    "value": ""
  },
  {
    "kind": "Literal",
    "name": "sort",
    "value": "-decayed_merch"
  }
];
return {
  "kind": "Request",
  "fragment": {
    "kind": "Fragment",
    "name": "CollectionArtworksTestsQuery",
    "type": "Query",
    "metadata": null,
    "argumentDefinitions": [],
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "marketingCollection",
        "storageKey": "marketingCollection(slug:\"street-art-now\")",
        "args": (v0/*: any*/),
        "concreteType": "MarketingCollection",
        "plural": false,
        "selections": [
          {
            "kind": "FragmentSpread",
            "name": "CollectionArtworks_collection",
            "args": null
          }
        ]
      }
    ]
  },
  "operation": {
    "kind": "Operation",
    "name": "CollectionArtworksTestsQuery",
    "argumentDefinitions": [],
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "marketingCollection",
        "storageKey": "marketingCollection(slug:\"street-art-now\")",
        "args": (v0/*: any*/),
        "concreteType": "MarketingCollection",
        "plural": false,
        "selections": [
          {
            "kind": "ScalarField",
            "alias": null,
            "name": "isDepartment",
            "args": null,
            "storageKey": null
          },
          (v1/*: any*/),
          (v2/*: any*/),
          {
            "kind": "LinkedField",
            "alias": "collectionArtworks",
            "name": "artworksConnection",
            "storageKey": "artworksConnection(after:\"\",aggregations:[\"MEDIUM\"],first:10,medium:\"*\",priceRange:\"\",sort:\"-decayed_merch\")",
            "args": (v3/*: any*/),
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
                        "name": "value",
                        "args": null,
                        "storageKey": null
                      },
                      {
                        "kind": "ScalarField",
                        "alias": null,
                        "name": "name",
                        "args": null,
                        "storageKey": null
                      },
                      {
                        "kind": "ScalarField",
                        "alias": null,
                        "name": "count",
                        "args": null,
                        "storageKey": null
                      }
                    ]
                  }
                ]
              },
              {
                "kind": "LinkedField",
                "alias": null,
                "name": "edges",
                "storageKey": null,
                "args": null,
                "concreteType": "FilterArtworksEdge",
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
                      (v2/*: any*/),
                      (v1/*: any*/),
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
                      {
                        "kind": "ScalarField",
                        "alias": null,
                        "name": "href",
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
                          {
                            "kind": "ScalarField",
                            "alias": null,
                            "name": "displayTimelyAt",
                            "args": null,
                            "storageKey": null
                          },
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
                  },
                  (v2/*: any*/)
                ]
              },
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
              (v2/*: any*/)
            ]
          },
          {
            "kind": "LinkedHandle",
            "alias": "collectionArtworks",
            "name": "artworksConnection",
            "args": (v3/*: any*/),
            "handle": "connection",
            "key": "Collection_collectionArtworks",
            "filters": [
              "sort",
              "medium",
              "aggregations",
              "priceRange"
            ]
          }
        ]
      }
    ]
  },
  "params": {
    "operationKind": "query",
    "name": "CollectionArtworksTestsQuery",
    "id": "2e5684d3f4b294c46f721f4a2b556762",
    "text": null,
    "metadata": {}
  }
};
})();
(node as any).hash = '3e4ca3300cd6327076334dc582e4cd13';
export default node;
