/* tslint:disable */

import { ConcreteRequest } from "relay-runtime";
export type FilteredInfiniteScrollGridTestsQueryVariables = {};
export type FilteredInfiniteScrollGridTestsQueryResponse = {
    readonly show: {
        readonly id: string;
    } | null;
};
export type FilteredInfiniteScrollGridTestsQueryRawResponse = {
    readonly show: ({
        readonly id: string;
    }) | null;
};
export type FilteredInfiniteScrollGridTestsQuery = {
    readonly response: FilteredInfiniteScrollGridTestsQueryResponse;
    readonly variables: FilteredInfiniteScrollGridTestsQueryVariables;
    readonly rawResponse: FilteredInfiniteScrollGridTestsQueryRawResponse;
};



/*
query FilteredInfiniteScrollGridTestsQuery {
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
    "name": "FilteredInfiniteScrollGridTestsQuery",
    "type": "Query",
    "metadata": null,
    "argumentDefinitions": [],
    "selections": (v0/*: any*/)
  },
  "operation": {
    "kind": "Operation",
    "name": "FilteredInfiniteScrollGridTestsQuery",
    "argumentDefinitions": [],
    "selections": (v0/*: any*/)
  },
  "params": {
    "operationKind": "query",
    "name": "FilteredInfiniteScrollGridTestsQuery",
    "id": "9f0e327258f6f737e6a758fe7819a051",
    "text": null,
    "metadata": {}
  }
};
})();
(node as any).hash = 'c6ec0db8880f9c9852e9c7b0d455c6ee';
export default node;
