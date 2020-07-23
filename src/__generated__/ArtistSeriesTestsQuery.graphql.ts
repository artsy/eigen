/* tslint:disable */
/* eslint-disable */
/* @relayHash d56e4d8efc4d9be55c524d72a4f94da4 */

import { ConcreteRequest } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type ArtistSeriesTestsQueryVariables = {};
export type ArtistSeriesTestsQueryResponse = {
    readonly artistSeries: {
        readonly " $fragmentRefs": FragmentRefs<"ArtistSeries_artistSeries">;
    } | null;
};
export type ArtistSeriesTestsQueryRawResponse = {
    readonly artistSeries: ({
        readonly image: ({
            readonly url: string | null;
        }) | null;
        readonly title: string;
        readonly description: string | null;
        readonly artists: ReadonlyArray<({
            readonly id: string;
            readonly internalID: string;
            readonly name: string | null;
            readonly slug: string;
            readonly isFollowed: boolean | null;
            readonly image: ({
                readonly url: string | null;
            }) | null;
        }) | null> | null;
        readonly slug: string;
        readonly artistSeriesArtworks: ({
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
            readonly counts: ({
                readonly total: number | null;
            }) | null;
            readonly pageInfo: {
                readonly hasNextPage: boolean;
                readonly startCursor: string | null;
                readonly endCursor: string | null;
            };
            readonly id: string | null;
        }) | null;
    }) | null;
};
export type ArtistSeriesTestsQuery = {
    readonly response: ArtistSeriesTestsQueryResponse;
    readonly variables: ArtistSeriesTestsQueryVariables;
    readonly rawResponse: ArtistSeriesTestsQueryRawResponse;
};



/*
query ArtistSeriesTestsQuery {
  artistSeries(id: "pumpkins") {
    ...ArtistSeries_artistSeries
  }
}

fragment ArtistSeriesArtworks_artistSeries on ArtistSeries {
  slug
  artistSeriesArtworks: filterArtworksConnection(first: 20, sort: "-decayed_merch") {
    edges {
      node {
        id
        __typename
      }
      cursor
    }
    counts {
      total
    }
    ...InfiniteScrollArtworksGrid_connection
    pageInfo {
      endCursor
      hasNextPage
    }
    id
  }
}

fragment ArtistSeriesHeader_artistSeries on ArtistSeries {
  image {
    url
  }
}

fragment ArtistSeriesMeta_artistSeries on ArtistSeries {
  title
  description
  artists(size: 1) {
    id
    internalID
    name
    slug
    isFollowed
    image {
      url
    }
  }
}

fragment ArtistSeries_artistSeries on ArtistSeries {
  ...ArtistSeriesHeader_artistSeries
  ...ArtistSeriesMeta_artistSeries
  ...ArtistSeriesArtworks_artistSeries
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
    "name": "id",
    "value": "pumpkins"
  }
],
v1 = {
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
      "name": "url",
      "args": null,
      "storageKey": null
    }
  ]
},
v2 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "title",
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
  "name": "slug",
  "args": null,
  "storageKey": null
},
v6 = [
  {
    "kind": "Literal",
    "name": "first",
    "value": 20
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
    "name": "ArtistSeriesTestsQuery",
    "type": "Query",
    "metadata": null,
    "argumentDefinitions": [],
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "artistSeries",
        "storageKey": "artistSeries(id:\"pumpkins\")",
        "args": (v0/*: any*/),
        "concreteType": "ArtistSeries",
        "plural": false,
        "selections": [
          {
            "kind": "FragmentSpread",
            "name": "ArtistSeries_artistSeries",
            "args": null
          }
        ]
      }
    ]
  },
  "operation": {
    "kind": "Operation",
    "name": "ArtistSeriesTestsQuery",
    "argumentDefinitions": [],
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "artistSeries",
        "storageKey": "artistSeries(id:\"pumpkins\")",
        "args": (v0/*: any*/),
        "concreteType": "ArtistSeries",
        "plural": false,
        "selections": [
          (v1/*: any*/),
          (v2/*: any*/),
          {
            "kind": "ScalarField",
            "alias": null,
            "name": "description",
            "args": null,
            "storageKey": null
          },
          {
            "kind": "LinkedField",
            "alias": null,
            "name": "artists",
            "storageKey": "artists(size:1)",
            "args": [
              {
                "kind": "Literal",
                "name": "size",
                "value": 1
              }
            ],
            "concreteType": "Artist",
            "plural": true,
            "selections": [
              (v3/*: any*/),
              {
                "kind": "ScalarField",
                "alias": null,
                "name": "internalID",
                "args": null,
                "storageKey": null
              },
              (v4/*: any*/),
              (v5/*: any*/),
              {
                "kind": "ScalarField",
                "alias": null,
                "name": "isFollowed",
                "args": null,
                "storageKey": null
              },
              (v1/*: any*/)
            ]
          },
          (v5/*: any*/),
          {
            "kind": "LinkedField",
            "alias": "artistSeriesArtworks",
            "name": "filterArtworksConnection",
            "storageKey": "filterArtworksConnection(first:20,sort:\"-decayed_merch\")",
            "args": (v6/*: any*/),
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
                      (v3/*: any*/),
                      (v5/*: any*/),
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
                      (v2/*: any*/),
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
                          (v3/*: any*/)
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
                          (v3/*: any*/)
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
                          (v3/*: any*/)
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
                  (v3/*: any*/)
                ]
              },
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
              (v3/*: any*/)
            ]
          },
          {
            "kind": "LinkedHandle",
            "alias": "artistSeriesArtworks",
            "name": "filterArtworksConnection",
            "args": (v6/*: any*/),
            "handle": "connection",
            "key": "ArtistSeries_artistSeriesArtworks",
            "filters": [
              "sort"
            ]
          }
        ]
      }
    ]
  },
  "params": {
    "operationKind": "query",
    "name": "ArtistSeriesTestsQuery",
    "id": "81504efbed1b3b04ea3cd6272dbd2cd5",
    "text": null,
    "metadata": {}
  }
};
})();
(node as any).hash = 'cb9b55b2d2788da2ecffb811cdebd6e3';
export default node;
