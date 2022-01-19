/* tslint:disable */
/* eslint-disable */
// @ts-nocheck
/* @relayHash aa706326328bc80bc6c285e6c29eb729 */

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
export type updateMyUserProfileMutationVariables = {
    input: UpdateMyProfileInput;
};
export type updateMyUserProfileMutationResponse = {
    readonly updateMyUserProfile: {
        readonly me: {
            readonly email: string | null;
            readonly name: string | null;
            readonly phone: string | null;
            readonly bio: string | null;
            readonly icon: {
                readonly internalID: string | null;
                readonly imageURL: string | null;
            } | null;
            readonly receiveLotOpeningSoonNotification: boolean | null;
            readonly receiveNewSalesNotification: boolean | null;
            readonly receiveNewWorksNotification: boolean | null;
            readonly receiveOutbidNotification: boolean | null;
            readonly receivePromotionNotification: boolean | null;
            readonly receivePurchaseNotification: boolean | null;
            readonly receiveSaleOpeningClosingNotification: boolean | null;
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
      bio
      icon {
        internalID
        imageURL
      }
      receiveLotOpeningSoonNotification
      receiveNewSalesNotification
      receiveNewWorksNotification
      receiveOutbidNotification
      receivePromotionNotification
      receivePurchaseNotification
      receiveSaleOpeningClosingNotification
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
  "name": "bio",
  "storageKey": null
},
v6 = {
  "alias": null,
  "args": null,
  "concreteType": "Image",
  "kind": "LinkedField",
  "name": "icon",
  "plural": false,
  "selections": [
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
      "name": "imageURL",
      "storageKey": null
    }
  ],
  "storageKey": null
},
v7 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "receiveLotOpeningSoonNotification",
  "storageKey": null
},
v8 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "receiveNewSalesNotification",
  "storageKey": null
},
v9 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "receiveNewWorksNotification",
  "storageKey": null
},
v10 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "receiveOutbidNotification",
  "storageKey": null
},
v11 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "receivePromotionNotification",
  "storageKey": null
},
v12 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "receivePurchaseNotification",
  "storageKey": null
},
v13 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "receiveSaleOpeningClosingNotification",
  "storageKey": null
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
              (v12/*: any*/),
              (v13/*: any*/)
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
              (v13/*: any*/),
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
    "id": "aa706326328bc80bc6c285e6c29eb729",
    "metadata": {},
    "name": "updateMyUserProfileMutation",
    "operationKind": "mutation",
    "text": null
  }
};
})();
(node as any).hash = '8f1e05a691520961ee409afcd086275b';
export default node;
