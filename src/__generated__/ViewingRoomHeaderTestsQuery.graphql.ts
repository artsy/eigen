/* tslint:disable */
/* eslint-disable */
/* @relayHash d19d7f7b79cb3a92b7cb581bc20e65ee */

import { ConcreteRequest } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type ViewingRoomHeaderTestsQueryVariables = {};
export type ViewingRoomHeaderTestsQueryResponse = {
    readonly viewingRoom: {
        readonly " $fragmentRefs": FragmentRefs<"ViewingRoomHeader_viewingRoom">;
    } | null;
};
export type ViewingRoomHeaderTestsQuery = {
    readonly response: ViewingRoomHeaderTestsQueryResponse;
    readonly variables: ViewingRoomHeaderTestsQueryVariables;
};



/*
query ViewingRoomHeaderTestsQuery {
  viewingRoom(id: "unused") {
    ...ViewingRoomHeader_viewingRoom
  }
}

fragment ViewingRoomHeader_viewingRoom on ViewingRoom {
  title
  startAt
  endAt
  heroImageURL
}
*/

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "kind": "Literal",
    "name": "id",
    "value": "unused"
  }
];
return {
  "kind": "Request",
  "fragment": {
    "kind": "Fragment",
    "name": "ViewingRoomHeaderTestsQuery",
    "type": "Query",
    "metadata": null,
    "argumentDefinitions": [],
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "viewingRoom",
        "storageKey": "viewingRoom(id:\"unused\")",
        "args": (v0/*: any*/),
        "concreteType": "ViewingRoom",
        "plural": false,
        "selections": [
          {
            "kind": "FragmentSpread",
            "name": "ViewingRoomHeader_viewingRoom",
            "args": null
          }
        ]
      }
    ]
  },
  "operation": {
    "kind": "Operation",
    "name": "ViewingRoomHeaderTestsQuery",
    "argumentDefinitions": [],
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "viewingRoom",
        "storageKey": "viewingRoom(id:\"unused\")",
        "args": (v0/*: any*/),
        "concreteType": "ViewingRoom",
        "plural": false,
        "selections": [
          {
            "kind": "ScalarField",
            "alias": null,
            "name": "title",
            "args": null,
            "storageKey": null
          },
          {
            "kind": "ScalarField",
            "alias": null,
            "name": "startAt",
            "args": null,
            "storageKey": null
          },
          {
            "kind": "ScalarField",
            "alias": null,
            "name": "endAt",
            "args": null,
            "storageKey": null
          },
          {
            "kind": "ScalarField",
            "alias": null,
            "name": "heroImageURL",
            "args": null,
            "storageKey": null
          }
        ]
      }
    ]
  },
  "params": {
    "operationKind": "query",
    "name": "ViewingRoomHeaderTestsQuery",
    "id": "26e6a9ed6ba1a2e1601b21127248a348",
    "text": null,
    "metadata": {}
  }
};
})();
(node as any).hash = '0a5636987f0eed565afb1b268ec6f48c';
export default node;
