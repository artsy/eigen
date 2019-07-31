/* tslint:disable */

import { ReaderFragment } from "relay-runtime";
import { ActiveBids_me$ref } from "./ActiveBids_me.graphql";
import { Conversations_me$ref } from "./Conversations_me.graphql";
declare const _Inbox_me$ref: unique symbol;
export type Inbox_me$ref = typeof _Inbox_me$ref;
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
    readonly " $fragmentRefs": Conversations_me$ref & ActiveBids_me$ref;
    readonly " $refType": Inbox_me$ref;
};



const node: ReaderFragment = {
  "kind": "Fragment",
  "name": "Inbox_me",
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
        }
      ]
    },
    {
      "kind": "LinkedField",
      "alias": "conversations_existence_check",
      "name": "conversations",
      "storageKey": "conversations(first:1)",
      "args": [
        {
          "kind": "Literal",
          "name": "first",
          "value": 1
        }
      ],
      "concreteType": "ConversationConnection",
      "plural": false,
      "selections": [
        {
          "kind": "LinkedField",
          "alias": null,
          "name": "edges",
          "storageKey": null,
          "args": null,
          "concreteType": "ConversationEdge",
          "plural": true,
          "selections": [
            {
              "kind": "LinkedField",
              "alias": null,
              "name": "node",
              "storageKey": null,
              "args": null,
              "concreteType": "Conversation",
              "plural": false,
              "selections": [
                {
                  "kind": "ScalarField",
                  "alias": null,
                  "name": "internalID",
                  "args": null,
                  "storageKey": null
                }
              ]
            }
          ]
        }
      ]
    },
    {
      "kind": "FragmentSpread",
      "name": "Conversations_me",
      "args": null
    },
    {
      "kind": "FragmentSpread",
      "name": "ActiveBids_me",
      "args": null
    }
  ]
};
(node as any).hash = 'fe3aafbe4ec7bfd5de49c9408cf29cca';
export default node;
