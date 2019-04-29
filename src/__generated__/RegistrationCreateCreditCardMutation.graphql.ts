/* tslint:disable */

import { ConcreteRequest } from "relay-runtime";
export type CreditCardInput = {
    readonly token: string;
    readonly oneTimeUse?: boolean | null;
    readonly clientMutationId?: string | null;
};
export type RegistrationCreateCreditCardMutationVariables = {
    readonly input: CreditCardInput;
};
export type RegistrationCreateCreditCardMutationResponse = {
    readonly createCreditCard: ({
        readonly creditCardOrError: ({
            readonly creditCard?: ({
                readonly gravityID: string;
                readonly brand: string;
                readonly name: string | null;
                readonly last_digits: string;
                readonly expiration_month: number;
                readonly expiration_year: number;
            }) | null;
            readonly mutationError?: ({
                readonly type: string | null;
                readonly message: string | null;
                readonly detail: string | null;
            }) | null;
        }) | null;
    }) | null;
};
export type RegistrationCreateCreditCardMutation = {
    readonly response: RegistrationCreateCreditCardMutationResponse;
    readonly variables: RegistrationCreateCreditCardMutationVariables;
};



/*
mutation RegistrationCreateCreditCardMutation(
  $input: CreditCardInput!
) {
  createCreditCard(input: $input) {
    creditCardOrError {
      __typename
      ... on CreditCardMutationSuccess {
        creditCard {
          gravityID
          brand
          name
          last_digits
          expiration_month
          expiration_year
          __id: id
        }
      }
      ... on CreditCardMutationFailure {
        mutationError {
          type
          message
          detail
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
    "variableName": "input",
    "type": "CreditCardInput!"
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
          "name": "type",
          "args": null,
          "storageKey": null
        },
        {
          "kind": "ScalarField",
          "alias": null,
          "name": "message",
          "args": null,
          "storageKey": null
        },
        {
          "kind": "ScalarField",
          "alias": null,
          "name": "detail",
          "args": null,
          "storageKey": null
        }
      ]
    }
  ]
},
v3 = {
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
        {
          "kind": "ScalarField",
          "alias": null,
          "name": "gravityID",
          "args": null,
          "storageKey": null
        },
        {
          "kind": "ScalarField",
          "alias": null,
          "name": "brand",
          "args": null,
          "storageKey": null
        },
        {
          "kind": "ScalarField",
          "alias": null,
          "name": "name",
          "args": null,
          "storageKey": null
        },
        {
          "kind": "ScalarField",
          "alias": null,
          "name": "last_digits",
          "args": null,
          "storageKey": null
        },
        {
          "kind": "ScalarField",
          "alias": null,
          "name": "expiration_month",
          "args": null,
          "storageKey": null
        },
        {
          "kind": "ScalarField",
          "alias": null,
          "name": "expiration_year",
          "args": null,
          "storageKey": null
        },
        {
          "kind": "ScalarField",
          "alias": "__id",
          "name": "id",
          "args": null,
          "storageKey": null
        }
      ]
    }
  ]
};
return {
  "kind": "Request",
  "operationKind": "mutation",
  "name": "RegistrationCreateCreditCardMutation",
  "id": null,
  "text": "mutation RegistrationCreateCreditCardMutation(\n  $input: CreditCardInput!\n) {\n  createCreditCard(input: $input) {\n    creditCardOrError {\n      __typename\n      ... on CreditCardMutationSuccess {\n        creditCard {\n          gravityID\n          brand\n          name\n          last_digits\n          expiration_month\n          expiration_year\n          __id: id\n        }\n      }\n      ... on CreditCardMutationFailure {\n        mutationError {\n          type\n          message\n          detail\n        }\n      }\n    }\n  }\n}\n",
  "metadata": {},
  "fragment": {
    "kind": "Fragment",
    "name": "RegistrationCreateCreditCardMutation",
    "type": "Mutation",
    "metadata": null,
    "argumentDefinitions": v0,
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "createCreditCard",
        "storageKey": null,
        "args": v1,
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
              v2,
              v3
            ]
          }
        ]
      }
    ]
  },
  "operation": {
    "kind": "Operation",
    "name": "RegistrationCreateCreditCardMutation",
    "argumentDefinitions": v0,
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "createCreditCard",
        "storageKey": null,
        "args": v1,
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
              v2,
              v3
            ]
          }
        ]
      }
    ]
  }
};
})();
(node as any).hash = '81d9bbd61ea9c9e8bfcf0f9015d38861';
export default node;
