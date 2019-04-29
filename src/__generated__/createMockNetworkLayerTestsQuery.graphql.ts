/* tslint:disable */

import { ConcreteRequest } from "relay-runtime";
export type createMockNetworkLayerTestsQueryVariables = {};
export type createMockNetworkLayerTestsQueryResponse = {
    readonly artwork: ({
        readonly id: string;
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
    id
    title
    __id: id
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
        "name": "id",
        "args": null,
        "storageKey": null
      },
      {
        "kind": "ScalarField",
        "alias": null,
        "name": "title",
        "args": null,
        "storageKey": null
      },
      {
        "kind": "ScalarField",
        "alias": "__id",
        "name": "id",
        "args": null,
        "storageKey": null
      }
    ]
  }
];
return {
  "kind": "Request",
  "operationKind": "query",
  "name": "createMockNetworkLayerTestsQuery",
  "id": null,
  "text": "query createMockNetworkLayerTestsQuery {\n  artwork(id: \"untitled\") {\n    id\n    title\n    __id: id\n  }\n}\n",
  "metadata": {},
  "fragment": {
    "kind": "Fragment",
    "name": "createMockNetworkLayerTestsQuery",
    "type": "Query",
    "metadata": null,
    "argumentDefinitions": [],
    "selections": v0
  },
  "operation": {
    "kind": "Operation",
    "name": "createMockNetworkLayerTestsQuery",
    "argumentDefinitions": [],
    "selections": v0
  }
};
})();
(node as any).hash = '1eeffdf1d257e48e4d0b0d33a8f7a7f8';
export default node;
