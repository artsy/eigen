/* tslint:disable */
/* eslint-disable */
// @ts-nocheck
/* @relayHash cc269c035d7c4e07b2d0b7ef7ef6faef */

import { ConcreteRequest } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type MyProfilePushNotificationsRefetchQueryVariables = {};
export type MyProfilePushNotificationsRefetchQueryResponse = {
    readonly me: {
        readonly " $fragmentRefs": FragmentRefs<"MyProfilePushNotifications_me">;
    } | null;
};
export type MyProfilePushNotificationsRefetchQuery = {
    readonly response: MyProfilePushNotificationsRefetchQueryResponse;
    readonly variables: MyProfilePushNotificationsRefetchQueryVariables;
};



/*
query MyProfilePushNotificationsRefetchQuery {
  me {
    ...MyProfilePushNotifications_me
    id
  }
}

fragment MyProfilePushNotifications_me on Me {
  receiveLotOpeningSoonNotification
  receiveNewSalesNotification
  receiveNewWorksNotification
  receiveOutbidNotification
  receivePromotionNotification
  receivePurchaseNotification
  receiveSaleOpeningClosingNotification
}
*/

const node: ConcreteRequest = {
  "fragment": {
    "argumentDefinitions": [],
    "kind": "Fragment",
    "metadata": null,
    "name": "MyProfilePushNotificationsRefetchQuery",
    "selections": [
      {
        "alias": null,
        "args": null,
        "concreteType": "Me",
        "kind": "LinkedField",
        "name": "me",
        "plural": false,
        "selections": [
          {
            "args": null,
            "kind": "FragmentSpread",
            "name": "MyProfilePushNotifications_me"
          }
        ],
        "storageKey": null
      }
    ],
    "type": "Query",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": [],
    "kind": "Operation",
    "name": "MyProfilePushNotificationsRefetchQuery",
    "selections": [
      {
        "alias": null,
        "args": null,
        "concreteType": "Me",
        "kind": "LinkedField",
        "name": "me",
        "plural": false,
        "selections": [
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "receiveLotOpeningSoonNotification",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "receiveNewSalesNotification",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "receiveNewWorksNotification",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "receiveOutbidNotification",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "receivePromotionNotification",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "receivePurchaseNotification",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "receiveSaleOpeningClosingNotification",
            "storageKey": null
          },
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
    ]
  },
  "params": {
    "id": "cc269c035d7c4e07b2d0b7ef7ef6faef",
    "metadata": {},
    "name": "MyProfilePushNotificationsRefetchQuery",
    "operationKind": "query",
    "text": null
  }
};
(node as any).hash = 'e0fa2c50a8493ca1b991b926194d6abc';
export default node;
