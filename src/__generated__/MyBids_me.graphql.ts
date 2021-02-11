/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type AuctionsSoldStatus = "ForSale" | "Passed" | "Sold" | "%future added value";
export type MyBids_me = {
    readonly bidders: ReadonlyArray<{
        readonly sale: {
            readonly internalID: string;
            readonly registrationStatus: {
                readonly qualifiedForBidding: boolean | null;
            } | null;
            readonly liveStartAt: string | null;
            readonly endAt: string | null;
            readonly status: string | null;
            readonly " $fragmentRefs": FragmentRefs<"SaleCard_sale">;
        } | null;
    } | null> | null;
    readonly auctionsLotStandingConnection: {
        readonly edges: ReadonlyArray<{
            readonly node: {
                readonly isHighestBidder: boolean;
                readonly lot: {
                    readonly internalID: string;
                    readonly saleId: string;
                    readonly soldStatus: AuctionsSoldStatus;
                };
                readonly saleArtwork: {
                    readonly position: number | null;
                    readonly sale: {
                        readonly internalID: string;
                        readonly liveStartAt: string | null;
                        readonly endAt: string | null;
                        readonly status: string | null;
                        readonly " $fragmentRefs": FragmentRefs<"SaleCard_sale">;
                    } | null;
                } | null;
                readonly " $fragmentRefs": FragmentRefs<"LotStatusListItem_lotStanding">;
            };
        } | null> | null;
    };
    readonly watchedLotConnection: {
        readonly edges: ReadonlyArray<{
            readonly node: {
                readonly lot: {
                    readonly internalID: string;
                };
                readonly saleArtwork: {
                    readonly internalID: string;
                    readonly position: number | null;
                    readonly sale: {
                        readonly internalID: string;
                        readonly liveStartAt: string | null;
                        readonly endAt: string | null;
                        readonly status: string | null;
                        readonly " $fragmentRefs": FragmentRefs<"SaleCard_sale">;
                    } | null;
                } | null;
                readonly " $fragmentRefs": FragmentRefs<"LotStatusListItem_lot">;
            } | null;
        } | null> | null;
    } | null;
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
},
v1 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "liveStartAt",
  "storageKey": null
},
v2 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "endAt",
  "storageKey": null
},
v3 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "status",
  "storageKey": null
},
v4 = {
  "args": null,
  "kind": "FragmentSpread",
  "name": "SaleCard_sale"
},
v5 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "position",
  "storageKey": null
},
v6 = {
  "alias": null,
  "args": null,
  "concreteType": "Sale",
  "kind": "LinkedField",
  "name": "sale",
  "plural": false,
  "selections": [
    (v0/*: any*/),
    (v1/*: any*/),
    (v2/*: any*/),
    (v3/*: any*/),
    (v4/*: any*/)
  ],
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
      "args": [
        {
          "kind": "Literal",
          "name": "active",
          "value": true
        }
      ],
      "concreteType": "Bidder",
      "kind": "LinkedField",
      "name": "bidders",
      "plural": true,
      "selections": [
        {
          "alias": null,
          "args": null,
          "concreteType": "Sale",
          "kind": "LinkedField",
          "name": "sale",
          "plural": false,
          "selections": [
            (v0/*: any*/),
            {
              "alias": null,
              "args": null,
              "concreteType": "Bidder",
              "kind": "LinkedField",
              "name": "registrationStatus",
              "plural": false,
              "selections": [
                {
                  "alias": null,
                  "args": null,
                  "kind": "ScalarField",
                  "name": "qualifiedForBidding",
                  "storageKey": null
                }
              ],
              "storageKey": null
            },
            (v1/*: any*/),
            (v2/*: any*/),
            (v3/*: any*/),
            (v4/*: any*/)
          ],
          "storageKey": null
        }
      ],
      "storageKey": "bidders(active:true)"
    },
    {
      "alias": null,
      "args": [
        {
          "kind": "Literal",
          "name": "first",
          "value": 50
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
                  "kind": "ScalarField",
                  "name": "isHighestBidder",
                  "storageKey": null
                },
                {
                  "alias": null,
                  "args": null,
                  "concreteType": "AuctionsLotState",
                  "kind": "LinkedField",
                  "name": "lot",
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
                    (v5/*: any*/),
                    (v6/*: any*/)
                  ],
                  "storageKey": null
                },
                {
                  "args": null,
                  "kind": "FragmentSpread",
                  "name": "LotStatusListItem_lotStanding"
                }
              ],
              "storageKey": null
            }
          ],
          "storageKey": null
        }
      ],
      "storageKey": "auctionsLotStandingConnection(first:50)"
    },
    {
      "alias": null,
      "args": [
        {
          "kind": "Literal",
          "name": "first",
          "value": 100
        }
      ],
      "concreteType": "LotConnection",
      "kind": "LinkedField",
      "name": "watchedLotConnection",
      "plural": false,
      "selections": [
        {
          "alias": null,
          "args": null,
          "concreteType": "LotEdge",
          "kind": "LinkedField",
          "name": "edges",
          "plural": true,
          "selections": [
            {
              "alias": null,
              "args": null,
              "concreteType": "Lot",
              "kind": "LinkedField",
              "name": "node",
              "plural": false,
              "selections": [
                {
                  "alias": null,
                  "args": null,
                  "concreteType": "AuctionsLotState",
                  "kind": "LinkedField",
                  "name": "lot",
                  "plural": false,
                  "selections": [
                    (v0/*: any*/)
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
                    (v0/*: any*/),
                    (v5/*: any*/),
                    (v6/*: any*/)
                  ],
                  "storageKey": null
                },
                {
                  "args": null,
                  "kind": "FragmentSpread",
                  "name": "LotStatusListItem_lot"
                }
              ],
              "storageKey": null
            }
          ],
          "storageKey": null
        }
      ],
      "storageKey": "watchedLotConnection(first:100)"
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
(node as any).hash = '164555dca59d74b468d367d411c1637e';
export default node;
