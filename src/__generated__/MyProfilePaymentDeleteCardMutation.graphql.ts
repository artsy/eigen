/* tslint:disable */
/* eslint-disable */
/* @relayHash 33e580750db9f42aa45da10fce896613 */

import { ConcreteRequest } from "relay-runtime";
export type MyProfilePaymentDeleteCardMutationVariables = {
    internalID: string;
};
export type MyProfilePaymentDeleteCardMutationResponse = {
    readonly deleteCreditCard: {
        readonly creditCardOrError: {
            readonly mutationError?: {
                readonly error: string | null;
            } | null;
        } | null;
    } | null;
};
export type MyProfilePaymentDeleteCardMutation = {
    readonly response: MyProfilePaymentDeleteCardMutationResponse;
    readonly variables: MyProfilePaymentDeleteCardMutationVariables;
};



/*
mutation MyProfilePaymentDeleteCardMutation(
  $internalID: String!
) {
  deleteCreditCard(input: {id: $internalID}) {
    creditCardOrError {
      __typename
      ... on CreditCardMutationFailure {
        mutationError {
          error
        }
      }
    }
  }
}
*/

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "kind": "LocalArgument",
    "name": "internalID",
    "type": "String!",
    "defaultValue": null
  }
],
v1 = [
  {
    "kind": "ObjectValue",
    "name": "input",
    "fields": [
      {
        "kind": "Variable",
        "name": "id",
        "variableName": "internalID"
      }
    ]
  }
],
v2 = {
  "kind": "InlineFragment",
  "type": "CreditCardMutationFailure",
  "selections": [
    {
      "kind": "LinkedField",
      "alias": null,
      "name": "mutationError",
      "storageKey": null,
      "args": null,
      "concreteType": "GravityMutationError",
      "plural": false,
      "selections": [
        {
          "kind": "ScalarField",
          "alias": null,
          "name": "error",
          "args": null,
          "storageKey": null
        }
      ]
    }
  ]
};
return {
  "kind": "Request",
  "fragment": {
    "kind": "Fragment",
    "name": "MyProfilePaymentDeleteCardMutation",
    "type": "Mutation",
    "metadata": null,
    "argumentDefinitions": (v0/*: any*/),
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "deleteCreditCard",
        "storageKey": null,
        "args": (v1/*: any*/),
        "concreteType": "DeleteCreditCardPayload",
        "plural": false,
        "selections": [
          {
            "kind": "LinkedField",
            "alias": null,
            "name": "creditCardOrError",
            "storageKey": null,
            "args": null,
            "concreteType": null,
            "plural": false,
            "selections": [
              (v2/*: any*/)
            ]
          }
        ]
      }
    ]
  },
  "operation": {
    "kind": "Operation",
    "name": "MyProfilePaymentDeleteCardMutation",
    "argumentDefinitions": (v0/*: any*/),
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "deleteCreditCard",
        "storageKey": null,
        "args": (v1/*: any*/),
        "concreteType": "DeleteCreditCardPayload",
        "plural": false,
        "selections": [
          {
            "kind": "LinkedField",
            "alias": null,
            "name": "creditCardOrError",
            "storageKey": null,
            "args": null,
            "concreteType": null,
            "plural": false,
            "selections": [
              {
                "kind": "ScalarField",
                "alias": null,
                "name": "__typename",
                "args": null,
                "storageKey": null
              },
              (v2/*: any*/)
            ]
          }
        ]
      }
    ]
  },
  "params": {
    "operationKind": "mutation",
    "name": "MyProfilePaymentDeleteCardMutation",
    "id": "ca64d29ffc1dd3cce986a3aeef4b7b3f",
    "text": null,
    "metadata": {}
  }
};
})();
(node as any).hash = '05a4b6a44abe3b7bb9041abf172fd14e';
export default node;
