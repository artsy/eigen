/* tslint:disable */
/* eslint-disable */
/* @relayHash ae31046d7b9a772cba2d2dc5a2f1da13 */

import { ConcreteRequest } from "relay-runtime";
export type CreditCardInput = {
    clientMutationId?: string | null;
    oneTimeUse?: boolean | null;
    token: string;
};
export type MyProfilePaymentNewCreditCardSaveCardMutationVariables = {
    input: CreditCardInput;
};
export type MyProfilePaymentNewCreditCardSaveCardMutationResponse = {
    readonly createCreditCard: {
        readonly creditCardOrError: {
            readonly creditCard?: {
                readonly internalID: string;
            } | null;
            readonly mutationError?: {
                readonly detail: string | null;
                readonly error: string | null;
                readonly message: string | null;
            } | null;
        } | null;
    } | null;
};
export type MyProfilePaymentNewCreditCardSaveCardMutation = {
    readonly response: MyProfilePaymentNewCreditCardSaveCardMutationResponse;
    readonly variables: MyProfilePaymentNewCreditCardSaveCardMutationVariables;
};



/*
mutation MyProfilePaymentNewCreditCardSaveCardMutation(
  $input: CreditCardInput!
) {
  createCreditCard(input: $input) {
    creditCardOrError {
      __typename
      ... on CreditCardMutationSuccess {
        creditCard {
          internalID
          id
        }
      }
      ... on CreditCardMutationFailure {
        mutationError {
          detail
          error
          message
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
    "name": "input",
    "type": "CreditCardInput!",
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
          "name": "detail",
          "args": null,
          "storageKey": null
        },
        {
          "kind": "ScalarField",
          "alias": null,
          "name": "error",
          "args": null,
          "storageKey": null
        },
        {
          "kind": "ScalarField",
          "alias": null,
          "name": "message",
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
    "name": "MyProfilePaymentNewCreditCardSaveCardMutation",
    "type": "Mutation",
    "metadata": null,
    "argumentDefinitions": (v0/*: any*/),
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "createCreditCard",
        "storageKey": null,
        "args": (v1/*: any*/),
        "concreteType": "CreditCardPayload",
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
                "kind": "InlineFragment",
                "type": "CreditCardMutationSuccess",
                "selections": [
                  {
                    "kind": "LinkedField",
                    "alias": null,
                    "name": "creditCard",
                    "storageKey": null,
                    "args": null,
                    "concreteType": "CreditCard",
                    "plural": false,
                    "selections": [
                      (v2/*: any*/)
                    ]
                  }
                ]
              },
              (v3/*: any*/)
            ]
          }
        ]
      }
    ]
  },
  "operation": {
    "kind": "Operation",
    "name": "MyProfilePaymentNewCreditCardSaveCardMutation",
    "argumentDefinitions": (v0/*: any*/),
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "createCreditCard",
        "storageKey": null,
        "args": (v1/*: any*/),
        "concreteType": "CreditCardPayload",
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
              {
                "kind": "InlineFragment",
                "type": "CreditCardMutationSuccess",
                "selections": [
                  {
                    "kind": "LinkedField",
                    "alias": null,
                    "name": "creditCard",
                    "storageKey": null,
                    "args": null,
                    "concreteType": "CreditCard",
                    "plural": false,
                    "selections": [
                      (v2/*: any*/),
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
              (v3/*: any*/)
            ]
          }
        ]
      }
    ]
  },
  "params": {
    "operationKind": "mutation",
    "name": "MyProfilePaymentNewCreditCardSaveCardMutation",
    "id": "f6deb1604a0237ac4d743cf61b23a0d1",
    "text": null,
    "metadata": {}
  }
};
})();
(node as any).hash = '15f727584204bb3ae737b447530c2573';
export default node;
