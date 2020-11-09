/* tslint:disable */
/* eslint-disable */
// @ts-nocheck
/* @relayHash a85c5e77a51a64c48efaaffabdf6322b */

import { ConcreteRequest } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type Show2ViewingRoomTestsQueryVariables = {
    showID: string;
};
export type Show2ViewingRoomTestsQueryResponse = {
    readonly show: {
        readonly " $fragmentRefs": FragmentRefs<"Show2ViewingRoom_show">;
    } | null;
};
export type Show2ViewingRoomTestsQuery = {
    readonly response: Show2ViewingRoomTestsQueryResponse;
    readonly variables: Show2ViewingRoomTestsQueryVariables;
};



/*
query Show2ViewingRoomTestsQuery(
  $showID: String!
) {
  show(id: $showID) {
    ...Show2ViewingRoom_show
    id
  }
}

fragment Show2ViewingRoom_show on Show {
  internalID
  slug
  partner {
    __typename
    ... on Partner {
      name
    }
    ... on ExternalPartner {
      name
      id
    }
    ... on Node {
      __isNode: __typename
      id
    }
  }
  viewingRoomsConnection {
    edges {
      node {
        internalID
        slug
        title
        status
        distanceToOpen(short: true)
        distanceToClose(short: true)
        href
        image {
          imageURLs {
            normalized
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
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "showID"
  }
],
v1 = [
  {
    "kind": "Variable",
    "name": "id",
    "variableName": "showID"
  }
],
v2 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "internalID",
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
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "name",
  "storageKey": null
},
v5 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
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
  "enumValues": null,
  "nullable": false,
  "plural": false,
  "type": "ID"
},
v8 = {
  "enumValues": null,
  "nullable": false,
  "plural": false,
  "type": "String"
},
v9 = {
  "enumValues": null,
  "nullable": true,
  "plural": false,
  "type": "String"
};
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "Show2ViewingRoomTestsQuery",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": "Show",
        "kind": "LinkedField",
        "name": "show",
        "plural": false,
        "selections": [
          {
            "args": null,
            "kind": "FragmentSpread",
            "name": "Show2ViewingRoom_show"
          }
        ],
        "storageKey": null
      }
    ],
    "type": "Query",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "Show2ViewingRoomTestsQuery",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": "Show",
        "kind": "LinkedField",
        "name": "show",
        "plural": false,
        "selections": [
          (v2/*: any*/),
          (v3/*: any*/),
          {
            "alias": null,
            "args": null,
            "concreteType": null,
            "kind": "LinkedField",
            "name": "partner",
            "plural": false,
            "selections": [
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "__typename",
                "storageKey": null
              },
              {
                "kind": "InlineFragment",
                "selections": [
                  (v4/*: any*/)
                ],
                "type": "Partner",
                "abstractKey": null
              },
              {
                "kind": "InlineFragment",
                "selections": [
                  (v4/*: any*/),
                  (v5/*: any*/)
                ],
                "type": "ExternalPartner",
                "abstractKey": null
              },
              {
                "kind": "InlineFragment",
                "selections": [
                  (v5/*: any*/)
                ],
                "type": "Node",
                "abstractKey": "__isNode"
              }
            ],
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "concreteType": "ViewingRoomsConnection",
            "kind": "LinkedField",
            "name": "viewingRoomsConnection",
            "plural": false,
            "selections": [
              {
                "alias": null,
                "args": null,
                "concreteType": "ViewingRoomsEdge",
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
                      (v2/*: any*/),
                      (v3/*: any*/),
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
                        "name": "status",
                        "storageKey": null
                      },
                      {
                        "alias": null,
                        "args": (v6/*: any*/),
                        "kind": "ScalarField",
                        "name": "distanceToOpen",
                        "storageKey": "distanceToOpen(short:true)"
                      },
                      {
                        "alias": null,
                        "args": (v6/*: any*/),
                        "kind": "ScalarField",
                        "name": "distanceToClose",
                        "storageKey": "distanceToClose(short:true)"
                      },
                      {
                        "alias": null,
                        "args": null,
                        "kind": "ScalarField",
                        "name": "href",
                        "storageKey": null
                      },
                      {
                        "alias": null,
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
                      }
                    ],
                    "storageKey": null
                  }
                ],
                "storageKey": null
              }
            ],
            "storageKey": null
          },
          (v5/*: any*/)
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "id": "a85c5e77a51a64c48efaaffabdf6322b",
    "metadata": {
      "relayTestingSelectionTypeInfo": {
        "show": {
          "enumValues": null,
          "nullable": true,
          "plural": false,
          "type": "Show"
        },
        "show.id": (v7/*: any*/),
        "show.internalID": (v7/*: any*/),
        "show.partner": {
          "enumValues": null,
          "nullable": true,
          "plural": false,
          "type": "PartnerTypes"
        },
        "show.partner.__isNode": (v8/*: any*/),
        "show.partner.__typename": (v8/*: any*/),
        "show.partner.id": (v7/*: any*/),
        "show.partner.name": (v9/*: any*/),
        "show.slug": (v7/*: any*/),
        "show.viewingRoomsConnection": {
          "enumValues": null,
          "nullable": true,
          "plural": false,
          "type": "ViewingRoomsConnection"
        },
        "show.viewingRoomsConnection.edges": {
          "enumValues": null,
          "nullable": true,
          "plural": true,
          "type": "ViewingRoomsEdge"
        },
        "show.viewingRoomsConnection.edges.node": {
          "enumValues": null,
          "nullable": true,
          "plural": false,
          "type": "ViewingRoom"
        },
        "show.viewingRoomsConnection.edges.node.distanceToClose": (v9/*: any*/),
        "show.viewingRoomsConnection.edges.node.distanceToOpen": (v9/*: any*/),
        "show.viewingRoomsConnection.edges.node.href": (v9/*: any*/),
        "show.viewingRoomsConnection.edges.node.image": {
          "enumValues": null,
          "nullable": true,
          "plural": false,
          "type": "ARImage"
        },
        "show.viewingRoomsConnection.edges.node.image.imageURLs": {
          "enumValues": null,
          "nullable": true,
          "plural": false,
          "type": "ImageURLs"
        },
        "show.viewingRoomsConnection.edges.node.image.imageURLs.normalized": (v9/*: any*/),
        "show.viewingRoomsConnection.edges.node.internalID": (v7/*: any*/),
        "show.viewingRoomsConnection.edges.node.slug": (v8/*: any*/),
        "show.viewingRoomsConnection.edges.node.status": (v8/*: any*/),
        "show.viewingRoomsConnection.edges.node.title": (v8/*: any*/)
      }
    },
    "name": "Show2ViewingRoomTestsQuery",
    "operationKind": "query",
    "text": null
  }
};
})();
(node as any).hash = '52d9ba8ea9d0336a21c1fdd0a44a9bca';
export default node;
