/* tslint:disable */
/* eslint-disable */
// @ts-nocheck
/* @relayHash 207ffadb89e876c48325a5ab1e132905 */

import { ConcreteRequest } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type Show2QueryVariables = {
    showID: string;
};
export type Show2QueryResponse = {
    readonly show: {
        readonly " $fragmentRefs": FragmentRefs<"Show2_show">;
    } | null;
};
export type Show2Query = {
    readonly response: Show2QueryResponse;
    readonly variables: Show2QueryVariables;
};



/*
query Show2Query(
  $showID: String!
) {
  show(id: $showID) @principalField {
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
    "name": "Show2Query",
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
    "name": "Show2Query",
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
    "id": "207ffadb89e876c48325a5ab1e132905",
    "metadata": {},
    "name": "Show2Query",
    "operationKind": "query",
    "text": null
  }
};
})();
(node as any).hash = '35f7ce1004b67e044e9811883202ce7c';
export default node;
