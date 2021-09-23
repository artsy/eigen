/* tslint:disable */
/* eslint-disable */
// @ts-nocheck
/* @relayHash 42186652b7be904f8449c97721e3f30b */

import { ConcreteRequest } from "relay-runtime";
export type UpdateUserAddressInput = {
    attributes: UserAddressAttributes;
    clientMutationId?: string | null;
    userAddressID: string;
};
export type UserAddressAttributes = {
    addressLine1: string;
    addressLine2?: string | null;
    addressLine3?: string | null;
    city: string;
    country: string;
    name: string;
    phoneNumber?: string | null;
    phoneNumberCountryCode?: string | null;
    postalCode?: string | null;
    region?: string | null;
};
export type updateUserAddressMutationVariables = {
    input: UpdateUserAddressInput;
};
export type updateUserAddressMutationResponse = {
    readonly updateUserAddress: {
        readonly userAddressOrErrors: {
            readonly id?: string;
            readonly internalID?: string;
            readonly name?: string | null;
            readonly addressLine1?: string;
            readonly addressLine2?: string | null;
            readonly isDefault?: boolean;
            readonly phoneNumber?: string | null;
            readonly city?: string;
            readonly region?: string | null;
            readonly postalCode?: string | null;
            readonly country?: string;
            readonly errors?: ReadonlyArray<{
                readonly code: string;
                readonly message: string;
            }>;
        };
    } | null;
};
export type updateUserAddressMutation = {
    readonly response: updateUserAddressMutationResponse;
    readonly variables: updateUserAddressMutationVariables;
};



/*
mutation updateUserAddressMutation(
  $input: UpdateUserAddressInput!
) {
  updateUserAddress(input: $input) {
    userAddressOrErrors {
      __typename
      ... on UserAddress {
        id
        internalID
        name
        addressLine1
        addressLine2
        isDefault
        phoneNumber
        city
        region
        postalCode
        country
      }
      ... on Errors {
        errors {
          code
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
      "name": "name",
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
      "name": "isDefault",
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
      "name": "city",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "region",
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
      "name": "country",
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
          "name": "code",
          "storageKey": null
        },
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
    "name": "updateUserAddressMutation",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": "UpdateUserAddressPayload",
        "kind": "LinkedField",
        "name": "updateUserAddress",
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
    "name": "updateUserAddressMutation",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": "UpdateUserAddressPayload",
        "kind": "LinkedField",
        "name": "updateUserAddress",
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
    "id": "42186652b7be904f8449c97721e3f30b",
    "metadata": {},
    "name": "updateUserAddressMutation",
    "operationKind": "mutation",
    "text": null
  }
};
})();
(node as any).hash = '993b108854d372333cb2260bce841108';
export default node;
