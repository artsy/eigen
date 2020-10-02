/* tslint:disable */
/* eslint-disable */
// @ts-nocheck
/* @relayHash bbb82e579a2a395cd7b5dfeb16373463 */

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
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "unreadConversationCount",
  "storageKey": null
};
return {
  "fragment": {
    "argumentDefinitions": [],
    "kind": "Fragment",
    "metadata": null,
    "name": "BottomTabsModelFetchCurrentUnreadConversationCountQuery",
    "selections": [
      {
        "alias": null,
        "args": null,
        "concreteType": "Me",
        "kind": "LinkedField",
        "name": "me",
        "plural": false,
        "selections": [
          (v0/*: any*/)
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
    "name": "BottomTabsModelFetchCurrentUnreadConversationCountQuery",
    "selections": [
      {
        "alias": null,
        "args": null,
        "concreteType": "Me",
        "kind": "LinkedField",
        "name": "me",
        "plural": false,
        "selections": [
          (v0/*: any*/),
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
    "id": "bbb82e579a2a395cd7b5dfeb16373463",
    "metadata": {},
    "name": "BottomTabsModelFetchCurrentUnreadConversationCountQuery",
    "operationKind": "query",
    "text": null
  }
};
})();
(node as any).hash = '60d4d4f405f56d586f4ad3027429bad3';
export default node;
