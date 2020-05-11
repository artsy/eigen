/* tslint:disable */
/* eslint-disable */
/* @relayHash 723a0e790a2e99d32952ce067237c0e3 */

import { ConcreteRequest } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type ViewingRoomViewWorksButtonTestsQueryVariables = {};
export type ViewingRoomViewWorksButtonTestsQueryResponse = {
    readonly viewingRoom: {
        readonly " $fragmentRefs": FragmentRefs<"ViewingRoomViewWorksButton_viewingRoom">;
    } | null;
};
export type ViewingRoomViewWorksButtonTestsQuery = {
    readonly response: ViewingRoomViewWorksButtonTestsQueryResponse;
    readonly variables: ViewingRoomViewWorksButtonTestsQueryVariables;
};



/*
query ViewingRoomViewWorksButtonTestsQuery {
  viewingRoom(id: "unused") {
    ...ViewingRoomViewWorksButton_viewingRoom
  }
}

fragment ViewingRoomViewWorksButton_viewingRoom on ViewingRoom {
  slug
  internalID
  artworksForCount: artworksConnection(first: 1) {
    totalCount
  }
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
    "name": "ViewingRoomViewWorksButtonTestsQuery",
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
            "name": "ViewingRoomViewWorksButton_viewingRoom",
            "args": null
          }
        ]
      }
    ]
  },
  "operation": {
    "kind": "Operation",
    "name": "ViewingRoomViewWorksButtonTestsQuery",
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
            "name": "slug",
            "args": null,
            "storageKey": null
          },
          {
            "kind": "ScalarField",
            "alias": null,
            "name": "internalID",
            "args": null,
            "storageKey": null
          },
          {
            "kind": "LinkedField",
            "alias": "artworksForCount",
            "name": "artworksConnection",
            "storageKey": "artworksConnection(first:1)",
            "args": [
              {
                "kind": "Literal",
                "name": "first",
                "value": 1
              }
            ],
            "concreteType": "ArtworkConnection",
            "plural": false,
            "selections": [
              {
                "kind": "ScalarField",
                "alias": null,
                "name": "totalCount",
                "args": null,
                "storageKey": null
              }
            ]
          }
        ]
      }
    ]
  },
  "params": {
    "operationKind": "query",
    "name": "ViewingRoomViewWorksButtonTestsQuery",
    "id": "3960f85b2ede3eeda1d48fe7915aa558",
    "text": null,
    "metadata": {}
  }
};
})();
(node as any).hash = 'e152f6981fa5beacc0e6b5874c62c16d';
export default node;
