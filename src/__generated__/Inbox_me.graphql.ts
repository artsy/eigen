/* tslint:disable */

import { ConcreteFragment } from "relay-runtime";
export type Inbox_me = {
    readonly lot_standings: ReadonlyArray<({
            readonly most_recent_bid: ({
                readonly __id: string;
            }) | null;
        }) | null> | null;
    readonly conversations_existence_check: ({
        readonly edges: ReadonlyArray<({
                readonly node: ({
                    readonly id: string | null;
                }) | null;
            }) | null> | null;
    }) | null;
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
  "name": "Inbox_me",
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
          "value": 1,
          "type": "Int"
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
                  "name": "id",
                  "args": null,
                  "storageKey": null
                },
                v0
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
    },
    v0
  ]
};
})();
(node as any).hash = 'c9ffaa700d881c26db63082d921448bf';
export default node;
