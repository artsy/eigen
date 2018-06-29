/* tslint:disable */

import { ConcreteRequest } from "relay-runtime";
export type RegistrationCreateCreditCardMutationVariables = {
    readonly input: {
        readonly token?: string;
        readonly clientMutationId: string | null;
    };
};
export type RegistrationCreateCreditCardMutationResponse = {
    readonly createCreditCard: ({
        readonly credit_card: ({
            readonly id: string;
            readonly brand: string | null;
            readonly name: string | null;
            readonly last_digits: string | null;
            readonly expiration_month: number | null;
            readonly expiration_year: number | null;
        }) | null;
    }) | null;
};



/*
mutation RegistrationCreateCreditCardMutation(
  $input: CreditCardInput!
) {
  createCreditCard(input: $input) {
    credit_card {
      id
      brand
      name
      last_digits
      expiration_month
      expiration_year
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
    "type": "CreditCardInput!",
    "defaultValue": null
  }
],
v1 = [
  {
    "kind": "LinkedField",
    "alias": null,
    "name": "createCreditCard",
    "storageKey": null,
    "args": [
      {
        "kind": "Variable",
        "name": "input",
        "variableName": "input",
        "type": "CreditCardInput!"
      }
    ],
    "concreteType": "CreditCardPayload",
    "plural": false,
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "credit_card",
        "storageKey": null,
        "args": null,
        "concreteType": "CreditCard",
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
  "name": "RegistrationCreateCreditCardMutation",
  "id": "b3e540bc0741b8423a1200b7cacdc55c",
  "text": null,
  "metadata": {},
  "fragment": {
    "kind": "Fragment",
    "name": "RegistrationCreateCreditCardMutation",
    "type": "Mutation",
    "metadata": null,
    "argumentDefinitions": v0,
    "selections": v1
  },
  "operation": {
    "kind": "Operation",
    "name": "RegistrationCreateCreditCardMutation",
    "argumentDefinitions": v0,
    "selections": v1
  }
};
})();
(node as any).hash = '3ce27f5f46530a490b30342fff2c260a';
export default node;
