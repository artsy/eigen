/* tslint:disable */
/* eslint-disable */
/* @relayHash 17cc832aff0c51c397258e3aa19bffdd */

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
  "kind": "Request",
  "fragment": {
    "kind": "Fragment",
    "name": "MyProfilePushNotificationsQuery",
    "type": "Query",
    "metadata": null,
    "argumentDefinitions": [],
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
          {
            "kind": "FragmentSpread",
            "name": "MyProfilePushNotifications_me",
            "args": null
          }
        ]
      }
    ]
  },
  "operation": {
    "kind": "Operation",
    "name": "MyProfilePushNotificationsQuery",
    "argumentDefinitions": [],
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
          {
            "kind": "ScalarField",
            "alias": null,
            "name": "receiveLotOpeningSoonNotification",
            "args": null,
            "storageKey": null
          },
          {
            "kind": "ScalarField",
            "alias": null,
            "name": "receiveNewSalesNotification",
            "args": null,
            "storageKey": null
          },
          {
            "kind": "ScalarField",
            "alias": null,
            "name": "receiveNewWorksNotification",
            "args": null,
            "storageKey": null
          },
          {
            "kind": "ScalarField",
            "alias": null,
            "name": "receiveOutbidNotification",
            "args": null,
            "storageKey": null
          },
          {
            "kind": "ScalarField",
            "alias": null,
            "name": "receivePromotionNotification",
            "args": null,
            "storageKey": null
          },
          {
            "kind": "ScalarField",
            "alias": null,
            "name": "receivePurchaseNotification",
            "args": null,
            "storageKey": null
          },
          {
            "kind": "ScalarField",
            "alias": null,
            "name": "receiveSaleOpeningClosingNotification",
            "args": null,
            "storageKey": null
          },
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
  },
  "params": {
    "operationKind": "query",
    "name": "MyProfilePushNotificationsQuery",
    "id": "1829179a8a73f48f9575be267da96788",
    "text": null,
    "metadata": {}
  }
};
(node as any).hash = 'bcdcedb47646f44024b41af1fd280dca';
export default node;
