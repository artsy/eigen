/* tslint:disable */
/* eslint-disable */
/* @relayHash b6164a7da1b0979d9de64bad35808027 */

import { ConcreteRequest } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type ArtworkAggregation = "COLOR" | "DIMENSION_RANGE" | "FOLLOWED_ARTISTS" | "GALLERY" | "INSTITUTION" | "MAJOR_PERIOD" | "MEDIUM" | "MERCHANDISABLE_ARTISTS" | "PARTNER_CITY" | "PERIOD" | "PRICE_RANGE" | "TOTAL" | "%future added value";
export type ShowArtworksTestsQueryVariables = {};
export type ShowArtworksTestsQueryResponse = {
    readonly show: {
        readonly " $fragmentRefs": FragmentRefs<"ShowArtworks_show">;
    } | null;
};
export type ShowArtworksTestsQueryRawResponse = {
    readonly show: ({
        readonly id: string;
        readonly slug: string;
        readonly internalID: string;
        readonly filterArtworksConnection: ({
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
                    readonly partner: ({
                        readonly name: string | null;
                        readonly id: string | null;
                    }) | null;
                    readonly __typename: "Artwork";
                }) | null;
                readonly cursor: string;
                readonly id: string | null;
            }) | null> | null;
            readonly aggregations: ReadonlyArray<({
                readonly slice: ArtworkAggregation | null;
                readonly counts: ReadonlyArray<({
                    readonly name: string;
                    readonly value: string;
                }) | null> | null;
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
export type ShowArtworksTestsQuery = {
    readonly response: ShowArtworksTestsQueryResponse;
    readonly variables: ShowArtworksTestsQueryVariables;
    readonly rawResponse: ShowArtworksTestsQueryRawResponse;
};



/*
query ShowArtworksTestsQuery {
  show(id: "anderson-fine-art-gallery-flickinger-collection") {
    ...ShowArtworks_show
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
  partner {
    name
    id
  }
  image {
    url(version: "large")
    aspectRatio
  }
}

fragment FilteredInfiniteScrollGrid_entity on EntityWithFilterArtworksConnectionInterface {
  id
  filterArtworksConnection(first: 10, medium: "*", priceRange: "*-*", aggregations: [MEDIUM, PRICE_RANGE, TOTAL]) {
    edges {
      node {
        id
        __typename
      }
      cursor
    }
    ...Filters_filteredArtworks
    ...InfiniteScrollArtworksGrid_connection
    pageInfo {
      endCursor
      hasNextPage
    }
    id
  }
}

fragment Filters_filteredArtworks on FilterArtworksConnection {
  aggregations {
    slice
    counts {
      name
      value
    }
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

fragment ShowArtworks_show on Show {
  id
  slug
  internalID
  ...FilteredInfiniteScrollGrid_entity
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
v1 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "id",
  "args": null,
  "storageKey": null
},
v2 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "slug",
  "args": null,
  "storageKey": null
},
v3 = [
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
    "value": "*-*"
  }
],
v4 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "name",
  "args": null,
  "storageKey": null
};
return {
  "kind": "Request",
  "fragment": {
    "kind": "Fragment",
    "name": "ShowArtworksTestsQuery",
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
            "kind": "FragmentSpread",
            "name": "ShowArtworks_show",
            "args": null
          }
        ]
      }
    ]
  },
  "operation": {
    "kind": "Operation",
    "name": "ShowArtworksTestsQuery",
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
          (v1/*: any*/),
          (v2/*: any*/),
          {
            "kind": "ScalarField",
            "alias": null,
            "name": "internalID",
            "args": null,
            "storageKey": null
          },
          {
            "kind": "LinkedField",
            "alias": null,
            "name": "filterArtworksConnection",
            "storageKey": "filterArtworksConnection(aggregations:[\"MEDIUM\",\"PRICE_RANGE\",\"TOTAL\"],first:10,medium:\"*\",priceRange:\"*-*\")",
            "args": (v3/*: any*/),
            "concreteType": "FilterArtworksConnection",
            "plural": false,
            "selections": [
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
                      (v1/*: any*/),
                      (v2/*: any*/),
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
                          (v1/*: any*/)
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
                          (v1/*: any*/)
                        ]
                      },
                      {
                        "kind": "LinkedField",
                        "alias": null,
                        "name": "partner",
                        "storageKey": null,
                        "args": null,
                        "concreteType": "Partner",
                        "plural": false,
                        "selections": [
                          (v4/*: any*/),
                          (v1/*: any*/)
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
                  (v1/*: any*/)
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
                      (v4/*: any*/),
                      {
                        "kind": "ScalarField",
                        "alias": null,
                        "name": "value",
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
              (v1/*: any*/)
            ]
          },
          {
            "kind": "LinkedHandle",
            "alias": null,
            "name": "filterArtworksConnection",
            "args": (v3/*: any*/),
            "handle": "connection",
            "key": "FilteredInfiniteScrollGridContainer_filterArtworksConnection",
            "filters": [
              "medium",
              "priceRange",
              "aggregations"
            ]
          }
        ]
      }
    ]
  },
  "params": {
    "operationKind": "query",
    "name": "ShowArtworksTestsQuery",
    "id": "1a3f7a40121c448874c7d591cc088060",
    "text": null,
    "metadata": {}
  }
};
})();
(node as any).hash = '3c7f3d42b1f0ad15186107e5bb2305b0';
export default node;
