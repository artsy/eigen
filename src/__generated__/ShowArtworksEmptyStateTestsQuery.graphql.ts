/* tslint:disable */
/* eslint-disable */
// @ts-nocheck
/* @relayHash 1f37e7b39cc0c4eb0bf4b46f734b5d71 */

import { ConcreteRequest } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type ShowArtworksEmptyStateTestsQueryVariables = {};
export type ShowArtworksEmptyStateTestsQueryResponse = {
    readonly show: {
        readonly " $fragmentRefs": FragmentRefs<"ShowArtworksEmptyState_show">;
    } | null;
};
export type ShowArtworksEmptyStateTestsQuery = {
    readonly response: ShowArtworksEmptyStateTestsQueryResponse;
    readonly variables: ShowArtworksEmptyStateTestsQueryVariables;
};



/*
query ShowArtworksEmptyStateTestsQuery {
  show(id: "example-show-id") {
    ...ShowArtworksEmptyState_show
    id
  }
}

fragment ShowArtworksEmptyState_show on Show {
  isFairBooth
  status
}
*/

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "kind": "Literal",
    "name": "id",
    "value": "example-show-id"
  }
];
return {
  "fragment": {
    "argumentDefinitions": [],
    "kind": "Fragment",
    "metadata": null,
    "name": "ShowArtworksEmptyStateTestsQuery",
    "selections": [
      {
        "alias": null,
        "args": (v0/*: any*/),
        "concreteType": "Show",
        "kind": "LinkedField",
        "name": "show",
        "plural": false,
        "selections": [
          {
            "args": null,
            "kind": "FragmentSpread",
            "name": "ShowArtworksEmptyState_show"
          }
        ],
        "storageKey": "show(id:\"example-show-id\")"
      }
    ],
    "type": "Query",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": [],
    "kind": "Operation",
    "name": "ShowArtworksEmptyStateTestsQuery",
    "selections": [
      {
        "alias": null,
        "args": (v0/*: any*/),
        "concreteType": "Show",
        "kind": "LinkedField",
        "name": "show",
        "plural": false,
        "selections": [
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "isFairBooth",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "status",
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
        "storageKey": "show(id:\"example-show-id\")"
      }
    ]
  },
  "params": {
    "id": "1f37e7b39cc0c4eb0bf4b46f734b5d71",
    "metadata": {
      "relayTestingSelectionTypeInfo": {
        "show": {
          "enumValues": null,
          "nullable": true,
          "plural": false,
          "type": "Show"
        },
        "show.id": {
          "enumValues": null,
          "nullable": false,
          "plural": false,
          "type": "ID"
        },
        "show.isFairBooth": {
          "enumValues": null,
          "nullable": true,
          "plural": false,
          "type": "Boolean"
        },
        "show.status": {
          "enumValues": null,
          "nullable": true,
          "plural": false,
          "type": "String"
        }
      }
    },
    "name": "ShowArtworksEmptyStateTestsQuery",
    "operationKind": "query",
    "text": null
  }
};
})();
(node as any).hash = '9228a7888ae98110d9def3d9d73600a1';
export default node;
