/* tslint:disable */
/* eslint-disable */
/* @relayHash 4227065b8542bb3a862cbe1d69007e3a */

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
  me @principalField {
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
    "id": "bbb82e579a2a395cd7b5dfeb16373463",
    "text": null,
    "metadata": {}
  }
};
})();
(node as any).hash = '60d4d4f405f56d586f4ad3027429bad3';
export default node;
