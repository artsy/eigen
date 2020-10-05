/* tslint:disable */
/* eslint-disable */
// @ts-nocheck
/* @relayHash 3aa67395999eac5f8e55a6646e7ee361 */

import { ConcreteRequest } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type Show2TestsQueryVariables = {
    showID: string;
};
export type Show2TestsQueryResponse = {
    readonly show: {
        readonly " $fragmentRefs": FragmentRefs<"Show2_show">;
    } | null;
};
export type Show2TestsQuery = {
    readonly response: Show2TestsQueryResponse;
    readonly variables: Show2TestsQueryVariables;
};



/*
query Show2TestsQuery(
  $showID: String!
) {
  show(id: $showID) {
    ...Show2_show
    id
  }
}

fragment Show2_show on Show {
  name
}
*/

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "showID"
  }
],
v1 = [
  {
    "kind": "Variable",
    "name": "id",
    "variableName": "showID"
  }
];
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "Show2TestsQuery",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": "Show",
        "kind": "LinkedField",
        "name": "show",
        "plural": false,
        "selections": [
          {
            "args": null,
            "kind": "FragmentSpread",
            "name": "Show2_show"
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
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "Show2TestsQuery",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": "Show",
        "kind": "LinkedField",
        "name": "show",
        "plural": false,
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
            "name": "id",
            "storageKey": null
          }
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "id": "3aa67395999eac5f8e55a6646e7ee361",
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
        "show.name": {
          "enumValues": null,
          "nullable": true,
          "plural": false,
          "type": "String"
        }
      }
    },
    "name": "Show2TestsQuery",
    "operationKind": "query",
    "text": null
  }
};
})();
(node as any).hash = 'd6fbb3afb1d102b089523c9a4dbd9c5f';
export default node;
