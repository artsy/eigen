/* tslint:disable */
/* eslint-disable */

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type MyCollectionArtworkArtistAuctionResults_artwork = {
    readonly artist: {
        readonly auctionResultsConnection: {
            readonly edges: ReadonlyArray<{
                readonly node: {
                    readonly title: string | null;
                    readonly dimensionText: string | null;
                    readonly images: {
                        readonly thumbnail: {
                            readonly url: string | null;
                        } | null;
                    } | null;
                    readonly description: string | null;
                    readonly dateText: string | null;
                    readonly saleDate: string | null;
                    readonly priceRealized: {
                        readonly display: string | null;
                        readonly centsUSD: number | null;
                    } | null;
                } | null;
            } | null> | null;
        } | null;
    } | null;
    readonly " $refType": "MyCollectionArtworkArtistAuctionResults_artwork";
};
export type MyCollectionArtworkArtistAuctionResults_artwork$data = MyCollectionArtworkArtistAuctionResults_artwork;
export type MyCollectionArtworkArtistAuctionResults_artwork$key = {
    readonly " $data"?: MyCollectionArtworkArtistAuctionResults_artwork$data;
    readonly " $fragmentRefs": FragmentRefs<"MyCollectionArtworkArtistAuctionResults_artwork">;
};



const node: ReaderFragment = {
  "kind": "Fragment",
  "name": "MyCollectionArtworkArtistAuctionResults_artwork",
  "type": "Artwork",
  "metadata": null,
  "argumentDefinitions": [],
  "selections": [
    {
      "kind": "LinkedField",
      "alias": null,
      "name": "artist",
      "storageKey": null,
      "args": null,
      "concreteType": "Artist",
      "plural": false,
      "selections": [
        {
          "kind": "LinkedField",
          "alias": null,
          "name": "auctionResultsConnection",
          "storageKey": "auctionResultsConnection(first:3,sort:\"DATE_DESC\")",
          "args": [
            {
              "kind": "Literal",
              "name": "first",
              "value": 3
            },
            {
              "kind": "Literal",
              "name": "sort",
              "value": "DATE_DESC"
            }
          ],
          "concreteType": "AuctionResultConnection",
          "plural": false,
          "selections": [
            {
              "kind": "LinkedField",
              "alias": null,
              "name": "edges",
              "storageKey": null,
              "args": null,
              "concreteType": "AuctionResultEdge",
              "plural": true,
              "selections": [
                {
                  "kind": "LinkedField",
                  "alias": null,
                  "name": "node",
                  "storageKey": null,
                  "args": null,
                  "concreteType": "AuctionResult",
                  "plural": false,
                  "selections": [
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
                      "name": "dimensionText",
                      "args": null,
                      "storageKey": null
                    },
                    {
                      "kind": "LinkedField",
                      "alias": null,
                      "name": "images",
                      "storageKey": null,
                      "args": null,
                      "concreteType": "AuctionLotImages",
                      "plural": false,
                      "selections": [
                        {
                          "kind": "LinkedField",
                          "alias": null,
                          "name": "thumbnail",
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
                        }
                      ]
                    },
                    {
                      "kind": "ScalarField",
                      "alias": null,
                      "name": "description",
                      "args": null,
                      "storageKey": null
                    },
                    {
                      "kind": "ScalarField",
                      "alias": null,
                      "name": "dateText",
                      "args": null,
                      "storageKey": null
                    },
                    {
                      "kind": "ScalarField",
                      "alias": null,
                      "name": "saleDate",
                      "args": null,
                      "storageKey": null
                    },
                    {
                      "kind": "LinkedField",
                      "alias": null,
                      "name": "priceRealized",
                      "storageKey": null,
                      "args": null,
                      "concreteType": "AuctionResultPriceRealized",
                      "plural": false,
                      "selections": [
                        {
                          "kind": "ScalarField",
                          "alias": null,
                          "name": "display",
                          "args": null,
                          "storageKey": null
                        },
                        {
                          "kind": "ScalarField",
                          "alias": null,
                          "name": "centsUSD",
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
};
(node as any).hash = '66b8379bd8673c394f901db9ad478665';
export default node;
