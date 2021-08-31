/* tslint:disable */
/* eslint-disable */
// @ts-nocheck
/* @relayHash 29fc6f1745014e053d0ae718d1f4200d */

import { ConcreteRequest } from "relay-runtime";
export type Search2QueryVariables = {};
export type Search2QueryResponse = {
    readonly system: {
        readonly __typename: string;
        readonly algolia: {
            readonly appID: string;
            readonly apiKey: string;
            readonly indices: ReadonlyArray<{
                readonly name: string;
                readonly displayName: string;
            }>;
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
    __typename
    algolia {
      appID
      apiKey
      indices {
        name
        displayName
      }
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
        "kind": "ScalarField",
        "name": "__typename",
        "storageKey": null
      },
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
          },
          {
            "alias": null,
            "args": null,
            "concreteType": "AlgoliaIndex",
            "kind": "LinkedField",
            "name": "indices",
            "plural": true,
            "selections": [
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "name",
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "displayName",
                "storageKey": null
              }
            ],
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
    "id": "29fc6f1745014e053d0ae718d1f4200d",
    "metadata": {},
    "name": "Search2Query",
    "operationKind": "query",
    "text": null
  }
};
})();
(node as any).hash = '5293287bb06a36f2e10be5cb9a5eadb7';
export default node;
