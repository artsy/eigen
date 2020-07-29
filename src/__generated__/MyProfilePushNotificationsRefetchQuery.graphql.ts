/* tslint:disable */
/* eslint-disable */
/* @relayHash 31a36ce93d5dec4c18d8d29d82ce815c */

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
  "kind": "Request",
  "fragment": {
    "kind": "Fragment",
    "name": "MyProfilePushNotificationsRefetchQuery",
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
    "name": "MyProfilePushNotificationsRefetchQuery",
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
    "name": "MyProfilePushNotificationsRefetchQuery",
    "id": "cc269c035d7c4e07b2d0b7ef7ef6faef",
    "text": null,
    "metadata": {}
  }
};
(node as any).hash = 'e0fa2c50a8493ca1b991b926194d6abc';
export default node;
