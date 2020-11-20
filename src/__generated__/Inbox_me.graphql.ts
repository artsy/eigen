/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type Inbox_me = {
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
    readonly " $fragmentRefs": FragmentRefs<"Conversations_me" | "ActiveBids_me" | "MyBids_me">;
    readonly " $refType": "Inbox_me";
};
export type Inbox_me$data = Inbox_me;
export type Inbox_me$key = {
    readonly " $data"?: Inbox_me$data;
    readonly " $fragmentRefs": FragmentRefs<"Inbox_me">;
};



const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "Inbox_me",
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
    },
    {
      "args": null,
      "kind": "FragmentSpread",
      "name": "MyBids_me"
    }
  ],
  "type": "Me",
  "abstractKey": null
};
(node as any).hash = '4dbc88516d60bbd83176dd0e3e241405';
export default node;
