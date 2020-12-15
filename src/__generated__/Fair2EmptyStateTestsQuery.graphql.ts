/* tslint:disable */
/* eslint-disable */
// @ts-nocheck
/* @relayHash a81a80bdec39ae395d41758c5bb64cab */

import { ConcreteRequest } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type Fair2EmptyStateTestsQueryVariables = {};
export type Fair2EmptyStateTestsQueryResponse = {
    readonly fair: {
        readonly " $fragmentRefs": FragmentRefs<"Fair2EmptyState_fair">;
    } | null;
};
export type Fair2EmptyStateTestsQuery = {
    readonly response: Fair2EmptyStateTestsQueryResponse;
    readonly variables: Fair2EmptyStateTestsQueryVariables;
};



/*
query Fair2EmptyStateTestsQuery {
  fair(id: "example-fair-id") {
    ...Fair2EmptyState_fair
    id
  }
}

fragment Fair2EmptyState_fair on Fair {
  isActive
  endAt
}
*/

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "kind": "Literal",
    "name": "id",
    "value": "example-fair-id"
  }
];
return {
  "fragment": {
    "argumentDefinitions": [],
    "kind": "Fragment",
    "metadata": null,
    "name": "Fair2EmptyStateTestsQuery",
    "selections": [
      {
        "alias": null,
        "args": (v0/*: any*/),
        "concreteType": "Fair",
        "kind": "LinkedField",
        "name": "fair",
        "plural": false,
        "selections": [
          {
            "args": null,
            "kind": "FragmentSpread",
            "name": "Fair2EmptyState_fair"
          }
        ],
        "storageKey": "fair(id:\"example-fair-id\")"
      }
    ],
    "type": "Query",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": [],
    "kind": "Operation",
    "name": "Fair2EmptyStateTestsQuery",
    "selections": [
      {
        "alias": null,
        "args": (v0/*: any*/),
        "concreteType": "Fair",
        "kind": "LinkedField",
        "name": "fair",
        "plural": false,
        "selections": [
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "isActive",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "endAt",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "id",
            "storageKey": null
          }
        ],
        "storageKey": "fair(id:\"example-fair-id\")"
      }
    ]
  },
  "params": {
    "id": "a81a80bdec39ae395d41758c5bb64cab",
    "metadata": {},
    "name": "Fair2EmptyStateTestsQuery",
    "operationKind": "query",
    "text": null
  }
};
})();
(node as any).hash = '8660abe267d4426214384a896bfec5e8';
export default node;
