/* tslint:disable */
/* eslint-disable */
// @ts-nocheck
/* @relayHash 5ecfeb4630ceb211886f7f414402a0a9 */

import { ConcreteRequest } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type SearchQueryVariables = {};
export type SearchQueryResponse = {
    readonly " $fragmentRefs": FragmentRefs<"Search_system">;
};
export type SearchQuery = {
    readonly response: SearchQueryResponse;
    readonly variables: SearchQueryVariables;
};



/*
query SearchQuery {
  ...Search_system
}

fragment Search_system on Query {
  system {
    __typename
    algolia {
      appID
      apiKey
      indices {
        name
        displayName
        key
      }
    }
  }
}
*/

const node: ConcreteRequest = {
  "fragment": {
    "argumentDefinitions": [],
    "kind": "Fragment",
    "metadata": null,
    "name": "SearchQuery",
    "selections": [
      {
        "args": null,
        "kind": "FragmentSpread",
        "name": "Search_system"
      }
    ],
    "type": "Query",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": [],
    "kind": "Operation",
    "name": "SearchQuery",
    "selections": [
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
                  },
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "key",
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
    ]
  },
  "params": {
    "id": "5ecfeb4630ceb211886f7f414402a0a9",
    "metadata": {},
    "name": "SearchQuery",
    "operationKind": "query",
    "text": null
  }
};
(node as any).hash = '4a28efe83604aadc1d840f0c811bf2b9';
export default node;
