/* tslint:disable */

import { ConcreteRequest } from "relay-runtime";
export type UpdateConversationMutationInput = {
    readonly conversationId: string;
    readonly fromLastViewedMessageId: string;
    readonly clientMutationId?: string | null;
};
export type UpdateConversationMutationVariables = {
    input: UpdateConversationMutationInput;
};
export type UpdateConversationMutationResponse = {
    readonly updateConversation: {
        readonly conversation: {
            readonly internalID: string | null;
            readonly from_last_viewed_message_id: string | null;
        } | null;
    } | null;
};
export type UpdateConversationMutation = {
    readonly response: UpdateConversationMutationResponse;
    readonly variables: UpdateConversationMutationVariables;
};



/*
mutation UpdateConversationMutation(
  $input: UpdateConversationMutationInput!
) {
  updateConversation(input: $input) {
    conversation {
      internalID
      from_last_viewed_message_id: fromLastViewedMessageID
      id
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
    "kind": "Variable",
    "name": "input",
    "variableName": "input"
  }
],
v2 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "internalID",
  "args": null,
  "storageKey": null
},
v3 = {
  "kind": "ScalarField",
  "alias": "from_last_viewed_message_id",
  "name": "fromLastViewedMessageID",
  "args": null,
  "storageKey": null
};
return {
  "kind": "Request",
  "fragment": {
    "kind": "Fragment",
    "name": "UpdateConversationMutation",
    "type": "Mutation",
    "metadata": null,
    "argumentDefinitions": (v0/*: any*/),
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "updateConversation",
        "storageKey": null,
        "args": (v1/*: any*/),
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
              (v2/*: any*/),
              (v3/*: any*/)
            ]
          }
        ]
      }
    ]
  },
  "operation": {
    "kind": "Operation",
    "name": "UpdateConversationMutation",
    "argumentDefinitions": (v0/*: any*/),
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "updateConversation",
        "storageKey": null,
        "args": (v1/*: any*/),
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
              (v2/*: any*/),
              (v3/*: any*/),
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
      }
    ]
  },
  "params": {
    "operationKind": "mutation",
    "name": "UpdateConversationMutation",
    "id": "7b6a7cadd05092bf22e9f9cba84e0a23",
    "text": null,
    "metadata": {}
  }
};
})();
(node as any).hash = '81599675babd532c54fc6eb4de8b3371';
export default node;
