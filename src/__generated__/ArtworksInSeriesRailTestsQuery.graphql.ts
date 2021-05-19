/* tslint:disable */
/* eslint-disable */
// @ts-nocheck
/* @relayHash 27d9d3ec937f864f4de098b386bef847 */

import { ConcreteRequest } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type ArtworksInSeriesRailTestsQueryVariables = {};
export type ArtworksInSeriesRailTestsQueryResponse = {
    readonly artwork: {
        readonly " $fragmentRefs": FragmentRefs<"ArtworksInSeriesRail_artwork">;
    } | null;
};
export type ArtworksInSeriesRailTestsQueryRawResponse = {
    readonly artwork: ({
        readonly internalID: string;
        readonly slug: string;
        readonly artistSeriesConnection: ({
            readonly edges: ReadonlyArray<({
                readonly node: ({
                    readonly slug: string;
                    readonly internalID: string;
                    readonly filterArtworksConnection: ({
                        readonly edges: ReadonlyArray<({
                            readonly node: ({
                                readonly slug: string;
                                readonly internalID: string;
                                readonly href: string | null;
                                readonly artistNames: string | null;
                                readonly image: ({
                                    readonly imageURL: string | null;
                                    readonly aspectRatio: number;
                                }) | null;
                                readonly sale: ({
                                    readonly isAuction: boolean | null;
                                    readonly isClosed: boolean | null;
                                    readonly displayTimelyAt: string | null;
                                    readonly id: string;
                                }) | null;
                                readonly saleArtwork: ({
                                    readonly counts: ({
                                        readonly bidderPositions: number | null;
                                    }) | null;
                                    readonly currentBid: ({
                                        readonly display: string | null;
                                    }) | null;
                                    readonly id: string;
                                }) | null;
                                readonly saleMessage: string | null;
                                readonly title: string | null;
                                readonly date: string | null;
                                readonly partner: ({
                                    readonly name: string | null;
                                    readonly id: string;
                                }) | null;
                                readonly id: string;
                            }) | null;
                        }) | null> | null;
                        readonly id: string;
                    }) | null;
                }) | null;
            }) | null> | null;
        }) | null;
        readonly id: string;
    }) | null;
};
export type ArtworksInSeriesRailTestsQuery = {
    readonly response: ArtworksInSeriesRailTestsQueryResponse;
    readonly variables: ArtworksInSeriesRailTestsQueryVariables;
    readonly rawResponse: ArtworksInSeriesRailTestsQueryRawResponse;
};



/*
query ArtworksInSeriesRailTestsQuery {
  artwork(id: "some-artwork") {
    ...ArtworksInSeriesRail_artwork
    id
  }
}

fragment ArtworksInSeriesRail_artwork on Artwork {
  internalID
  slug
  artistSeriesConnection(first: 1) {
    edges {
      node {
        slug
        internalID
        filterArtworksConnection(first: 20, input: {sort: "-decayed_merch"}) {
          edges {
            node {
              slug
              internalID
              href
              artistNames
              image {
                imageURL
                aspectRatio
              }
              sale {
                isAuction
                isClosed
                displayTimelyAt
                id
              }
              saleArtwork {
                counts {
                  bidderPositions
                }
                currentBid {
                  display
                }
                id
              }
              saleMessage
              title
              date
              partner {
                name
                id
              }
              id
            }
          }
          id
        }
      }
    }
  }
}
*/

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "kind": "Literal",
    "name": "id",
    "value": "some-artwork"
  }
],
v1 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "internalID",
  "storageKey": null
},
v2 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "slug",
  "storageKey": null
},
v3 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
};
return {
  "fragment": {
    "argumentDefinitions": [],
    "kind": "Fragment",
    "metadata": null,
    "name": "ArtworksInSeriesRailTestsQuery",
    "selections": [
      {
        "alias": null,
        "args": (v0/*: any*/),
        "concreteType": "Artwork",
        "kind": "LinkedField",
        "name": "artwork",
        "plural": false,
        "selections": [
          {
            "args": null,
            "kind": "FragmentSpread",
            "name": "ArtworksInSeriesRail_artwork"
          }
        ],
        "storageKey": "artwork(id:\"some-artwork\")"
      }
    ],
    "type": "Query",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": [],
    "kind": "Operation",
    "name": "ArtworksInSeriesRailTestsQuery",
    "selections": [
      {
        "alias": null,
        "args": (v0/*: any*/),
        "concreteType": "Artwork",
        "kind": "LinkedField",
        "name": "artwork",
        "plural": false,
        "selections": [
          (v1/*: any*/),
          (v2/*: any*/),
          {
            "alias": null,
            "args": [
              {
                "kind": "Literal",
                "name": "first",
                "value": 1
              }
            ],
            "concreteType": "ArtistSeriesConnection",
            "kind": "LinkedField",
            "name": "artistSeriesConnection",
            "plural": false,
            "selections": [
              {
                "alias": null,
                "args": null,
                "concreteType": "ArtistSeriesEdge",
                "kind": "LinkedField",
                "name": "edges",
                "plural": true,
                "selections": [
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "ArtistSeries",
                    "kind": "LinkedField",
                    "name": "node",
                    "plural": false,
                    "selections": [
                      (v2/*: any*/),
                      (v1/*: any*/),
                      {
                        "alias": null,
                        "args": [
                          {
                            "kind": "Literal",
                            "name": "first",
                            "value": 20
                          },
                          {
                            "kind": "Literal",
                            "name": "input",
                            "value": {
                              "sort": "-decayed_merch"
                            }
                          }
                        ],
                        "concreteType": "FilterArtworksConnection",
                        "kind": "LinkedField",
                        "name": "filterArtworksConnection",
                        "plural": false,
                        "selections": [
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
                                  (v2/*: any*/),
                                  (v1/*: any*/),
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
                                    "kind": "ScalarField",
                                    "name": "artistNames",
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
                                        "alias": null,
                                        "args": null,
                                        "kind": "ScalarField",
                                        "name": "imageURL",
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
                                      (v3/*: any*/)
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
                                      (v3/*: any*/)
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
                                    "concreteType": "Partner",
                                    "kind": "LinkedField",
                                    "name": "partner",
                                    "plural": false,
                                    "selections": [
                                      {
                                        "alias": null,
                                        "args": null,
                                        "kind": "ScalarField",
                                        "name": "name",
                                        "storageKey": null
                                      },
                                      (v3/*: any*/)
                                    ],
                                    "storageKey": null
                                  },
                                  (v3/*: any*/)
                                ],
                                "storageKey": null
                              }
                            ],
                            "storageKey": null
                          },
                          (v3/*: any*/)
                        ],
                        "storageKey": "filterArtworksConnection(first:20,input:{\"sort\":\"-decayed_merch\"})"
                      }
                    ],
                    "storageKey": null
                  }
                ],
                "storageKey": null
              }
            ],
            "storageKey": "artistSeriesConnection(first:1)"
          },
          (v3/*: any*/)
        ],
        "storageKey": "artwork(id:\"some-artwork\")"
      }
    ]
  },
  "params": {
    "id": "27d9d3ec937f864f4de098b386bef847",
    "metadata": {},
    "name": "ArtworksInSeriesRailTestsQuery",
    "operationKind": "query",
    "text": null
  }
};
})();
(node as any).hash = 'b3301f7c86dc8f69c41558912cff2603';
export default node;
