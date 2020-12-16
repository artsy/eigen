/* tslint:disable */
/* eslint-disable */
// @ts-nocheck
/* @relayHash 2ba5c8bffb0c394c9bce8f14828a28d1 */

import { ConcreteRequest } from "relay-runtime";
export type UpdateMyProfileInput = {
    clientMutationId?: string | null;
    collectorLevel?: number | null;
    email?: string | null;
    location?: EditableLocation | null;
    name?: string | null;
    password?: string | null;
    phone?: string | null;
    priceRangeMax?: number | null;
    priceRangeMin?: number | null;
    receiveLotOpeningSoonNotification?: boolean | null;
    receiveNewSalesNotification?: boolean | null;
    receiveNewWorksNotification?: boolean | null;
    receiveOutbidNotification?: boolean | null;
    receivePromotionNotification?: boolean | null;
    receivePurchaseNotification?: boolean | null;
    receiveSaleOpeningClosingNotification?: boolean | null;
};
export type EditableLocation = {
    address?: string | null;
    address2?: string | null;
    city?: string | null;
    country?: string | null;
    postalCode?: string | null;
    state?: string | null;
    stateCode?: string | null;
    summary?: string | null;
};
export type updateMyUserProfileMutationVariables = {
    input: UpdateMyProfileInput;
};
export type updateMyUserProfileMutationResponse = {
    readonly updateMyUserProfile: {
        readonly me: {
            readonly email: string | null;
            readonly name: string | null;
            readonly phone: string | null;
            readonly receiveLotOpeningSoonNotification: boolean | null;
            readonly receiveNewSalesNotification: boolean | null;
            readonly receiveNewWorksNotification: boolean | null;
            readonly receiveOutbidNotification: boolean | null;
            readonly receivePromotionNotification: boolean | null;
            readonly receivePurchaseNotification: boolean | null;
            readonly receiveSaleOpeningClosingNotification: boolean | null;
            readonly internalID: string;
        } | null;
        readonly userOrError: {
            readonly mutationError?: {
                readonly type: string | null;
                readonly message: string | null;
                readonly detail: string | null;
                readonly error: string | null;
                readonly fieldErrors: ReadonlyArray<{
                    readonly name: string;
                    readonly message: string;
                } | null> | null;
            } | null;
        } | null;
    } | null;
};
export type updateMyUserProfileMutation = {
    readonly response: updateMyUserProfileMutationResponse;
    readonly variables: updateMyUserProfileMutationVariables;
};



/*
mutation updateMyUserProfileMutation(
  $input: UpdateMyProfileInput!
) {
  updateMyUserProfile(input: $input) {
    me {
      email
      name
      phone
      receiveLotOpeningSoonNotification
      receiveNewSalesNotification
      receiveNewWorksNotification
      receiveOutbidNotification
      receivePromotionNotification
      receivePurchaseNotification
      receiveSaleOpeningClosingNotification
      internalID
      id
    }
    userOrError {
      __typename
      ... on UpdateMyProfileMutationFailure {
        mutationError {
          type
          message
          detail
          error
          fieldErrors {
            name
            message
          }
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
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "email",
  "storageKey": null
},
v3 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "name",
  "storageKey": null
},
v4 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "phone",
  "storageKey": null
},
v5 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "receiveLotOpeningSoonNotification",
  "storageKey": null
},
v6 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "receiveNewSalesNotification",
  "storageKey": null
},
v7 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "receiveNewWorksNotification",
  "storageKey": null
},
v8 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "receiveOutbidNotification",
  "storageKey": null
},
v9 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "receivePromotionNotification",
  "storageKey": null
},
v10 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "receivePurchaseNotification",
  "storageKey": null
},
v11 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "receiveSaleOpeningClosingNotification",
  "storageKey": null
},
v12 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "internalID",
  "storageKey": null
},
v13 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "message",
  "storageKey": null
},
v14 = {
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
          "name": "type",
          "storageKey": null
        },
        (v13/*: any*/),
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "detail",
          "storageKey": null
        },
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "error",
          "storageKey": null
        },
        {
          "alias": null,
          "args": null,
          "concreteType": "FieldErrorResults",
          "kind": "LinkedField",
          "name": "fieldErrors",
          "plural": true,
          "selections": [
            (v3/*: any*/),
            (v13/*: any*/)
          ],
          "storageKey": null
        }
      ],
      "storageKey": null
    }
  ],
  "type": "UpdateMyProfileMutationFailure",
  "abstractKey": null
};
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "updateMyUserProfileMutation",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": "UpdateMyProfilePayload",
        "kind": "LinkedField",
        "name": "updateMyUserProfile",
        "plural": false,
        "selections": [
          {
            "alias": null,
            "args": null,
            "concreteType": "Me",
            "kind": "LinkedField",
            "name": "me",
            "plural": false,
            "selections": [
              (v2/*: any*/),
              (v3/*: any*/),
              (v4/*: any*/),
              (v5/*: any*/),
              (v6/*: any*/),
              (v7/*: any*/),
              (v8/*: any*/),
              (v9/*: any*/),
              (v10/*: any*/),
              (v11/*: any*/),
              (v12/*: any*/)
            ],
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "concreteType": null,
            "kind": "LinkedField",
            "name": "userOrError",
            "plural": false,
            "selections": [
              (v14/*: any*/)
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
    "name": "updateMyUserProfileMutation",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": "UpdateMyProfilePayload",
        "kind": "LinkedField",
        "name": "updateMyUserProfile",
        "plural": false,
        "selections": [
          {
            "alias": null,
            "args": null,
            "concreteType": "Me",
            "kind": "LinkedField",
            "name": "me",
            "plural": false,
            "selections": [
              (v2/*: any*/),
              (v3/*: any*/),
              (v4/*: any*/),
              (v5/*: any*/),
              (v6/*: any*/),
              (v7/*: any*/),
              (v8/*: any*/),
              (v9/*: any*/),
              (v10/*: any*/),
              (v11/*: any*/),
              (v12/*: any*/),
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "id",
                "storageKey": null
              }
            ],
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "concreteType": null,
            "kind": "LinkedField",
            "name": "userOrError",
            "plural": false,
            "selections": [
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "__typename",
                "storageKey": null
              },
              (v14/*: any*/)
            ],
            "storageKey": null
          }
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "id": "2ba5c8bffb0c394c9bce8f14828a28d1",
    "metadata": {},
    "name": "updateMyUserProfileMutation",
    "operationKind": "mutation",
    "text": null
  }
};
})();
(node as any).hash = 'e5a448421bc6c70e865df29eef9dd38e';
export default node;
