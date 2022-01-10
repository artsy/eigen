/* tslint:disable */
/* eslint-disable */
// @ts-nocheck
/* @relayHash 1c991eb60cd20892a67ab024d50d4692 */

import { ConcreteRequest } from "relay-runtime";
export type ViewingRoomsHomeRailQueryVariables = {};
export type ViewingRoomsHomeRailQueryResponse = {
    readonly viewingRooms: {
        readonly edges: ReadonlyArray<{
            readonly node: {
                readonly internalID: string;
                readonly title: string;
                readonly slug: string;
                readonly heroImage: {
                    readonly imageURLs: {
                        readonly normalized: string | null;
                    } | null;
                } | null;
                readonly status: string;
                readonly distanceToOpen: string | null;
                readonly distanceToClose: string | null;
                readonly partner: {
                    readonly name: string | null;
                } | null;
                readonly artworksConnection: {
                    readonly edges: ReadonlyArray<{
                        readonly node: {
                            readonly image: {
                                readonly square: string | null;
                                readonly regular: string | null;
                            } | null;
                        } | null;
                    } | null> | null;
                } | null;
            } | null;
        } | null> | null;
    } | null;
};
export type ViewingRoomsHomeRailQuery = {
    readonly response: ViewingRoomsHomeRailQueryResponse;
    readonly variables: ViewingRoomsHomeRailQueryVariables;
};



/*
query ViewingRoomsHomeRailQuery {
  viewingRooms(first: 10) {
    edges {
      node {
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
    }
  }
}
*/

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "kind": "Literal",
    "name": "first",
    "value": 10
  }
],
v1 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "internalID",
  "storageKey": null
},
v2 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "title",
  "storageKey": null
},
v3 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "slug",
  "storageKey": null
},
v4 = {
  "alias": "heroImage",
  "args": null,
  "concreteType": "ARImage",
  "kind": "LinkedField",
  "name": "image",
  "plural": false,
  "selections": [
    {
      "alias": null,
      "args": null,
      "concreteType": "ImageURLs",
      "kind": "LinkedField",
      "name": "imageURLs",
      "plural": false,
      "selections": [
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "normalized",
          "storageKey": null
        }
      ],
      "storageKey": null
    }
  ],
  "storageKey": null
},
v5 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "status",
  "storageKey": null
},
v6 = [
  {
    "kind": "Literal",
    "name": "short",
    "value": true
  }
],
v7 = {
  "alias": null,
  "args": (v6/*: any*/),
  "kind": "ScalarField",
  "name": "distanceToOpen",
  "storageKey": "distanceToOpen(short:true)"
},
v8 = {
  "alias": null,
  "args": (v6/*: any*/),
  "kind": "ScalarField",
  "name": "distanceToClose",
  "storageKey": "distanceToClose(short:true)"
},
v9 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "name",
  "storageKey": null
},
v10 = [
  {
    "kind": "Literal",
    "name": "first",
    "value": 2
  }
],
v11 = {
  "alias": null,
  "args": null,
  "concreteType": "Image",
  "kind": "LinkedField",
  "name": "image",
  "plural": false,
  "selections": [
    {
      "alias": "square",
      "args": [
        {
          "kind": "Literal",
          "name": "version",
          "value": "square"
        }
      ],
      "kind": "ScalarField",
      "name": "url",
      "storageKey": "url(version:\"square\")"
    },
    {
      "alias": "regular",
      "args": [
        {
          "kind": "Literal",
          "name": "version",
          "value": "larger"
        }
      ],
      "kind": "ScalarField",
      "name": "url",
      "storageKey": "url(version:\"larger\")"
    }
  ],
  "storageKey": null
},
v12 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
};
return {
  "fragment": {
    "argumentDefinitions": [],
    "kind": "Fragment",
    "metadata": null,
    "name": "ViewingRoomsHomeRailQuery",
    "selections": [
      {
        "alias": null,
        "args": (v0/*: any*/),
        "concreteType": "ViewingRoomConnection",
        "kind": "LinkedField",
        "name": "viewingRooms",
        "plural": false,
        "selections": [
          {
            "alias": null,
            "args": null,
            "concreteType": "ViewingRoomEdge",
            "kind": "LinkedField",
            "name": "edges",
            "plural": true,
            "selections": [
              {
                "alias": null,
                "args": null,
                "concreteType": "ViewingRoom",
                "kind": "LinkedField",
                "name": "node",
                "plural": false,
                "selections": [
                  (v1/*: any*/),
                  (v2/*: any*/),
                  (v3/*: any*/),
                  (v4/*: any*/),
                  (v5/*: any*/),
                  (v7/*: any*/),
                  (v8/*: any*/),
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "Partner",
                    "kind": "LinkedField",
                    "name": "partner",
                    "plural": false,
                    "selections": [
                      (v9/*: any*/)
                    ],
                    "storageKey": null
                  },
                  {
                    "alias": null,
                    "args": (v10/*: any*/),
                    "concreteType": "ArtworkConnection",
                    "kind": "LinkedField",
                    "name": "artworksConnection",
                    "plural": false,
                    "selections": [
                      {
                        "alias": null,
                        "args": null,
                        "concreteType": "ArtworkEdge",
                        "kind": "LinkedField",
                        "name": "edges",
                        "plural": true,
                        "selections": [
                          {
                            "alias": null,
                            "args": null,
                            "concreteType": "Artwork",
                            "kind": "LinkedField",
                            "name": "node",
                            "plural": false,
                            "selections": [
                              (v11/*: any*/)
                            ],
                            "storageKey": null
                          }
                        ],
                        "storageKey": null
                      }
                    ],
                    "storageKey": "artworksConnection(first:2)"
                  }
                ],
                "storageKey": null
              }
            ],
            "storageKey": null
          }
        ],
        "storageKey": "viewingRooms(first:10)"
      }
    ],
    "type": "Query",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": [],
    "kind": "Operation",
    "name": "ViewingRoomsHomeRailQuery",
    "selections": [
      {
        "alias": null,
        "args": (v0/*: any*/),
        "concreteType": "ViewingRoomConnection",
        "kind": "LinkedField",
        "name": "viewingRooms",
        "plural": false,
        "selections": [
          {
            "alias": null,
            "args": null,
            "concreteType": "ViewingRoomEdge",
            "kind": "LinkedField",
            "name": "edges",
            "plural": true,
            "selections": [
              {
                "alias": null,
                "args": null,
                "concreteType": "ViewingRoom",
                "kind": "LinkedField",
                "name": "node",
                "plural": false,
                "selections": [
                  (v1/*: any*/),
                  (v2/*: any*/),
                  (v3/*: any*/),
                  (v4/*: any*/),
                  (v5/*: any*/),
                  (v7/*: any*/),
                  (v8/*: any*/),
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "Partner",
                    "kind": "LinkedField",
                    "name": "partner",
                    "plural": false,
                    "selections": [
                      (v9/*: any*/),
                      (v12/*: any*/)
                    ],
                    "storageKey": null
                  },
                  {
                    "alias": null,
                    "args": (v10/*: any*/),
                    "concreteType": "ArtworkConnection",
                    "kind": "LinkedField",
                    "name": "artworksConnection",
                    "plural": false,
                    "selections": [
                      {
                        "alias": null,
                        "args": null,
                        "concreteType": "ArtworkEdge",
                        "kind": "LinkedField",
                        "name": "edges",
                        "plural": true,
                        "selections": [
                          {
                            "alias": null,
                            "args": null,
                            "concreteType": "Artwork",
                            "kind": "LinkedField",
                            "name": "node",
                            "plural": false,
                            "selections": [
                              (v11/*: any*/),
                              (v12/*: any*/)
                            ],
                            "storageKey": null
                          }
                        ],
                        "storageKey": null
                      }
                    ],
                    "storageKey": "artworksConnection(first:2)"
                  }
                ],
                "storageKey": null
              }
            ],
            "storageKey": null
          }
        ],
        "storageKey": "viewingRooms(first:10)"
      }
    ]
  },
  "params": {
    "id": "1c991eb60cd20892a67ab024d50d4692",
    "metadata": {},
    "name": "ViewingRoomsHomeRailQuery",
    "operationKind": "query",
    "text": null
  }
};
})();
(node as any).hash = 'f93b2ba17139a1ac363aa9568ca8900b';
export default node;
