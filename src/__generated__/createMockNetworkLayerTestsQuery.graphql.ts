/* tslint:disable */
/* eslint-disable */
// @ts-nocheck
/* @relayHash 0de7f21178b2e07411e95edac6027432 */

import { ConcreteRequest } from "relay-runtime";
export type createMockNetworkLayerTestsQueryVariables = {};
export type createMockNetworkLayerTestsQueryResponse = {
    readonly artwork: {
        readonly id: string;
        readonly title: string | null;
    } | null;
};
export type createMockNetworkLayerTestsQuery = {
    readonly response: createMockNetworkLayerTestsQueryResponse;
    readonly variables: createMockNetworkLayerTestsQueryVariables;
};



/*
query createMockNetworkLayerTestsQuery {
  artwork(id: "untitled") {
    id
    title
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
        "value": "untitled"
      }
    ],
    "concreteType": "Artwork",
    "kind": "LinkedField",
    "name": "artwork",
    "plural": false,
    "selections": [
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "id",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "title",
        "storageKey": null
      }
    ],
    "storageKey": "artwork(id:\"untitled\")"
  }
];
return {
  "fragment": {
    "argumentDefinitions": [],
    "kind": "Fragment",
    "metadata": null,
    "name": "createMockNetworkLayerTestsQuery",
    "selections": (v0/*: any*/),
    "type": "Query",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": [],
    "kind": "Operation",
    "name": "createMockNetworkLayerTestsQuery",
    "selections": (v0/*: any*/)
  },
  "params": {
    "id": "0de7f21178b2e07411e95edac6027432",
    "metadata": {},
    "name": "createMockNetworkLayerTestsQuery",
    "operationKind": "query",
    "text": null
  }
};
})();
(node as any).hash = '1eeffdf1d257e48e4d0b0d33a8f7a7f8';
export default node;
