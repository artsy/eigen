/* tslint:disable */
/* eslint-disable */
// @ts-nocheck
/* @relayHash 714ac6ded0ecac33354c6bb6fbe322dd */

import { ConcreteRequest } from "relay-runtime";
export type AndroidAppQueryVariables = {};
export type AndroidAppQueryResponse = {
    readonly me: {
        readonly name: string | null;
    } | null;
};
export type AndroidAppQuery = {
    readonly response: AndroidAppQueryResponse;
    readonly variables: AndroidAppQueryVariables;
};



/*
query AndroidAppQuery {
  me {
    name
    id
  }
}
*/

const node: ConcreteRequest = (function(){
var v0 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "name",
  "storageKey": null
};
return {
  "fragment": {
    "argumentDefinitions": [],
    "kind": "Fragment",
    "metadata": null,
    "name": "AndroidAppQuery",
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
    "name": "AndroidAppQuery",
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
    "id": "714ac6ded0ecac33354c6bb6fbe322dd",
    "metadata": {},
    "name": "AndroidAppQuery",
    "operationKind": "query",
    "text": null
  }
};
})();
(node as any).hash = '6306cd64f6035bc0b736347f094c6561';
export default node;
