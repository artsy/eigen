/* tslint:disable */

import { ConcreteFragment } from "relay-runtime";
export type BidResult_sale_artwork = {
    readonly minimum_next_bid: ({
        readonly amount: string | null;
        readonly cents: number | null;
        readonly display: string | null;
    }) | null;
    readonly sale: ({
        readonly live_start_at: string | null;
        readonly end_at: string | null;
    }) | null;
    readonly increments: ReadonlyArray<({
            readonly display: string | null;
            readonly cents: number | null;
        }) | null> | null;
};



const node: ConcreteFragment = (function(){
var v0 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "cents",
  "args": null,
  "storageKey": null
},
v1 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "display",
  "args": null,
  "storageKey": null
},
v2 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "__id",
  "args": null,
  "storageKey": null
};
return {
  "kind": "Fragment",
  "name": "BidResult_sale_artwork",
  "type": "SaleArtwork",
  "metadata": null,
  "argumentDefinitions": [],
  "selections": [
    {
      "kind": "LinkedField",
      "alias": null,
      "name": "minimum_next_bid",
      "storageKey": null,
      "args": null,
      "concreteType": "SaleArtworkMinimumNextBid",
      "plural": false,
      "selections": [
        {
          "kind": "ScalarField",
          "alias": null,
          "name": "amount",
          "args": null,
          "storageKey": null
        },
        v0,
        v1
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
          "name": "live_start_at",
          "args": null,
          "storageKey": null
        },
        {
          "kind": "ScalarField",
          "alias": null,
          "name": "end_at",
          "args": null,
          "storageKey": null
        },
        v2
      ]
    },
    {
      "kind": "LinkedField",
      "alias": null,
      "name": "increments",
      "storageKey": null,
      "args": null,
      "concreteType": "BidIncrementsFormatted",
      "plural": true,
      "selections": [
        v1,
        v0
      ]
    },
    v2
  ]
};
})();
(node as any).hash = '49f5c71ce5914f28f5d7cdb6e0db6a47';
export default node;
