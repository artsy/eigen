/* tslint:disable */
/* eslint-disable */
/* @relayHash 1dee6a4c45aabd5cc3d3d459667e4079 */

import { ConcreteRequest } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type ViewingRoomsHomeRailQueryVariables = {};
export type ViewingRoomsHomeRailQueryResponse = {
    readonly " $fragmentRefs": FragmentRefs<"ViewingRoomsHomeRail_regular">;
};
export type ViewingRoomsHomeRailQuery = {
    readonly response: ViewingRoomsHomeRailQueryResponse;
    readonly variables: ViewingRoomsHomeRailQueryVariables;
};



/*
query ViewingRoomsHomeRailQuery {
  ...ViewingRoomsHomeRail_regular
}

fragment ViewingRoomsHomeRail_regular on Query {
  viewingRooms(first: 10) {
    edges {
      node {
        internalID
        ...ViewingRoomsListItem_item
        title
        slug
        heroImage: image {
          imageURLs {
            normalized
          }
        }
        status
        distanceToOpen(short: true)
        distanceToClose(short: true)
        partner {
          name
          id
        }
        artworksConnection(first: 2) {
          edges {
            node {
              image {
                square: url(version: "square")
                regular: url(version: "larger")
              }
              id
            }
          }
        }
      }
    }
  }
}

fragment ViewingRoomsListItem_item on ViewingRoom {
  internalID
  title
  slug
  heroImage: image {
    imageURLs {
      normalized
    }
  }
  status
  distanceToOpen(short: true)
  distanceToClose(short: true)
  partner {
    name
    id
  }
  artworksConnection(first: 2) {
    edges {
      node {
        image {
          square: url(version: "square")
          regular: url(version: "larger")
        }
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
    "name": "short",
    "value": true
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
    "name": "ViewingRoomsHomeRailQuery",
    "type": "Query",
    "metadata": null,
    "argumentDefinitions": [],
    "selections": [
      {
        "kind": "FragmentSpread",
        "name": "ViewingRoomsHomeRail_regular",
        "args": null
      }
    ]
  },
  "operation": {
    "kind": "Operation",
    "name": "ViewingRoomsHomeRailQuery",
    "argumentDefinitions": [],
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "viewingRooms",
        "storageKey": "viewingRooms(first:10)",
        "args": [
          {
            "kind": "Literal",
            "name": "first",
            "value": 10
          }
        ],
        "concreteType": "ViewingRoomConnection",
        "plural": false,
        "selections": [
          {
            "kind": "LinkedField",
            "alias": null,
            "name": "edges",
            "storageKey": null,
            "args": null,
            "concreteType": "ViewingRoomEdge",
            "plural": true,
            "selections": [
              {
                "kind": "LinkedField",
                "alias": null,
                "name": "node",
                "storageKey": null,
                "args": null,
                "concreteType": "ViewingRoom",
                "plural": false,
                "selections": [
                  {
                    "kind": "ScalarField",
                    "alias": null,
                    "name": "internalID",
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
                    "name": "slug",
                    "args": null,
                    "storageKey": null
                  },
                  {
                    "kind": "LinkedField",
                    "alias": "heroImage",
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
                  },
                  {
                    "kind": "ScalarField",
                    "alias": null,
                    "name": "status",
                    "args": null,
                    "storageKey": null
                  },
                  {
                    "kind": "ScalarField",
                    "alias": null,
                    "name": "distanceToOpen",
                    "args": (v0/*: any*/),
                    "storageKey": "distanceToOpen(short:true)"
                  },
                  {
                    "kind": "ScalarField",
                    "alias": null,
                    "name": "distanceToClose",
                    "args": (v0/*: any*/),
                    "storageKey": "distanceToClose(short:true)"
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
                      (v1/*: any*/)
                    ]
                  },
                  {
                    "kind": "LinkedField",
                    "alias": null,
                    "name": "artworksConnection",
                    "storageKey": "artworksConnection(first:2)",
                    "args": [
                      {
                        "kind": "Literal",
                        "name": "first",
                        "value": 2
                      }
                    ],
                    "concreteType": "ArtworkConnection",
                    "plural": false,
                    "selections": [
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
                                    "alias": "square",
                                    "name": "url",
                                    "args": [
                                      {
                                        "kind": "Literal",
                                        "name": "version",
                                        "value": "square"
                                      }
                                    ],
                                    "storageKey": "url(version:\"square\")"
                                  },
                                  {
                                    "kind": "ScalarField",
                                    "alias": "regular",
                                    "name": "url",
                                    "args": [
                                      {
                                        "kind": "Literal",
                                        "name": "version",
                                        "value": "larger"
                                      }
                                    ],
                                    "storageKey": "url(version:\"larger\")"
                                  }
                                ]
                              },
                              (v1/*: any*/)
                            ]
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
      }
    ]
  },
  "params": {
    "operationKind": "query",
    "name": "ViewingRoomsHomeRailQuery",
    "id": "564a78be609db60f2cf10193af32a0e2",
    "text": null,
    "metadata": {}
  }
};
})();
(node as any).hash = '0f49a7ead2d5f68b969c3bc9aba8fbc7';
export default node;
