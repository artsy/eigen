/* tslint:disable */
/* eslint-disable */
// @ts-nocheck
/* @relayHash 9f0e327258f6f737e6a758fe7819a051 */

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
    "alias": null,
    "args": [
      {
        "kind": "Literal",
        "name": "id",
        "value": "anderson-fine-art-gallery-flickinger-collection"
      }
    ],
    "concreteType": "Show",
    "kind": "LinkedField",
    "name": "show",
    "plural": false,
    "selections": [
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "id",
        "storageKey": null
      }
    ],
    "storageKey": "show(id:\"anderson-fine-art-gallery-flickinger-collection\")"
  }
];
return {
  "fragment": {
    "argumentDefinitions": [],
    "kind": "Fragment",
    "metadata": null,
    "name": "FilteredInfiniteScrollGridTestsQuery",
    "selections": (v0/*: any*/),
    "type": "Query",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": [],
    "kind": "Operation",
    "name": "FilteredInfiniteScrollGridTestsQuery",
    "selections": (v0/*: any*/)
  },
  "params": {
    "id": "9f0e327258f6f737e6a758fe7819a051",
    "metadata": {},
    "name": "FilteredInfiniteScrollGridTestsQuery",
    "operationKind": "query",
    "text": null
  }
};
})();
(node as any).hash = 'c6ec0db8880f9c9852e9c7b0d455c6ee';
export default node;
