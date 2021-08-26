/* tslint:disable */
/* eslint-disable */
// @ts-nocheck
/* @relayHash ab6b83dc77585a03bb1e2053de796626 */

import { ConcreteRequest } from "relay-runtime";
export type Search2QueryVariables = {};
export type Search2QueryResponse = {
    readonly system: {
        readonly algolia: {
            readonly appID: string | null;
            readonly apiKey: string | null;
        } | null;
    } | null;
};
export type Search2Query = {
    readonly response: Search2QueryResponse;
    readonly variables: Search2QueryVariables;
};



/*
query Search2Query {
  system {
    algolia {
      appID
      apiKey
    }
  }
}
*/

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "alias": null,
    "args": null,
    "concreteType": "System",
    "kind": "LinkedField",
    "name": "system",
    "plural": false,
    "selections": [
      {
        "alias": null,
        "args": null,
        "concreteType": "Algolia",
        "kind": "LinkedField",
        "name": "algolia",
        "plural": false,
        "selections": [
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "appID",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "apiKey",
            "storageKey": null
          }
        ],
        "storageKey": null
      }
    ],
    "storageKey": null
  }
];
return {
  "fragment": {
    "argumentDefinitions": [],
    "kind": "Fragment",
    "metadata": null,
    "name": "Search2Query",
    "selections": (v0/*: any*/),
    "type": "Query",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": [],
    "kind": "Operation",
    "name": "Search2Query",
    "selections": (v0/*: any*/)
  },
  "params": {
    "id": "ab6b83dc77585a03bb1e2053de796626",
    "metadata": {},
    "name": "Search2Query",
    "operationKind": "query",
    "text": null
  }
};
})();
(node as any).hash = 'fa87f0920473f8709236b4266eeb94cd';
export default node;
