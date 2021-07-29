/* tslint:disable */
/* eslint-disable */
// @ts-nocheck
/* @relayHash 1b9e47d6d72070bbc2212342174e93d4 */

import { ConcreteRequest } from "relay-runtime";
export type UpdateUserDefaultAddressInput = {
    clientMutationId?: string | null;
    userAddressID: string;
};
export type setAsDefaultAddressMutationVariables = {
    input: UpdateUserDefaultAddressInput;
};
export type setAsDefaultAddressMutationResponse = {
    readonly updateUserDefaultAddress: {
        readonly userAddressOrErrors: {
            readonly id?: string;
            readonly internalID?: string;
            readonly isDefault?: boolean;
            readonly errors?: ReadonlyArray<{
                readonly message: string;
            }>;
        };
    } | null;
};
export type setAsDefaultAddressMutation = {
    readonly response: setAsDefaultAddressMutationResponse;
    readonly variables: setAsDefaultAddressMutationVariables;
};



/*
mutation setAsDefaultAddressMutation(
  $input: UpdateUserDefaultAddressInput!
) {
  updateUserDefaultAddress(input: $input) {
    userAddressOrErrors {
      __typename
      ... on UserAddress {
        id
        internalID
        isDefault
      }
      ... on Errors {
        errors {
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
  "kind": "InlineFragment",
  "selections": [
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "id",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "internalID",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "isDefault",
      "storageKey": null
    }
  ],
  "type": "UserAddress",
  "abstractKey": null
},
v3 = {
  "kind": "InlineFragment",
  "selections": [
    {
      "alias": null,
      "args": null,
      "concreteType": "Error",
      "kind": "LinkedField",
      "name": "errors",
      "plural": true,
      "selections": [
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "message",
          "storageKey": null
        }
      ],
      "storageKey": null
    }
  ],
  "type": "Errors",
  "abstractKey": null
};
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "setAsDefaultAddressMutation",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": "UpdateUserDefaultAddressPayload",
        "kind": "LinkedField",
        "name": "updateUserDefaultAddress",
        "plural": false,
        "selections": [
          {
            "alias": null,
            "args": null,
            "concreteType": null,
            "kind": "LinkedField",
            "name": "userAddressOrErrors",
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
    "name": "setAsDefaultAddressMutation",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": "UpdateUserDefaultAddressPayload",
        "kind": "LinkedField",
        "name": "updateUserDefaultAddress",
        "plural": false,
        "selections": [
          {
            "alias": null,
            "args": null,
            "concreteType": null,
            "kind": "LinkedField",
            "name": "userAddressOrErrors",
            "plural": false,
            "selections": [
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "__typename",
                "storageKey": null
              },
              (v2/*: any*/),
              (v3/*: any*/)
            ],
            "storageKey": null
          }
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "id": "1b9e47d6d72070bbc2212342174e93d4",
    "metadata": {},
    "name": "setAsDefaultAddressMutation",
    "operationKind": "mutation",
    "text": null
  }
};
})();
(node as any).hash = 'fcb01f6b87f7b3d7148540e9ecda229f';
export default node;
