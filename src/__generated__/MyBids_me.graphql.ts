/* tslint:disable */
/* eslint-disable */

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type AuctionsSoldStatus = "ForSale" | "Passed" | "Sold" | "%future added value";
export type MyBids_me = {
    readonly auctionsLotStandingConnection: {
        readonly edges: ReadonlyArray<{
            readonly node: {
                readonly isHighestBidder: boolean;
                readonly lotState: {
                    readonly saleId: string;
                    readonly bidCount: number;
                    readonly soldStatus: AuctionsSoldStatus;
                    readonly onlineAskingPrice: {
                        readonly displayAmount: string;
                    };
                    readonly floorSellingPrice: {
                        readonly displayAmount: string;
                    } | null;
                };
                readonly saleArtwork: {
                    readonly id: string;
                    readonly lotLabel: string | null;
                    readonly artwork: {
                        readonly artistNames: string | null;
                        readonly href: string | null;
                        readonly image: {
                            readonly url: string | null;
                        } | null;
                    } | null;
                } | null;
            };
        } | null> | null;
    };
    readonly " $refType": "MyBids_me";
};
export type MyBids_me$data = MyBids_me;
export type MyBids_me$key = {
    readonly " $data"?: MyBids_me$data;
    readonly " $fragmentRefs": FragmentRefs<"MyBids_me">;
};



const node: ReaderFragment = (function(){
var v0 = [
  {
    "kind": "ScalarField",
    "alias": null,
    "name": "displayAmount",
    "args": null,
    "storageKey": null
  }
];
return {
  "kind": "Fragment",
  "name": "MyBids_me",
  "type": "Me",
  "metadata": null,
  "argumentDefinitions": [],
  "selections": [
    {
      "kind": "LinkedField",
      "alias": null,
      "name": "auctionsLotStandingConnection",
      "storageKey": "auctionsLotStandingConnection(first:25)",
      "args": [
        {
          "kind": "Literal",
          "name": "first",
          "value": 25
        }
      ],
      "concreteType": "AuctionsLotStandingConnection",
      "plural": false,
      "selections": [
        {
          "kind": "LinkedField",
          "alias": null,
          "name": "edges",
          "storageKey": null,
          "args": null,
          "concreteType": "AuctionsLotStandingEdge",
          "plural": true,
          "selections": [
            {
              "kind": "LinkedField",
              "alias": null,
              "name": "node",
              "storageKey": null,
              "args": null,
              "concreteType": "AuctionsLotStanding",
              "plural": false,
              "selections": [
                {
                  "kind": "ScalarField",
                  "alias": null,
                  "name": "isHighestBidder",
                  "args": null,
                  "storageKey": null
                },
                {
                  "kind": "LinkedField",
                  "alias": null,
                  "name": "lotState",
                  "storageKey": null,
                  "args": null,
                  "concreteType": "AuctionsLotState",
                  "plural": false,
                  "selections": [
                    {
                      "kind": "ScalarField",
                      "alias": null,
                      "name": "saleId",
                      "args": null,
                      "storageKey": null
                    },
                    {
                      "kind": "ScalarField",
                      "alias": null,
                      "name": "bidCount",
                      "args": null,
                      "storageKey": null
                    },
                    {
                      "kind": "ScalarField",
                      "alias": null,
                      "name": "soldStatus",
                      "args": null,
                      "storageKey": null
                    },
                    {
                      "kind": "LinkedField",
                      "alias": null,
                      "name": "onlineAskingPrice",
                      "storageKey": null,
                      "args": null,
                      "concreteType": "AuctionsMoney",
                      "plural": false,
                      "selections": (v0/*: any*/)
                    },
                    {
                      "kind": "LinkedField",
                      "alias": null,
                      "name": "floorSellingPrice",
                      "storageKey": null,
                      "args": null,
                      "concreteType": "AuctionsMoney",
                      "plural": false,
                      "selections": (v0/*: any*/)
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
                      "kind": "ScalarField",
                      "alias": null,
                      "name": "id",
                      "args": null,
                      "storageKey": null
                    },
                    {
                      "kind": "ScalarField",
                      "alias": null,
                      "name": "lotLabel",
                      "args": null,
                      "storageKey": null
                    },
                    {
                      "kind": "LinkedField",
                      "alias": null,
                      "name": "artwork",
                      "storageKey": null,
                      "args": null,
                      "concreteType": "Artwork",
                      "plural": false,
                      "selections": [
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
                              "args": [
                                {
                                  "kind": "Literal",
                                  "name": "version",
                                  "value": "medium"
                                }
                              ],
                              "storageKey": "url(version:\"medium\")"
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
(node as any).hash = '14f36f98c0d3279d1a33ef2e5bdf587b';
export default node;
