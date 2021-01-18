/* tslint:disable */
/* eslint-disable */
// @ts-nocheck
/* @relayHash 94481037b78580510f85f58c80304466 */

import { ConcreteRequest } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type FairEmptyStateTestsQueryVariables = {};
export type FairEmptyStateTestsQueryResponse = {
    readonly fair: {
        readonly " $fragmentRefs": FragmentRefs<"FairEmptyState_fair">;
    } | null;
};
export type FairEmptyStateTestsQuery = {
    readonly response: FairEmptyStateTestsQueryResponse;
    readonly variables: FairEmptyStateTestsQueryVariables;
};



/*
query FairEmptyStateTestsQuery {
  fair(id: "example-fair-id") {
    ...FairEmptyState_fair
    id
  }
}

fragment FairEmptyState_fair on Fair {
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
    "name": "FairEmptyStateTestsQuery",
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
            "name": "FairEmptyState_fair"
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
    "name": "FairEmptyStateTestsQuery",
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
    "id": "94481037b78580510f85f58c80304466",
    "metadata": {},
    "name": "FairEmptyStateTestsQuery",
    "operationKind": "query",
    "text": null
  }
};
})();
(node as any).hash = '93bd17a10f37ff96b8b7da13a16bff0b';
export default node;
