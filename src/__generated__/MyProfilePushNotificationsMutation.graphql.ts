/* tslint:disable */
/* eslint-disable */
/* @relayHash fa6a53b937be405068c5ffca3e289031 */

import { ConcreteRequest } from "relay-runtime";
export type UpdateMyProfileInput = {
    clientMutationId?: string | null;
    collectorLevel?: number | null;
    email?: string | null;
    location?: EditableLocation | null;
    name?: string | null;
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
export type MyProfilePushNotificationsMutationVariables = {
    input: UpdateMyProfileInput;
};
export type MyProfilePushNotificationsMutationResponse = {
    readonly updateMyUserProfile: {
        readonly me: {
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
export type MyProfilePushNotificationsMutation = {
    readonly response: MyProfilePushNotificationsMutationResponse;
    readonly variables: MyProfilePushNotificationsMutationVariables;
};



/*
mutation MyProfilePushNotificationsMutation(
  $input: UpdateMyProfileInput!
) {
  updateMyUserProfile(input: $input) {
    me {
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
    "kind": "LocalArgument",
    "name": "input",
    "type": "UpdateMyProfileInput!",
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
  "name": "receiveLotOpeningSoonNotification",
  "args": null,
  "storageKey": null
},
v3 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "receiveNewSalesNotification",
  "args": null,
  "storageKey": null
},
v4 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "receiveNewWorksNotification",
  "args": null,
  "storageKey": null
},
v5 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "receiveOutbidNotification",
  "args": null,
  "storageKey": null
},
v6 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "receivePromotionNotification",
  "args": null,
  "storageKey": null
},
v7 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "receivePurchaseNotification",
  "args": null,
  "storageKey": null
},
v8 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "receiveSaleOpeningClosingNotification",
  "args": null,
  "storageKey": null
};
return {
  "kind": "Request",
  "fragment": {
    "kind": "Fragment",
    "name": "MyProfilePushNotificationsMutation",
    "type": "Mutation",
    "metadata": null,
    "argumentDefinitions": (v0/*: any*/),
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "updateMyUserProfile",
        "storageKey": null,
        "args": (v1/*: any*/),
        "concreteType": "UpdateMyProfilePayload",
        "plural": false,
        "selections": [
          {
            "kind": "LinkedField",
            "alias": null,
            "name": "me",
            "storageKey": null,
            "args": null,
            "concreteType": "Me",
            "plural": false,
            "selections": [
              (v2/*: any*/),
              (v3/*: any*/),
              (v4/*: any*/),
              (v5/*: any*/),
              (v6/*: any*/),
              (v7/*: any*/),
              (v8/*: any*/)
            ]
          }
        ]
      }
    ]
  },
  "operation": {
    "kind": "Operation",
    "name": "MyProfilePushNotificationsMutation",
    "argumentDefinitions": (v0/*: any*/),
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "updateMyUserProfile",
        "storageKey": null,
        "args": (v1/*: any*/),
        "concreteType": "UpdateMyProfilePayload",
        "plural": false,
        "selections": [
          {
            "kind": "LinkedField",
            "alias": null,
            "name": "me",
            "storageKey": null,
            "args": null,
            "concreteType": "Me",
            "plural": false,
            "selections": [
              (v2/*: any*/),
              (v3/*: any*/),
              (v4/*: any*/),
              (v5/*: any*/),
              (v6/*: any*/),
              (v7/*: any*/),
              (v8/*: any*/),
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
      }
    ]
  },
  "params": {
    "operationKind": "mutation",
    "name": "MyProfilePushNotificationsMutation",
    "id": "bf70171f4e13aff8adb50bc94e3bc001",
    "text": null,
    "metadata": {}
  }
};
})();
(node as any).hash = '224f84c55e8845867feca10864c1f7b3';
export default node;
