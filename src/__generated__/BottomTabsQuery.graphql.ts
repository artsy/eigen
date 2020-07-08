/* tslint:disable */
/* eslint-disable */
/* @relayHash dbb363039bae8f8532d31e65ed241a48 */

import { ConcreteRequest } from "relay-runtime";
export type BottomTabsQueryVariables = {};
export type BottomTabsQueryResponse = {
    readonly me: {
        readonly unreadConversationCount: number;
    } | null;
};
export type BottomTabsQuery = {
    readonly response: BottomTabsQueryResponse;
    readonly variables: BottomTabsQueryVariables;
};



/*
query BottomTabsQuery {
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
    "name": "BottomTabsQuery",
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
    "name": "BottomTabsQuery",
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
    "name": "BottomTabsQuery",
    "id": "f03ebe8d61685205a247bf23df15dc11",
    "text": null,
    "metadata": {}
  }
};
})();
(node as any).hash = '9ecc704bbe04577dfab3a19a33cb0a1a';
export default node;
