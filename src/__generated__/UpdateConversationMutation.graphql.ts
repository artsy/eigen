/* tslint:disable */

import { ConcreteRequest } from "relay-runtime";
export type UpdateConversationMutationVariables = {
    readonly input: {
        readonly conversationId?: string;
        readonly fromLastViewedMessageId?: string;
        readonly clientMutationId: string | null;
    };
};
export type UpdateConversationMutationResponse = {
    readonly updateConversation: ({
        readonly conversation: ({
            readonly id: string | null;
            readonly from_last_viewed_message_id: string | null;
        }) | null;
    }) | null;
};



/*
mutation UpdateConversationMutation(
  $input: UpdateConversationMutationInput!
) {
  updateConversation(input: $input) {
    conversation {
      id
      from_last_viewed_message_id
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
            "name": "from_last_viewed_message_id",
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
        ],
        "idField": "__id"
      }
    ]
  }
];
return {
  "kind": "Request",
  "operationKind": "mutation",
  "name": "UpdateConversationMutation",
  "id": null,
  "text": "mutation UpdateConversationMutation(\n  $input: UpdateConversationMutationInput!\n) {\n  updateConversation(input: $input) {\n    conversation {\n      id\n      from_last_viewed_message_id\n      __id\n    }\n  }\n}\n",
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
(node as any).hash = '630d49bc88d58a296ed3b55fc479d569';
export default node;
