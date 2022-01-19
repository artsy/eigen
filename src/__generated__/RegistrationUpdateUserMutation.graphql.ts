/* tslint:disable */
/* eslint-disable */
// @ts-nocheck
/* @relayHash 9e8a7891114d59f7905a4aa9027e24e0 */

import { ConcreteRequest } from "relay-runtime";
export type UpdateMyProfileInput = {
    artworksPerYear?: string | null | undefined;
    bio?: string | null | undefined;
    clientMutationId?: string | null | undefined;
    collectorLevel?: number | null | undefined;
    completedOnboarding?: boolean | null | undefined;
    email?: string | null | undefined;
    emailFrequency?: string | null | undefined;
    gender?: string | null | undefined;
    iconUrl?: string | null | undefined;
    industry?: string | null | undefined;
    isCollector?: boolean | null | undefined;
    location?: EditableLocation | null | undefined;
    name?: string | null | undefined;
    notes?: string | null | undefined;
    otherRelevantPositions?: string | null | undefined;
    password?: string | null | undefined;
    phone?: string | null | undefined;
    priceRangeMax?: number | null | undefined;
    priceRangeMin?: number | null | undefined;
    privacy?: number | null | undefined;
    profession?: string | null | undefined;
    receiveLotOpeningSoonNotification?: boolean | null | undefined;
    receiveNewSalesNotification?: boolean | null | undefined;
    receiveNewWorksNotification?: boolean | null | undefined;
    receiveOutbidNotification?: boolean | null | undefined;
    receivePromotionNotification?: boolean | null | undefined;
    receivePurchaseNotification?: boolean | null | undefined;
    receiveSaleOpeningClosingNotification?: boolean | null | undefined;
    shareFollows?: boolean | null | undefined;
};
export type EditableLocation = {
    address?: string | null | undefined;
    address2?: string | null | undefined;
    city?: string | null | undefined;
    country?: string | null | undefined;
    postalCode?: string | null | undefined;
    state?: string | null | undefined;
    stateCode?: string | null | undefined;
    summary?: string | null | undefined;
};
export type RegistrationUpdateUserMutationVariables = {
    input: UpdateMyProfileInput;
};
export type RegistrationUpdateUserMutationResponse = {
    readonly updateMyUserProfile: {
        readonly clientMutationId: string | null;
        readonly user: {
            readonly phone: string | null;
        } | null;
    } | null;
};
export type RegistrationUpdateUserMutation = {
    readonly response: RegistrationUpdateUserMutationResponse;
    readonly variables: RegistrationUpdateUserMutationVariables;
};



/*
mutation RegistrationUpdateUserMutation(
  $input: UpdateMyProfileInput!
) {
  updateMyUserProfile(input: $input) {
    clientMutationId
    user {
      phone
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
  "name": "clientMutationId",
  "storageKey": null
},
v3 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "phone",
  "storageKey": null
};
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "RegistrationUpdateUserMutation",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": "UpdateMyProfilePayload",
        "kind": "LinkedField",
        "name": "updateMyUserProfile",
        "plural": false,
        "selections": [
          (v2/*: any*/),
          {
            "alias": null,
            "args": null,
            "concreteType": "User",
            "kind": "LinkedField",
            "name": "user",
            "plural": false,
            "selections": [
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
    "name": "RegistrationUpdateUserMutation",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": "UpdateMyProfilePayload",
        "kind": "LinkedField",
        "name": "updateMyUserProfile",
        "plural": false,
        "selections": [
          (v2/*: any*/),
          {
            "alias": null,
            "args": null,
            "concreteType": "User",
            "kind": "LinkedField",
            "name": "user",
            "plural": false,
            "selections": [
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
    "id": "9e8a7891114d59f7905a4aa9027e24e0",
    "metadata": {},
    "name": "RegistrationUpdateUserMutation",
    "operationKind": "mutation",
    "text": null
  }
};
})();
(node as any).hash = 'c0fa063813eeaa0721f07bde5237f58b';
export default node;
