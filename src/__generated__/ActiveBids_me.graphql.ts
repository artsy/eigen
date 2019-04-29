/* tslint:disable */

import { ConcreteFragment } from "relay-runtime";
import { ActiveBid_bid$ref } from "./ActiveBid_bid.graphql";
declare const _ActiveBids_me$ref: unique symbol;
export type ActiveBids_me$ref = typeof _ActiveBids_me$ref;
export type ActiveBids_me = {
    readonly lot_standings: ReadonlyArray<({
        readonly most_recent_bid: ({
            readonly id: string;
        }) | null;
        readonly " $fragmentRefs": ActiveBid_bid$ref;
    }) | null> | null;
    readonly " $refType": ActiveBids_me$ref;
};



const node: ConcreteFragment = (function(){
var v0 = {
  "kind": "ScalarField",
  "alias": "__id",
  "name": "id",
  "args": null,
  "storageKey": null
};
return {
  "kind": "Fragment",
  "name": "ActiveBids_me",
  "type": "Me",
  "metadata": null,
  "argumentDefinitions": [],
  "selections": [
    {
      "kind": "LinkedField",
      "alias": null,
      "name": "lot_standings",
      "storageKey": "lot_standings(live:true)",
      "args": [
        {
          "kind": "Literal",
          "name": "live",
          "value": true,
          "type": "Boolean"
        }
      ],
      "concreteType": "LotStanding",
      "plural": true,
      "selections": [
        {
          "kind": "LinkedField",
          "alias": null,
          "name": "most_recent_bid",
          "storageKey": null,
          "args": null,
          "concreteType": "BidderPosition",
          "plural": false,
          "selections": [
            {
              "kind": "ScalarField",
              "alias": null,
              "name": "id",
              "args": null,
              "storageKey": null
            },
            v0
          ]
        },
        {
          "kind": "FragmentSpread",
          "name": "ActiveBid_bid",
          "args": null
        }
      ]
    },
    v0
  ]
};
})();
(node as any).hash = '177e8644ddfa2c74520c46ff2adb0eb5';
export default node;
