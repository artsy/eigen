/* tslint:disable */
/* eslint-disable */

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type ArtworksInSeriesRail_artwork = {
    readonly internalID: string;
    readonly slug: string;
    readonly artistSeriesConnection: {
        readonly edges: ReadonlyArray<{
            readonly node: {
                readonly slug: string;
                readonly internalID: string;
                readonly filterArtworksConnection: {
                    readonly edges: ReadonlyArray<{
                        readonly node: {
                            readonly slug: string;
                            readonly internalID: string;
                            readonly href: string | null;
                            readonly artistNames: string | null;
                            readonly image: {
                                readonly imageURL: string | null;
                                readonly aspectRatio: number;
                            } | null;
                            readonly sale: {
                                readonly isAuction: boolean | null;
                                readonly isClosed: boolean | null;
                                readonly displayTimelyAt: string | null;
                            } | null;
                            readonly saleArtwork: {
                                readonly counts: {
                                    readonly bidderPositions: number | null;
                                } | null;
                                readonly currentBid: {
                                    readonly display: string | null;
                                } | null;
                            } | null;
                            readonly saleMessage: string | null;
                            readonly title: string | null;
                            readonly date: string | null;
                            readonly partner: {
                                readonly name: string | null;
                            } | null;
                        } | null;
                    } | null> | null;
                } | null;
            } | null;
        } | null> | null;
    } | null;
    readonly " $refType": "ArtworksInSeriesRail_artwork";
};
export type ArtworksInSeriesRail_artwork$data = ArtworksInSeriesRail_artwork;
export type ArtworksInSeriesRail_artwork$key = {
    readonly " $data"?: ArtworksInSeriesRail_artwork$data;
    readonly " $fragmentRefs": FragmentRefs<"ArtworksInSeriesRail_artwork">;
};



const node: ReaderFragment = (function(){
var v0 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "internalID",
  "args": null,
  "storageKey": null
},
v1 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "slug",
  "args": null,
  "storageKey": null
};
return {
  "kind": "Fragment",
  "name": "ArtworksInSeriesRail_artwork",
  "type": "Artwork",
  "metadata": null,
  "argumentDefinitions": [],
  "selections": [
    (v0/*: any*/),
    (v1/*: any*/),
    {
      "kind": "LinkedField",
      "alias": null,
      "name": "artistSeriesConnection",
      "storageKey": "artistSeriesConnection(first:1)",
      "args": [
        {
          "kind": "Literal",
          "name": "first",
          "value": 1
        }
      ],
      "concreteType": "ArtistSeriesConnection",
      "plural": false,
      "selections": [
        {
          "kind": "LinkedField",
          "alias": null,
          "name": "edges",
          "storageKey": null,
          "args": null,
          "concreteType": "ArtistSeriesEdge",
          "plural": true,
          "selections": [
            {
              "kind": "LinkedField",
              "alias": null,
              "name": "node",
              "storageKey": null,
              "args": null,
              "concreteType": "ArtistSeries",
              "plural": false,
              "selections": [
                (v1/*: any*/),
                (v0/*: any*/),
                {
                  "kind": "LinkedField",
                  "alias": null,
                  "name": "filterArtworksConnection",
                  "storageKey": "filterArtworksConnection(first:20,sort:\"-decayed_merch\")",
                  "args": [
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
                  ],
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
                            (v0/*: any*/),
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
                              "name": "artistNames",
                              "args": null,
                              "storageKey": null
                            },
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
                                  "name": "imageURL",
                                  "args": null,
                                  "storageKey": null
                                },
                                {
                                  "kind": "ScalarField",
                                  "alias": null,
                                  "name": "aspectRatio",
                                  "args": null,
                                  "storageKey": null
                                }
                              ]
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
                                }
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
                                  "name": "counts",
                                  "storageKey": null,
                                  "args": null,
                                  "concreteType": "SaleArtworkCounts",
                                  "plural": false,
                                  "selections": [
                                    {
                                      "kind": "ScalarField",
                                      "alias": null,
                                      "name": "bidderPositions",
                                      "args": null,
                                      "storageKey": null
                                    }
                                  ]
                                },
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
                                }
                              ]
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
                              "kind": "LinkedField",
                              "alias": null,
                              "name": "partner",
                              "storageKey": null,
                              "args": null,
                              "concreteType": "Partner",
                              "plural": false,
                              "selections": [
                                {
                                  "kind": "ScalarField",
                                  "alias": null,
                                  "name": "name",
                                  "args": null,
                                  "storageKey": null
                                }
                              ]
                            }
                          ]
                        }
                      ]
                    }
                  ]
                }
              ]
            }
          ]
        }
      ]
    }
  ]
};
})();
(node as any).hash = '6d4cacadfca1cb2eb6348f82350b7ead';
export default node;
