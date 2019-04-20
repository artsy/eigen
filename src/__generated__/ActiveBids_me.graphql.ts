/* tslint:disable */

import { ReaderFragment } from "relay-runtime";
import { ActiveBid_bid$ref } from "./ActiveBid_bid.graphql";
declare const _ActiveBids_me$ref: unique symbol;
export type ActiveBids_me$ref = typeof _ActiveBids_me$ref;
export type ActiveBids_me = {
    readonly lot_standings: ReadonlyArray<({
        readonly most_recent_bid: ({
            readonly __id: string;
        }) | null;
        readonly " $fragmentRefs": ActiveBid_bid$ref;
    }) | null> | null;
    readonly " $refType": ActiveBids_me$ref;
};



const node: ReaderFragment = {
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
              "name": "__id",
              "args": null,
              "storageKey": null
            }
          ]
        },
        {
          "kind": "FragmentSpread",
          "name": "ActiveBid_bid",
          "args": null
        }
      ]
    }
  ]
};
(node as any).hash = '7a308d9363d144841752a8266770a87e';
export default node;
