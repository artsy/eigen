/* tslint:disable */
/* eslint-disable */
// @ts-nocheck
/* @relayHash 1829179a8a73f48f9575be267da96788 */

import { ConcreteRequest } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type MyProfilePushNotificationsQueryVariables = {};
export type MyProfilePushNotificationsQueryResponse = {
    readonly me: {
        readonly " $fragmentRefs": FragmentRefs<"MyProfilePushNotifications_me">;
    } | null;
};
export type MyProfilePushNotificationsQuery = {
    readonly response: MyProfilePushNotificationsQueryResponse;
    readonly variables: MyProfilePushNotificationsQueryVariables;
};



/*
query MyProfilePushNotificationsQuery {
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
    "name": "MyProfilePushNotificationsQuery",
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
    "name": "MyProfilePushNotificationsQuery",
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
    "id": "1829179a8a73f48f9575be267da96788",
    "metadata": {},
    "name": "MyProfilePushNotificationsQuery",
    "operationKind": "query",
    "text": null
  }
};
(node as any).hash = 'bcdcedb47646f44024b41af1fd280dca';
export default node;
