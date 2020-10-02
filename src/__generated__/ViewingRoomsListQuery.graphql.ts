/* tslint:disable */
/* eslint-disable */
// @ts-nocheck
/* @relayHash 19e66aaceeae9b4eafa941afcca9e062 */

import { ConcreteRequest } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type ViewingRoomsListQueryVariables = {
    count: number;
    after?: string | null;
};
export type ViewingRoomsListQueryResponse = {
    readonly featured: {
        readonly " $fragmentRefs": FragmentRefs<"ViewingRoomsListFeatured_featured">;
    } | null;
    readonly " $fragmentRefs": FragmentRefs<"ViewingRoomsList_query">;
};
export type ViewingRoomsListQuery = {
    readonly response: ViewingRoomsListQueryResponse;
    readonly variables: ViewingRoomsListQueryVariables;
};



/*
query ViewingRoomsListQuery(
  $count: Int!
  $after: String
) {
  ...ViewingRoomsList_query_2QE1um
  featured: viewingRooms(featured: true) {
    ...ViewingRoomsListFeatured_featured
  }
}

fragment ViewingRoomsListFeatured_featured on ViewingRoomConnection {
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

fragment ViewingRoomsList_query_2QE1um on Query {
  viewingRooms(first: $count, after: $after) {
    edges {
      node {
        internalID
        ...ViewingRoomsListItem_item
        __typename
      }
      cursor
    }
    pageInfo {
      endCursor
      hasNextPage
    }
  }
}
*/

const node: ConcreteRequest = (function(){
var v0 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "after"
},
v1 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "count"
},
v2 = [
  {
    "kind": "Literal",
    "name": "featured",
    "value": true
  }
],
v3 = {
  "kind": "Variable",
  "name": "after",
  "variableName": "after"
},
v4 = [
  (v3/*: any*/),
  {
    "kind": "Variable",
    "name": "first",
    "variableName": "count"
  }
],
v5 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "internalID",
  "storageKey": null
},
v6 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "title",
  "storageKey": null
},
v7 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "slug",
  "storageKey": null
},
v8 = {
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
v9 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "status",
  "storageKey": null
},
v10 = [
  {
    "kind": "Literal",
    "name": "short",
    "value": true
  }
],
v11 = {
  "alias": null,
  "args": (v10/*: any*/),
  "kind": "ScalarField",
  "name": "distanceToOpen",
  "storageKey": "distanceToOpen(short:true)"
},
v12 = {
  "alias": null,
  "args": (v10/*: any*/),
  "kind": "ScalarField",
  "name": "distanceToClose",
  "storageKey": "distanceToClose(short:true)"
},
v13 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
},
v14 = {
  "alias": null,
  "args": null,
  "concreteType": "Partner",
  "kind": "LinkedField",
  "name": "partner",
  "plural": false,
  "selections": [
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "name",
      "storageKey": null
    },
    (v13/*: any*/)
  ],
  "storageKey": null
};
return {
  "fragment": {
    "argumentDefinitions": [
      (v0/*: any*/),
      (v1/*: any*/)
    ],
    "kind": "Fragment",
    "metadata": null,
    "name": "ViewingRoomsListQuery",
    "selections": [
      {
        "alias": "featured",
        "args": (v2/*: any*/),
        "concreteType": "ViewingRoomConnection",
        "kind": "LinkedField",
        "name": "viewingRooms",
        "plural": false,
        "selections": [
          {
            "args": null,
            "kind": "FragmentSpread",
            "name": "ViewingRoomsListFeatured_featured"
          }
        ],
        "storageKey": "viewingRooms(featured:true)"
      },
      {
        "args": [
          (v3/*: any*/),
          {
            "kind": "Variable",
            "name": "count",
            "variableName": "count"
          }
        ],
        "kind": "FragmentSpread",
        "name": "ViewingRoomsList_query"
      }
    ],
    "type": "Query",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": [
      (v1/*: any*/),
      (v0/*: any*/)
    ],
    "kind": "Operation",
    "name": "ViewingRoomsListQuery",
    "selections": [
      {
        "alias": null,
        "args": (v4/*: any*/),
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
                  (v5/*: any*/),
                  (v6/*: any*/),
                  (v7/*: any*/),
                  (v8/*: any*/),
                  (v9/*: any*/),
                  (v11/*: any*/),
                  (v12/*: any*/),
                  (v14/*: any*/),
                  {
                    "alias": null,
                    "args": [
                      {
                        "kind": "Literal",
                        "name": "first",
                        "value": 2
                      }
                    ],
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
                              {
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
                              (v13/*: any*/)
                            ],
                            "storageKey": null
                          }
                        ],
                        "storageKey": null
                      }
                    ],
                    "storageKey": "artworksConnection(first:2)"
                  },
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "__typename",
                    "storageKey": null
                  }
                ],
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "cursor",
                "storageKey": null
              }
            ],
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "concreteType": "PageInfo",
            "kind": "LinkedField",
            "name": "pageInfo",
            "plural": false,
            "selections": [
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "endCursor",
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "hasNextPage",
                "storageKey": null
              }
            ],
            "storageKey": null
          }
        ],
        "storageKey": null
      },
      {
        "alias": null,
        "args": (v4/*: any*/),
        "filters": null,
        "handle": "connection",
        "key": "ViewingRoomsList_viewingRooms",
        "kind": "LinkedHandle",
        "name": "viewingRooms"
      },
      {
        "alias": "featured",
        "args": (v2/*: any*/),
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
                  (v5/*: any*/),
                  (v6/*: any*/),
                  (v7/*: any*/),
                  (v8/*: any*/),
                  (v9/*: any*/),
                  (v11/*: any*/),
                  (v12/*: any*/),
                  (v14/*: any*/)
                ],
                "storageKey": null
              }
            ],
            "storageKey": null
          }
        ],
        "storageKey": "viewingRooms(featured:true)"
      }
    ]
  },
  "params": {
    "id": "19e66aaceeae9b4eafa941afcca9e062",
    "metadata": {},
    "name": "ViewingRoomsListQuery",
    "operationKind": "query",
    "text": null
  }
};
})();
(node as any).hash = '3d1c2451ec77b4acaa97260bd41e0f81';
export default node;
