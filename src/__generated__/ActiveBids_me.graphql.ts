/* tslint:disable */

import { ReaderFragment } from "relay-runtime";
import { ActiveBid_bid$ref } from "./ActiveBid_bid.graphql";
declare const _ActiveBids_me$ref: unique symbol;
export type ActiveBids_me$ref = typeof _ActiveBids_me$ref;
export type ActiveBids_me = {
    readonly lot_standings: ReadonlyArray<{
        readonly most_recent_bid: {
            readonly id: string;
        } | null;
        readonly " $fragmentRefs": ActiveBid_bid$ref;
    } | null> | null;
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
      "alias": "lot_standings",
      "name": "lotStandings",
      "storageKey": "lotStandings(live:true)",
      "args": [
        {
          "kind": "Literal",
          "name": "live",
          "value": true
        }
      ],
      "concreteType": "LotStanding",
      "plural": true,
      "selections": [
        {
          "kind": "LinkedField",
          "alias": "most_recent_bid",
          "name": "mostRecentBid",
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
(node as any).hash = 'c3631fca7fb83f55a6d2695da1956e88';
export default node;
