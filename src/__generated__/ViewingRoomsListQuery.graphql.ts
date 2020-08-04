/* tslint:disable */
/* eslint-disable */
/* @relayHash 2172697cd5e1845add2422357d1e0764 */

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
var v0 = [
  {
    "kind": "LocalArgument",
    "name": "count",
    "type": "Int!",
    "defaultValue": null
  },
  {
    "kind": "LocalArgument",
    "name": "after",
    "type": "String",
    "defaultValue": null
  }
],
v1 = [
  {
    "kind": "Literal",
    "name": "featured",
    "value": true
  }
],
v2 = {
  "kind": "Variable",
  "name": "after",
  "variableName": "after"
},
v3 = [
  (v2/*: any*/),
  {
    "kind": "Variable",
    "name": "first",
    "variableName": "count"
  }
],
v4 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "internalID",
  "args": null,
  "storageKey": null
},
v5 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "title",
  "args": null,
  "storageKey": null
},
v6 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "slug",
  "args": null,
  "storageKey": null
},
v7 = {
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
v8 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "status",
  "args": null,
  "storageKey": null
},
v9 = [
  {
    "kind": "Literal",
    "name": "short",
    "value": true
  }
],
v10 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "distanceToOpen",
  "args": (v9/*: any*/),
  "storageKey": "distanceToOpen(short:true)"
},
v11 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "distanceToClose",
  "args": (v9/*: any*/),
  "storageKey": "distanceToClose(short:true)"
},
v12 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "id",
  "args": null,
  "storageKey": null
},
v13 = {
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
    (v12/*: any*/)
  ]
};
return {
  "kind": "Request",
  "fragment": {
    "kind": "Fragment",
    "name": "ViewingRoomsListQuery",
    "type": "Query",
    "metadata": null,
    "argumentDefinitions": (v0/*: any*/),
    "selections": [
      {
        "kind": "LinkedField",
        "alias": "featured",
        "name": "viewingRooms",
        "storageKey": "viewingRooms(featured:true)",
        "args": (v1/*: any*/),
        "concreteType": "ViewingRoomConnection",
        "plural": false,
        "selections": [
          {
            "kind": "FragmentSpread",
            "name": "ViewingRoomsListFeatured_featured",
            "args": null
          }
        ]
      },
      {
        "kind": "FragmentSpread",
        "name": "ViewingRoomsList_query",
        "args": [
          (v2/*: any*/),
          {
            "kind": "Variable",
            "name": "count",
            "variableName": "count"
          }
        ]
      }
    ]
  },
  "operation": {
    "kind": "Operation",
    "name": "ViewingRoomsListQuery",
    "argumentDefinitions": (v0/*: any*/),
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "viewingRooms",
        "storageKey": null,
        "args": (v3/*: any*/),
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
                  (v4/*: any*/),
                  (v5/*: any*/),
                  (v6/*: any*/),
                  (v7/*: any*/),
                  (v8/*: any*/),
                  (v10/*: any*/),
                  (v11/*: any*/),
                  (v13/*: any*/),
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
                              (v12/*: any*/)
                            ]
                          }
                        ]
                      }
                    ]
                  },
                  {
                    "kind": "ScalarField",
                    "alias": null,
                    "name": "__typename",
                    "args": null,
                    "storageKey": null
                  }
                ]
              },
              {
                "kind": "ScalarField",
                "alias": null,
                "name": "cursor",
                "args": null,
                "storageKey": null
              }
            ]
          },
          {
            "kind": "LinkedField",
            "alias": null,
            "name": "pageInfo",
            "storageKey": null,
            "args": null,
            "concreteType": "PageInfo",
            "plural": false,
            "selections": [
              {
                "kind": "ScalarField",
                "alias": null,
                "name": "endCursor",
                "args": null,
                "storageKey": null
              },
              {
                "kind": "ScalarField",
                "alias": null,
                "name": "hasNextPage",
                "args": null,
                "storageKey": null
              }
            ]
          }
        ]
      },
      {
        "kind": "LinkedHandle",
        "alias": null,
        "name": "viewingRooms",
        "args": (v3/*: any*/),
        "handle": "connection",
        "key": "ViewingRoomsList_viewingRooms",
        "filters": null
      },
      {
        "kind": "LinkedField",
        "alias": "featured",
        "name": "viewingRooms",
        "storageKey": "viewingRooms(featured:true)",
        "args": (v1/*: any*/),
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
                  (v4/*: any*/),
                  (v5/*: any*/),
                  (v6/*: any*/),
                  (v7/*: any*/),
                  (v8/*: any*/),
                  (v10/*: any*/),
                  (v11/*: any*/),
                  (v13/*: any*/)
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
    "name": "ViewingRoomsListQuery",
    "id": "19e66aaceeae9b4eafa941afcca9e062",
    "text": null,
    "metadata": {}
  }
};
})();
(node as any).hash = '3d1c2451ec77b4acaa97260bd41e0f81';
export default node;
