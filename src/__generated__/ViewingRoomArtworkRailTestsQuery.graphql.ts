/* tslint:disable */
/* eslint-disable */
/* @relayHash 9eaef2da5306ee058ca16d124844ad26 */

import { ConcreteRequest } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type ViewingRoomArtworkRailTestsQueryVariables = {};
export type ViewingRoomArtworkRailTestsQueryResponse = {
    readonly viewingRoom: {
        readonly " $fragmentRefs": FragmentRefs<"ViewingRoomArtworkRail_viewingRoom">;
    } | null;
};
export type ViewingRoomArtworkRailTestsQuery = {
    readonly response: ViewingRoomArtworkRailTestsQueryResponse;
    readonly variables: ViewingRoomArtworkRailTestsQueryVariables;
};



/*
query ViewingRoomArtworkRailTestsQuery {
  viewingRoom(id: "unused") {
    ...ViewingRoomArtworkRail_viewingRoom
  }
}

fragment ViewingRoomArtworkRail_viewingRoom on ViewingRoom {
  slug
  internalID
  artworks: artworksConnection(first: 5) {
    totalCount
    edges {
      node {
        slug
        internalID
        href
        artistNames
        image {
          url(version: "square")
        }
        saleMessage
        id
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
],
v1 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "slug",
  "args": null,
  "storageKey": null
},
v2 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "internalID",
  "args": null,
  "storageKey": null
};
return {
  "kind": "Request",
  "fragment": {
    "kind": "Fragment",
    "name": "ViewingRoomArtworkRailTestsQuery",
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
            "name": "ViewingRoomArtworkRail_viewingRoom",
            "args": null
          }
        ]
      }
    ]
  },
  "operation": {
    "kind": "Operation",
    "name": "ViewingRoomArtworkRailTestsQuery",
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
          (v1/*: any*/),
          (v2/*: any*/),
          {
            "kind": "LinkedField",
            "alias": "artworks",
            "name": "artworksConnection",
            "storageKey": "artworksConnection(first:5)",
            "args": [
              {
                "kind": "Literal",
                "name": "first",
                "value": 5
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
              },
              {
                "kind": "LinkedField",
                "alias": null,
                "name": "edges",
                "storageKey": null,
                "args": null,
                "concreteType": "ArtworkEdge",
                "plural": true,
                "selections": [
                  {
                    "kind": "LinkedField",
                    "alias": null,
                    "name": "node",
                    "storageKey": null,
                    "args": null,
                    "concreteType": "Artwork",
                    "plural": false,
                    "selections": [
                      (v1/*: any*/),
                      (v2/*: any*/),
                      {
                        "kind": "ScalarField",
                        "alias": null,
                        "name": "href",
                        "args": null,
                        "storageKey": null
                      },
                      {
                        "kind": "ScalarField",
                        "alias": null,
                        "name": "artistNames",
                        "args": null,
                        "storageKey": null
                      },
                      {
                        "kind": "LinkedField",
                        "alias": null,
                        "name": "image",
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
                      {
                        "kind": "ScalarField",
                        "alias": null,
                        "name": "saleMessage",
                        "args": null,
                        "storageKey": null
                      },
                      {
                        "kind": "ScalarField",
                        "alias": null,
                        "name": "id",
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
    "name": "ViewingRoomArtworkRailTestsQuery",
    "id": "03ff08ff66732b74a32b1169004d2143",
    "text": null,
    "metadata": {}
  }
};
})();
(node as any).hash = 'fcc545a29322194f9415c9653529a1ff';
export default node;
