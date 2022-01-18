/* tslint:disable */
/* eslint-disable */
// @ts-nocheck
/* @relayHash c11e093b9357a7bb3ebe0c62f4802bcb */

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
export type updateEmailFrequencyMutationVariables = {
    input: UpdateMyProfileInput;
};
export type updateEmailFrequencyMutationResponse = {
    readonly updateMyUserProfile: {
        readonly userOrError: {
            readonly user?: {
                readonly internalID: string;
            } | null | undefined;
        } | null;
    } | null;
};
export type updateEmailFrequencyMutation = {
    readonly response: updateEmailFrequencyMutationResponse;
    readonly variables: updateEmailFrequencyMutationVariables;
};



/*
mutation updateEmailFrequencyMutation(
  $input: UpdateMyProfileInput!
) {
  updateMyUserProfile(input: $input) {
    userOrError {
      __typename
      ... on UpdateMyProfileMutationSuccess {
        user {
          internalID
          id
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
  "name": "internalID",
  "storageKey": null
};
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "updateEmailFrequencyMutation",
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
            "concreteType": null,
            "kind": "LinkedField",
            "name": "userOrError",
            "plural": false,
            "selections": [
              {
                "kind": "InlineFragment",
                "selections": [
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "User",
                    "kind": "LinkedField",
                    "name": "user",
                    "plural": false,
                    "selections": [
                      (v2/*: any*/)
                    ],
                    "storageKey": null
                  }
                ],
                "type": "UpdateMyProfileMutationSuccess",
                "abstractKey": null
              }
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
    "name": "updateEmailFrequencyMutation",
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
              {
                "kind": "InlineFragment",
                "selections": [
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "User",
                    "kind": "LinkedField",
                    "name": "user",
                    "plural": false,
                    "selections": [
                      (v2/*: any*/),
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
                "type": "UpdateMyProfileMutationSuccess",
                "abstractKey": null
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
    "id": "c11e093b9357a7bb3ebe0c62f4802bcb",
    "metadata": {},
    "name": "updateEmailFrequencyMutation",
    "operationKind": "mutation",
    "text": null
  }
};
})();
(node as any).hash = '36b24d34a9c479d1c037ea22ec9b5961';
export default node;
