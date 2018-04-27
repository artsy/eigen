/* tslint:disable */

import { ConcreteRequest } from "relay-runtime";
export type UpdateConversationMutationVariables = {
    readonly input: {
        readonly conversationId?: string;
        readonly fromLastViewedMessageId?: string;
        readonly clientMutationId: string | null;
    };
};
<<<<<<< HEAD:src/__generated__/UpdateConversationMutation.graphql.ts
export type UpdateConversationMutationResponse = {
    readonly updateConversation: ({
        readonly conversation: ({
            readonly id: string | null;
            readonly from_last_viewed_message_id: string | null;
=======
export type ConfirmBidMutationResponse = {
    readonly createBidderPosition: ({
        readonly position: ({
            readonly id: string;
            readonly suggested_next_bid_cents: number | null;
>>>>>>> mp poll:src/__generated__/ConfirmBidMutation.graphql.ts
        }) | null;
    }) | null;
};



/*
mutation UpdateConversationMutation(
  $input: UpdateConversationMutationInput!
) {
<<<<<<< HEAD:src/__generated__/UpdateConversationMutation.graphql.ts
  updateConversation(input: $input) {
    conversation {
      id
      from_last_viewed_message_id
=======
  createBidderPosition(input: $input) {
    position {
      id
      suggested_next_bid_cents
>>>>>>> mp poll:src/__generated__/ConfirmBidMutation.graphql.ts
      __id
    }
  }
}
*/

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "kind": "LocalArgument",
    "name": "input",
    "type": "UpdateConversationMutationInput!",
    "defaultValue": null
  }
],
v1 = [
  {
    "kind": "LinkedField",
    "alias": null,
    "name": "updateConversation",
    "storageKey": null,
    "args": [
      {
        "kind": "Variable",
        "name": "input",
        "variableName": "input",
        "type": "UpdateConversationMutationInput!"
      }
    ],
    "concreteType": "UpdateConversationMutationPayload",
    "plural": false,
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "conversation",
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
          {
            "kind": "ScalarField",
            "alias": null,
<<<<<<< HEAD:src/__generated__/UpdateConversationMutation.graphql.ts
            "name": "from_last_viewed_message_id",
=======
            "name": "suggested_next_bid_cents",
>>>>>>> mp poll:src/__generated__/ConfirmBidMutation.graphql.ts
            "args": null,
            "storageKey": null
          },
          {
            "kind": "ScalarField",
            "alias": null,
            "name": "__id",
            "args": null,
            "storageKey": null
          }
        ]
      }
    ]
  }
];
return {
  "kind": "Request",
  "operationKind": "mutation",
<<<<<<< HEAD:src/__generated__/UpdateConversationMutation.graphql.ts
  "name": "UpdateConversationMutation",
  "id": "376ca21dfba9abce2459940af585be24",
=======
  "name": "ConfirmBidMutation",
  "id": "efae4ac745260fb43161d28a5ce9f4cf",
>>>>>>> mp poll:src/__generated__/ConfirmBidMutation.graphql.ts
  "text": null,
  "metadata": {},
  "fragment": {
    "kind": "Fragment",
    "name": "UpdateConversationMutation",
    "type": "Mutation",
    "metadata": null,
    "argumentDefinitions": v0,
    "selections": v1
  },
  "operation": {
    "kind": "Operation",
    "name": "UpdateConversationMutation",
    "argumentDefinitions": v0,
    "selections": v1
  }
};
})();
<<<<<<< HEAD:src/__generated__/UpdateConversationMutation.graphql.ts
(node as any).hash = '630d49bc88d58a296ed3b55fc479d569';
=======
(node as any).hash = 'db06d2829de6d44afd20eaee48fd3cdf';
>>>>>>> mp poll:src/__generated__/ConfirmBidMutation.graphql.ts
export default node;
