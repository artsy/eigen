/* tslint:disable */

import { ConcreteRequest } from "relay-runtime";
export type createMockNetworkLayerTestsQueryVariables = {};
export type createMockNetworkLayerTestsQueryResponse = {
    readonly artwork: ({
        readonly __id: string;
        readonly title: string | null;
    }) | null;
};
export type createMockNetworkLayerTestsQuery = {
    readonly response: createMockNetworkLayerTestsQueryResponse;
    readonly variables: createMockNetworkLayerTestsQueryVariables;
};



/*
query createMockNetworkLayerTestsQuery {
  artwork(id: "untitled") {
    __id
    title
  }
}
*/

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "kind": "LinkedField",
    "alias": null,
    "name": "artwork",
    "storageKey": "artwork(id:\"untitled\")",
    "args": [
      {
        "kind": "Literal",
        "name": "id",
        "value": "untitled",
        "type": "String!"
      }
    ],
    "concreteType": "Artwork",
    "plural": false,
    "selections": [
      {
        "kind": "ScalarField",
        "alias": null,
        "name": "__id",
        "args": null,
        "storageKey": null
      },
      {
        "kind": "ScalarField",
        "alias": null,
        "name": "title",
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
    "name": "createMockNetworkLayerTestsQuery",
    "type": "Query",
    "metadata": null,
    "argumentDefinitions": [],
    "selections": (v0/*: any*/)
  },
  "operation": {
    "kind": "Operation",
    "name": "createMockNetworkLayerTestsQuery",
    "argumentDefinitions": [],
    "selections": (v0/*: any*/)
  },
  "params": {
    "operationKind": "query",
    "name": "createMockNetworkLayerTestsQuery",
    "id": "7c4943257f47c5a4f37e5c5212530eb1",
    "text": null,
    "metadata": {}
  }
};
})();
(node as any).hash = '7c4943257f47c5a4f37e5c5212530eb1';
export default node;
