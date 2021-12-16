/* tslint:disable */
/* eslint-disable */
// @ts-nocheck
/* @relayHash 48f9985b022e04924a8464b308ce2ee4 */

import { ConcreteRequest } from "relay-runtime";
export type CreateUserAddressInput = {
    attributes: UserAddressAttributes;
    clientMutationId?: string | null | undefined;
};
export type UserAddressAttributes = {
    addressLine1: string;
    addressLine2?: string | null | undefined;
    addressLine3?: string | null | undefined;
    city: string;
    country: string;
    name: string;
    phoneNumber?: string | null | undefined;
    phoneNumberCountryCode?: string | null | undefined;
    postalCode?: string | null | undefined;
    region?: string | null | undefined;
};
export type addNewAddressMutationVariables = {
    input: CreateUserAddressInput;
};
export type addNewAddressMutationResponse = {
    readonly createUserAddress: {
        readonly userAddressOrErrors: {
            readonly id?: string | undefined;
            readonly internalID?: string | undefined;
            readonly addressLine1?: string | undefined;
            readonly addressLine2?: string | null | undefined;
            readonly city?: string | undefined;
            readonly country?: string | undefined;
            readonly isDefault?: boolean | undefined;
            readonly name?: string | null | undefined;
            readonly phoneNumber?: string | null | undefined;
            readonly postalCode?: string | null | undefined;
            readonly region?: string | null | undefined;
            readonly errors?: ReadonlyArray<{
                readonly message: string;
            }> | undefined;
        };
    } | null;
};
export type addNewAddressMutation = {
    readonly response: addNewAddressMutationResponse;
    readonly variables: addNewAddressMutationVariables;
};



/*
mutation addNewAddressMutation(
  $input: CreateUserAddressInput!
) {
  createUserAddress(input: $input) {
    userAddressOrErrors {
      __typename
      ... on UserAddress {
        id
        internalID
        addressLine1
        addressLine2
        city
        country
        isDefault
        name
        phoneNumber
        postalCode
        region
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
      "name": "addressLine1",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "addressLine2",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "city",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "country",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "isDefault",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "name",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "phoneNumber",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "postalCode",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "region",
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
    "name": "addNewAddressMutation",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": "CreateUserAddressPayload",
        "kind": "LinkedField",
        "name": "createUserAddress",
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
    "name": "addNewAddressMutation",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": "CreateUserAddressPayload",
        "kind": "LinkedField",
        "name": "createUserAddress",
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
    "id": "48f9985b022e04924a8464b308ce2ee4",
    "metadata": {},
    "name": "addNewAddressMutation",
    "operationKind": "mutation",
    "text": null
  }
};
})();
(node as any).hash = '98ac48306b7d0e1a4ad2ecb4ea70e78b';
export default node;
