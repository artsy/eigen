/* tslint:disable */
/* eslint-disable */
// @ts-nocheck
/* @relayHash 58781284812075128c26220d93893d2d */

import { ConcreteRequest } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type ViewingRoomsList_viewingRoomsRefetchVariables = {
    after?: string | null | undefined;
    count?: number | null | undefined;
};
export type ViewingRoomsList_viewingRoomsRefetchResponse = {
    readonly " $fragmentRefs": FragmentRefs<"ViewingRoomsList_viewingRooms">;
};
export type ViewingRoomsList_viewingRoomsRefetch = {
    readonly response: ViewingRoomsList_viewingRoomsRefetchResponse;
    readonly variables: ViewingRoomsList_viewingRoomsRefetchVariables;
};



/*
query ViewingRoomsList_viewingRoomsRefetch(
  $after: String
  $count: Int
) {
  ...ViewingRoomsList_viewingRooms_2QE1um
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

fragment ViewingRoomsList_viewingRooms_2QE1um on Query {
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
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "after"
  },
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "count"
  }
],
v1 = {
  "kind": "Variable",
  "name": "after",
  "variableName": "after"
},
v2 = [
  (v1/*: any*/),
  {
    "kind": "Variable",
    "name": "first",
    "variableName": "count"
  }
],
v3 = [
  {
    "kind": "Literal",
    "name": "short",
    "value": true
  }
],
v4 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
};
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "ViewingRoomsList_viewingRoomsRefetch",
    "selections": [
      {
        "args": [
          (v1/*: any*/),
          {
            "kind": "Variable",
            "name": "count",
            "variableName": "count"
          }
        ],
        "kind": "FragmentSpread",
        "name": "ViewingRoomsList_viewingRooms"
      }
    ],
    "type": "Query",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "ViewingRoomsList_viewingRoomsRefetch",
    "selections": [
      {
        "alias": null,
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
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "internalID",
                    "storageKey": null
                  },
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "title",
                    "storageKey": null
                  },
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "slug",
                    "storageKey": null
                  },
                  {
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
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "status",
                    "storageKey": null
                  },
                  {
                    "alias": null,
                    "args": (v3/*: any*/),
                    "kind": "ScalarField",
                    "name": "distanceToOpen",
                    "storageKey": "distanceToOpen(short:true)"
                  },
                  {
                    "alias": null,
                    "args": (v3/*: any*/),
                    "kind": "ScalarField",
                    "name": "distanceToClose",
                    "storageKey": "distanceToClose(short:true)"
                  },
                  {
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
                      (v4/*: any*/)
                    ],
                    "storageKey": null
                  },
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
                              (v4/*: any*/)
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
        "args": (v2/*: any*/),
        "filters": null,
        "handle": "connection",
        "key": "ViewingRoomsList_viewingRooms",
        "kind": "LinkedHandle",
        "name": "viewingRooms"
      }
    ]
  },
  "params": {
    "id": "58781284812075128c26220d93893d2d",
    "metadata": {},
    "name": "ViewingRoomsList_viewingRoomsRefetch",
    "operationKind": "query",
    "text": null
  }
};
})();
(node as any).hash = 'a0af5b79c7711894363352535c741db7';
export default node;
