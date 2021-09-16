/* tslint:disable */
/* eslint-disable */
// @ts-nocheck
/* @relayHash 0f90c59e1dd1064179bd7039812752f4 */

import { ConcreteRequest } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type Search2RefetchQueryVariables = {};
export type Search2RefetchQueryResponse = {
    readonly system: {
        readonly " $fragmentRefs": FragmentRefs<"Search2_system">;
    } | null;
};
export type Search2RefetchQuery = {
    readonly response: Search2RefetchQueryResponse;
    readonly variables: Search2RefetchQueryVariables;
};



/*
query Search2RefetchQuery {
  system {
    ...Search2_system
  }
}

fragment Search2_system on System {
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
*/

const node: ConcreteRequest = {
  "fragment": {
    "argumentDefinitions": [],
    "kind": "Fragment",
    "metadata": null,
    "name": "Search2RefetchQuery",
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
            "args": null,
            "kind": "FragmentSpread",
            "name": "Search2_system"
          }
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
    "name": "Search2RefetchQuery",
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
    "id": "0f90c59e1dd1064179bd7039812752f4",
    "metadata": {},
    "name": "Search2RefetchQuery",
    "operationKind": "query",
    "text": null
  }
};
(node as any).hash = '8be4fc61c5d5d631fba2b529b6633d45';
export default node;
