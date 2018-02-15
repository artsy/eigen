/* tslint:disable */

import { ConcreteFragment } from "relay-runtime";
export type ActiveBids_me = {
    readonly lot_standings: ReadonlyArray<({
            readonly most_recent_bid: ({
                readonly __id: string;
            }) | null;
        }) | null> | null;
};



const node: ConcreteFragment = (function(){
var v0 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "__id",
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
(node as any).hash = '7a308d9363d144841752a8266770a87e';
export default node;
