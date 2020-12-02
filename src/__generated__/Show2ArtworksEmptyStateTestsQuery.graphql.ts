/* tslint:disable */
/* eslint-disable */
// @ts-nocheck
/* @relayHash 67a1bf7675263b3c420297287503b71e */

import { ConcreteRequest } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type Show2ArtworksEmptyStateTestsQueryVariables = {};
export type Show2ArtworksEmptyStateTestsQueryResponse = {
    readonly show: {
        readonly " $fragmentRefs": FragmentRefs<"Show2ArtworksEmptyState_show">;
    } | null;
};
export type Show2ArtworksEmptyStateTestsQuery = {
    readonly response: Show2ArtworksEmptyStateTestsQueryResponse;
    readonly variables: Show2ArtworksEmptyStateTestsQueryVariables;
};



/*
query Show2ArtworksEmptyStateTestsQuery {
  show(id: "example-show-id") {
    ...Show2ArtworksEmptyState_show
    id
  }
}

fragment Show2ArtworksEmptyState_show on Show {
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
    "name": "Show2ArtworksEmptyStateTestsQuery",
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
            "name": "Show2ArtworksEmptyState_show"
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
    "name": "Show2ArtworksEmptyStateTestsQuery",
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
    "id": "67a1bf7675263b3c420297287503b71e",
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
    "name": "Show2ArtworksEmptyStateTestsQuery",
    "operationKind": "query",
    "text": null
  }
};
})();
(node as any).hash = '8b940312f8c529fd88dfa96fca8dbfce';
export default node;
