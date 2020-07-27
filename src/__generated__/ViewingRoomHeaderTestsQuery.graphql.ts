/* tslint:disable */
/* eslint-disable */
/* @relayHash bc3783ad8c3444e657a73223597d30d9 */

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
  status
  image {
    imageURLs {
      heroImage: normalized
    }
  }
  partner {
    name
    href
    profile {
      icon {
        url(version: "square")
      }
      id
    }
    id
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
],
v1 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "id",
  "args": null,
  "storageKey": null
};
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
            "name": "status",
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
                    "alias": "heroImage",
                    "name": "normalized",
                    "args": null,
                    "storageKey": null
                  }
                ]
              }
            ]
          },
          {
            "kind": "LinkedField",
            "alias": null,
            "name": "partner",
            "storageKey": null,
            "args": null,
            "concreteType": "Partner",
            "plural": false,
            "selections": [
              {
                "kind": "ScalarField",
                "alias": null,
                "name": "name",
                "args": null,
                "storageKey": null
              },
              {
                "kind": "ScalarField",
                "alias": null,
                "name": "href",
                "args": null,
                "storageKey": null
              },
              {
                "kind": "LinkedField",
                "alias": null,
                "name": "profile",
                "storageKey": null,
                "args": null,
                "concreteType": "Profile",
                "plural": false,
                "selections": [
                  {
                    "kind": "LinkedField",
                    "alias": null,
                    "name": "icon",
                    "storageKey": null,
                    "args": null,
                    "concreteType": "Image",
                    "plural": false,
                    "selections": [
                      {
                        "kind": "ScalarField",
                        "alias": null,
                        "name": "url",
                        "args": [
                          {
                            "kind": "Literal",
                            "name": "version",
                            "value": "square"
                          }
                        ],
                        "storageKey": "url(version:\"square\")"
                      }
                    ]
                  },
                  (v1/*: any*/)
                ]
              },
              (v1/*: any*/)
            ]
          }
        ]
      }
    ]
  },
  "params": {
    "operationKind": "query",
    "name": "ViewingRoomHeaderTestsQuery",
    "id": "d7e2199ef9c862c0757d5bb1bae85ba3",
    "text": null,
    "metadata": {}
  }
};
})();
(node as any).hash = '0a5636987f0eed565afb1b268ec6f48c';
export default node;
