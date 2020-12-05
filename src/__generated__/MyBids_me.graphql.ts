/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type AuctionsSoldStatus = "ForSale" | "Passed" | "Sold" | "%future added value";
export type MyBids_me = {
    readonly identityVerified: boolean | null;
    readonly auctionsLotStandingConnection: {
        readonly edges: ReadonlyArray<{
            readonly node: {
                readonly lotState: {
                    readonly internalID: string;
                    readonly saleId: string;
                    readonly soldStatus: AuctionsSoldStatus;
                };
                readonly saleArtwork: {
                    readonly position: number | null;
                    readonly sale: {
                        readonly requireIdentityVerification: boolean | null;
                        readonly internalID: string;
                        readonly liveStartAt: string | null;
                        readonly endAt: string | null;
                        readonly status: string | null;
                        readonly " $fragmentRefs": FragmentRefs<"SaleCard_sale">;
                    } | null;
                } | null;
                readonly " $fragmentRefs": FragmentRefs<"ActiveLot_lotStanding" | "ClosedLot_lotStanding">;
            };
        } | null> | null;
    };
    readonly " $fragmentRefs": FragmentRefs<"SaleCard_me">;
    readonly " $refType": "MyBids_me";
};
export type MyBids_me$data = MyBids_me;
export type MyBids_me$key = {
    readonly " $data"?: MyBids_me$data;
    readonly " $fragmentRefs": FragmentRefs<"MyBids_me">;
};



const node: ReaderFragment = (function(){
var v0 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "internalID",
  "storageKey": null
};
return {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "MyBids_me",
  "selections": [
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "identityVerified",
      "storageKey": null
    },
    {
      "alias": null,
      "args": [
        {
          "kind": "Literal",
          "name": "first",
          "value": 25
        }
      ],
      "concreteType": "AuctionsLotStandingConnection",
      "kind": "LinkedField",
      "name": "auctionsLotStandingConnection",
      "plural": false,
      "selections": [
        {
          "alias": null,
          "args": null,
          "concreteType": "AuctionsLotStandingEdge",
          "kind": "LinkedField",
          "name": "edges",
          "plural": true,
          "selections": [
            {
              "alias": null,
              "args": null,
              "concreteType": "AuctionsLotStanding",
              "kind": "LinkedField",
              "name": "node",
              "plural": false,
              "selections": [
                {
                  "alias": null,
                  "args": null,
                  "concreteType": "AuctionsLotState",
                  "kind": "LinkedField",
                  "name": "lotState",
                  "plural": false,
                  "selections": [
                    (v0/*: any*/),
                    {
                      "alias": null,
                      "args": null,
                      "kind": "ScalarField",
                      "name": "saleId",
                      "storageKey": null
                    },
                    {
                      "alias": null,
                      "args": null,
                      "kind": "ScalarField",
                      "name": "soldStatus",
                      "storageKey": null
                    }
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
                      "kind": "ScalarField",
                      "name": "position",
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
                          "name": "requireIdentityVerification",
                          "storageKey": null
                        },
                        (v0/*: any*/),
                        {
                          "alias": null,
                          "args": null,
                          "kind": "ScalarField",
                          "name": "liveStartAt",
                          "storageKey": null
                        },
                        {
                          "alias": null,
                          "args": null,
                          "kind": "ScalarField",
                          "name": "endAt",
                          "storageKey": null
                        },
                        {
                          "alias": null,
                          "args": null,
                          "kind": "ScalarField",
                          "name": "status",
                          "storageKey": null
                        },
                        {
                          "args": null,
                          "kind": "FragmentSpread",
                          "name": "SaleCard_sale"
                        }
                      ],
                      "storageKey": null
                    }
                  ],
                  "storageKey": null
                },
                {
                  "args": null,
                  "kind": "FragmentSpread",
                  "name": "ActiveLot_lotStanding"
                },
                {
                  "args": null,
                  "kind": "FragmentSpread",
                  "name": "ClosedLot_lotStanding"
                }
              ],
              "storageKey": null
            }
          ],
          "storageKey": null
        }
      ],
      "storageKey": "auctionsLotStandingConnection(first:25)"
    },
    {
      "args": null,
      "kind": "FragmentSpread",
      "name": "SaleCard_me"
    }
  ],
  "type": "Me",
  "abstractKey": null
};
})();
(node as any).hash = '06c46f0d06cd82d3d30c22e83d99572c';
export default node;
