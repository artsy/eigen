/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type InboxOld_me = {
    readonly lot_standings: ReadonlyArray<{
        readonly most_recent_bid: {
            readonly id: string;
        } | null;
    } | null> | null;
    readonly conversations_existence_check: {
        readonly edges: ReadonlyArray<{
            readonly node: {
                readonly internalID: string | null;
            } | null;
        } | null> | null;
    } | null;
    readonly " $fragmentRefs": FragmentRefs<"Conversations_me" | "ActiveBids_me">;
    readonly " $refType": "InboxOld_me";
};
export type InboxOld_me$data = InboxOld_me;
export type InboxOld_me$key = {
    readonly " $data"?: InboxOld_me$data;
    readonly " $fragmentRefs": FragmentRefs<"InboxOld_me">;
};



const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "InboxOld_me",
  "selections": [
    {
      "alias": "lot_standings",
      "args": [
        {
          "kind": "Literal",
          "name": "live",
          "value": true
        }
      ],
      "concreteType": "LotStanding",
      "kind": "LinkedField",
      "name": "lotStandings",
      "plural": true,
      "selections": [
        {
          "alias": "most_recent_bid",
          "args": null,
          "concreteType": "BidderPosition",
          "kind": "LinkedField",
          "name": "mostRecentBid",
          "plural": false,
          "selections": [
            {
              "alias": null,
              "args": null,
              "kind": "ScalarField",
              "name": "id",
              "storageKey": null
            }
          ],
          "storageKey": null
        }
      ],
      "storageKey": "lotStandings(live:true)"
    },
    {
      "alias": "conversations_existence_check",
      "args": [
        {
          "kind": "Literal",
          "name": "first",
          "value": 1
        }
      ],
      "concreteType": "ConversationConnection",
      "kind": "LinkedField",
      "name": "conversationsConnection",
      "plural": false,
      "selections": [
        {
          "alias": null,
          "args": null,
          "concreteType": "ConversationEdge",
          "kind": "LinkedField",
          "name": "edges",
          "plural": true,
          "selections": [
            {
              "alias": null,
              "args": null,
              "concreteType": "Conversation",
              "kind": "LinkedField",
              "name": "node",
              "plural": false,
              "selections": [
                {
                  "alias": null,
                  "args": null,
                  "kind": "ScalarField",
                  "name": "internalID",
                  "storageKey": null
                }
              ],
              "storageKey": null
            }
          ],
          "storageKey": null
        }
      ],
      "storageKey": "conversationsConnection(first:1)"
    },
    {
      "args": null,
      "kind": "FragmentSpread",
      "name": "Conversations_me"
    },
    {
      "args": null,
      "kind": "FragmentSpread",
      "name": "ActiveBids_me"
    }
  ],
  "type": "Me",
  "abstractKey": null
};
(node as any).hash = '5a2d576a87c5e38497201071a392af04';
export default node;
