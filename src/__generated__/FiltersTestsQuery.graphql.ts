/* tslint:disable */

import { ConcreteRequest } from "relay-runtime";
export type FiltersTestsQueryVariables = {};
export type FiltersTestsQueryResponse = {
    readonly show: {
        readonly id: string;
    } | null;
};
export type FiltersTestsQuery = {
    readonly response: FiltersTestsQueryResponse;
    readonly variables: FiltersTestsQueryVariables;
};



/*
query FiltersTestsQuery {
  show(id: "anderson-fine-art-gallery-flickinger-collection") {
    id
  }
}
*/

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "kind": "LinkedField",
    "alias": null,
    "name": "show",
    "storageKey": "show(id:\"anderson-fine-art-gallery-flickinger-collection\")",
    "args": [
      {
        "kind": "Literal",
        "name": "id",
        "value": "anderson-fine-art-gallery-flickinger-collection"
      }
    ],
    "concreteType": "Show",
    "plural": false,
    "selections": [
      {
        "kind": "ScalarField",
        "alias": null,
        "name": "id",
        "args": null,
        "storageKey": null
      }
    ]
  }
];
return {
  "kind": "Request",
  "fragment": {
    "kind": "Fragment",
    "name": "FiltersTestsQuery",
    "type": "Query",
    "metadata": null,
    "argumentDefinitions": [],
    "selections": (v0/*: any*/)
  },
  "operation": {
    "kind": "Operation",
    "name": "FiltersTestsQuery",
    "argumentDefinitions": [],
    "selections": (v0/*: any*/)
  },
  "params": {
    "operationKind": "query",
    "name": "FiltersTestsQuery",
    "id": "0690e06ee79f5c42829d0b519d4df860",
    "text": null,
    "metadata": {}
  }
};
})();
(node as any).hash = '6075eaec6480f51930c5169580143212';
export default node;
