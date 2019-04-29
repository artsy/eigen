/* tslint:disable */

import { ConcreteFragment } from "relay-runtime";
import { ActiveBids_me$ref } from "./ActiveBids_me.graphql";
import { Conversations_me$ref } from "./Conversations_me.graphql";
declare const _Inbox_me$ref: unique symbol;
export type Inbox_me$ref = typeof _Inbox_me$ref;
export type Inbox_me = {
    readonly lot_standings: ReadonlyArray<({
        readonly most_recent_bid: ({
            readonly id: string;
        }) | null;
    }) | null> | null;
    readonly conversations_existence_check: ({
        readonly edges: ReadonlyArray<({
            readonly node: ({
                readonly internalID: string;
            }) | null;
        }) | null> | null;
    }) | null;
    readonly " $fragmentRefs": Conversations_me$ref & ActiveBids_me$ref;
    readonly " $refType": Inbox_me$ref;
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
                  "name": "internalID",
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
(node as any).hash = '6f84d25799993678ad080bc08b359ca6';
export default node;
