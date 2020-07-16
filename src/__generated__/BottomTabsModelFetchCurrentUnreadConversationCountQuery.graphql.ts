/* tslint:disable */
/* eslint-disable */
/* @relayHash 5720d82744a3a1f45644f92a354a79b6 */

import { ConcreteRequest } from "relay-runtime";
export type BottomTabsModelFetchCurrentUnreadConversationCountQueryVariables = {};
export type BottomTabsModelFetchCurrentUnreadConversationCountQueryResponse = {
    readonly me: {
        readonly unreadConversationCount: number;
    } | null;
};
export type BottomTabsModelFetchCurrentUnreadConversationCountQuery = {
    readonly response: BottomTabsModelFetchCurrentUnreadConversationCountQueryResponse;
    readonly variables: BottomTabsModelFetchCurrentUnreadConversationCountQueryVariables;
};



/*
query BottomTabsModelFetchCurrentUnreadConversationCountQuery {
  me {
    unreadConversationCount
    id
  }
}
*/

const node: ConcreteRequest = (function(){
var v0 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "unreadConversationCount",
  "args": null,
  "storageKey": null
};
return {
  "kind": "Request",
  "fragment": {
    "kind": "Fragment",
    "name": "BottomTabsModelFetchCurrentUnreadConversationCountQuery",
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
          (v0/*: any*/)
        ]
      }
    ]
  },
  "operation": {
    "kind": "Operation",
    "name": "BottomTabsModelFetchCurrentUnreadConversationCountQuery",
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
          (v0/*: any*/),
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
    "name": "BottomTabsModelFetchCurrentUnreadConversationCountQuery",
    "id": "820174fb7731e8bf7ed0e7ccc3b3a9ba",
    "text": null,
    "metadata": {}
  }
};
})();
(node as any).hash = '9d3f34a9edbcee383f3986e57b66873d';
export default node;
