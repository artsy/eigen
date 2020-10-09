/* tslint:disable */
/* eslint-disable */
// @ts-nocheck
/* @relayHash ca64d29ffc1dd3cce986a3aeef4b7b3f */

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
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "internalID"
  }
],
v1 = [
  {
    "fields": [
      {
        "kind": "Variable",
        "name": "id",
        "variableName": "internalID"
      }
    ],
    "kind": "ObjectValue",
    "name": "input"
  }
],
v2 = {
  "kind": "InlineFragment",
  "selections": [
    {
      "alias": null,
      "args": null,
      "concreteType": "GravityMutationError",
      "kind": "LinkedField",
      "name": "mutationError",
      "plural": false,
      "selections": [
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "error",
          "storageKey": null
        }
      ],
      "storageKey": null
    }
  ],
  "type": "CreditCardMutationFailure",
  "abstractKey": null
};
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "MyProfilePaymentDeleteCardMutation",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": "DeleteCreditCardPayload",
        "kind": "LinkedField",
        "name": "deleteCreditCard",
        "plural": false,
        "selections": [
          {
            "alias": null,
            "args": null,
            "concreteType": null,
            "kind": "LinkedField",
            "name": "creditCardOrError",
            "plural": false,
            "selections": [
              (v2/*: any*/)
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
    "name": "MyProfilePaymentDeleteCardMutation",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": "DeleteCreditCardPayload",
        "kind": "LinkedField",
        "name": "deleteCreditCard",
        "plural": false,
        "selections": [
          {
            "alias": null,
            "args": null,
            "concreteType": null,
            "kind": "LinkedField",
            "name": "creditCardOrError",
            "plural": false,
            "selections": [
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "__typename",
                "storageKey": null
              },
              (v2/*: any*/)
            ],
            "storageKey": null
          }
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "id": "ca64d29ffc1dd3cce986a3aeef4b7b3f",
    "metadata": {},
    "name": "MyProfilePaymentDeleteCardMutation",
    "operationKind": "mutation",
    "text": null
  }
};
})();
(node as any).hash = '05a4b6a44abe3b7bb9041abf172fd14e';
export default node;
