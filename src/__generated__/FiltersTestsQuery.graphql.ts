/* tslint:disable */
/* eslint-disable */
// @ts-nocheck
/* @relayHash 0690e06ee79f5c42829d0b519d4df860 */

import { ConcreteRequest } from "relay-runtime";
export type FiltersTestsQueryVariables = {};
export type FiltersTestsQueryResponse = {
    readonly show: {
        readonly id: string;
    } | null;
};
export type FiltersTestsQueryRawResponse = {
    readonly show: ({
        readonly id: string;
    }) | null;
};
export type FiltersTestsQuery = {
    readonly response: FiltersTestsQueryResponse;
    readonly variables: FiltersTestsQueryVariables;
    readonly rawResponse: FiltersTestsQueryRawResponse;
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
    "name": "FiltersTestsQuery",
    "selections": (v0/*: any*/),
    "type": "Query",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": [],
    "kind": "Operation",
    "name": "FiltersTestsQuery",
    "selections": (v0/*: any*/)
  },
  "params": {
    "id": "0690e06ee79f5c42829d0b519d4df860",
    "metadata": {},
    "name": "FiltersTestsQuery",
    "operationKind": "query",
    "text": null
  }
};
})();
(node as any).hash = '6a8f5448c878b9bd72c34520bb8256d1';
export default node;
