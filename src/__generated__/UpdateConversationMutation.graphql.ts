/* tslint:disable */
/* eslint-disable */
// @ts-nocheck
/* @relayHash 7b6a7cadd05092bf22e9f9cba84e0a23 */

import { ConcreteRequest } from "relay-runtime";
export type UpdateConversationMutationInput = {
    clientMutationId?: string | null;
    conversationId: string;
    fromLastViewedMessageId: string;
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
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "input"
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
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "internalID",
  "storageKey": null
},
v3 = {
  "alias": "from_last_viewed_message_id",
  "args": null,
  "kind": "ScalarField",
  "name": "fromLastViewedMessageID",
  "storageKey": null
};
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "UpdateConversationMutation",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": "UpdateConversationMutationPayload",
        "kind": "LinkedField",
        "name": "updateConversation",
        "plural": false,
        "selections": [
          {
            "alias": null,
            "args": null,
            "concreteType": "Conversation",
            "kind": "LinkedField",
            "name": "conversation",
            "plural": false,
            "selections": [
              (v2/*: any*/),
              (v3/*: any*/)
            ],
            "storageKey": null
          }
        ],
        "storageKey": null
      }
    ],
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "UpdateConversationMutation",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": "UpdateConversationMutationPayload",
        "kind": "LinkedField",
        "name": "updateConversation",
        "plural": false,
        "selections": [
          {
            "alias": null,
            "args": null,
            "concreteType": "Conversation",
            "kind": "LinkedField",
            "name": "conversation",
            "plural": false,
            "selections": [
              (v2/*: any*/),
              (v3/*: any*/),
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
        "storageKey": null
      }
    ]
  },
  "params": {
    "id": "7b6a7cadd05092bf22e9f9cba84e0a23",
    "metadata": {},
    "name": "UpdateConversationMutation",
    "operationKind": "mutation",
    "text": null
  }
};
})();
(node as any).hash = '81599675babd532c54fc6eb4de8b3371';
export default node;
