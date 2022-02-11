/* tslint:disable */
/* eslint-disable */
// @ts-nocheck
/* @relayHash c6bbf9e6025495998a0a86dd315e76f5 */

import { ConcreteRequest } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type SearchRefetchQueryVariables = {};
export type SearchRefetchQueryResponse = {
    readonly " $fragmentRefs": FragmentRefs<"Search_system">;
};
export type SearchRefetchQuery = {
    readonly response: SearchRefetchQueryResponse;
    readonly variables: SearchRefetchQueryVariables;
};



/*
query SearchRefetchQuery {
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
    "name": "SearchRefetchQuery",
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
    "name": "SearchRefetchQuery",
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
    "id": "c6bbf9e6025495998a0a86dd315e76f5",
    "metadata": {},
    "name": "SearchRefetchQuery",
    "operationKind": "query",
    "text": null
  }
};
(node as any).hash = '9a3b4e2b51c9ac8771ff1ce37e7ddfeb';
export default node;
