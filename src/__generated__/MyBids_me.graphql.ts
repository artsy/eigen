/* tslint:disable */
/* eslint-disable */

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type AuctionsSoldStatus = "ForSale" | "Passed" | "Sold" | "%future added value";
export type MyBids_me = {
    readonly auctionsLotStandingConnection: {
        readonly edges: ReadonlyArray<{
            readonly node: {
                readonly lotState: {
                    readonly internalID: string;
                    readonly saleId: string;
                    readonly soldStatus: AuctionsSoldStatus;
                };
                readonly saleArtwork: {
                    readonly sale: {
                        readonly internalID: string;
                        readonly displayTimelyAt: string | null;
                        readonly " $fragmentRefs": FragmentRefs<"SaleCard_sale">;
                    } | null;
                } | null;
                readonly " $fragmentRefs": FragmentRefs<"ActiveLot_lotStanding" | "RecentlyClosedLot_lotStanding">;
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
var v0 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "internalID",
  "args": null,
  "storageKey": null
};
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
                  "kind": "LinkedField",
                  "alias": null,
                  "name": "lotState",
                  "storageKey": null,
                  "args": null,
                  "concreteType": "AuctionsLotState",
                  "plural": false,
                  "selections": [
                    (v0/*: any*/),
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
                      "name": "soldStatus",
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
                      "name": "sale",
                      "storageKey": null,
                      "args": null,
                      "concreteType": "Sale",
                      "plural": false,
                      "selections": [
                        (v0/*: any*/),
                        {
                          "kind": "ScalarField",
                          "alias": null,
                          "name": "displayTimelyAt",
                          "args": null,
                          "storageKey": null
                        },
                        {
                          "kind": "FragmentSpread",
                          "name": "SaleCard_sale",
                          "args": null
                        }
                      ]
                    }
                  ]
                },
                {
                  "kind": "FragmentSpread",
                  "name": "ActiveLot_lotStanding",
                  "args": null
                },
                {
                  "kind": "FragmentSpread",
                  "name": "RecentlyClosedLot_lotStanding",
                  "args": null
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
(node as any).hash = 'd858b0f8f67f8472a0a1ed980665501a';
export default node;
