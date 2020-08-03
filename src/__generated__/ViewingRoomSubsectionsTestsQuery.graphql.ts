/* tslint:disable */
/* eslint-disable */
/* @relayHash 8b0cfabc506e0c5dae38e032cddad68e */

import { ConcreteRequest } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type ViewingRoomSubsectionsTestsQueryVariables = {};
export type ViewingRoomSubsectionsTestsQueryResponse = {
    readonly viewingRoom: {
        readonly " $fragmentRefs": FragmentRefs<"ViewingRoomSubsections_viewingRoom">;
    } | null;
};
export type ViewingRoomSubsectionsTestsQuery = {
    readonly response: ViewingRoomSubsectionsTestsQueryResponse;
    readonly variables: ViewingRoomSubsectionsTestsQueryVariables;
};



/*
query ViewingRoomSubsectionsTestsQuery {
  viewingRoom(id: "unused") {
    ...ViewingRoomSubsections_viewingRoom
  }
}

fragment ViewingRoomSubsections_viewingRoom on ViewingRoom {
  subsections {
    body
    title
    caption
    image {
      imageURLs {
        normalized
      }
    }
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
    "name": "ViewingRoomSubsectionsTestsQuery",
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
            "name": "ViewingRoomSubsections_viewingRoom",
            "args": null
          }
        ]
      }
    ]
  },
  "operation": {
    "kind": "Operation",
    "name": "ViewingRoomSubsectionsTestsQuery",
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
            "kind": "LinkedField",
            "alias": null,
            "name": "subsections",
            "storageKey": null,
            "args": null,
            "concreteType": "ViewingRoomSubsection",
            "plural": true,
            "selections": [
              {
                "kind": "ScalarField",
                "alias": null,
                "name": "body",
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
                "alias": null,
                "name": "caption",
                "args": null,
                "storageKey": null
              },
              {
                "kind": "LinkedField",
                "alias": null,
                "name": "image",
                "storageKey": null,
                "args": null,
                "concreteType": "ARImage",
                "plural": false,
                "selections": [
                  {
                    "kind": "LinkedField",
                    "alias": null,
                    "name": "imageURLs",
                    "storageKey": null,
                    "args": null,
                    "concreteType": "ImageURLs",
                    "plural": false,
                    "selections": [
                      {
                        "kind": "ScalarField",
                        "alias": null,
                        "name": "normalized",
                        "args": null,
                        "storageKey": null
                      }
                    ]
                  }
                ]
              }
            ]
          }
        ]
      }
    ]
  },
  "params": {
    "operationKind": "query",
    "name": "ViewingRoomSubsectionsTestsQuery",
    "id": "b382d3d068ef8920ed28321f1672bcb2",
    "text": null,
    "metadata": {}
  }
};
})();
(node as any).hash = 'a33182889573fa9c4dc7c3b68ad8d822';
export default node;
