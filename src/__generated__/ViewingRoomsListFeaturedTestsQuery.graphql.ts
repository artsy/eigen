/* tslint:disable */
/* eslint-disable */
/* @relayHash f6ac9ae07a351226b748529850643971 */

import { ConcreteRequest } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type ViewingRoomsListFeaturedTestsQueryVariables = {};
export type ViewingRoomsListFeaturedTestsQueryResponse = {
    readonly featured: {
        readonly " $fragmentRefs": FragmentRefs<"ViewingRoomsListFeatured_featured">;
    } | null;
};
export type ViewingRoomsListFeaturedTestsQuery = {
    readonly response: ViewingRoomsListFeaturedTestsQueryResponse;
    readonly variables: ViewingRoomsListFeaturedTestsQueryVariables;
};



/*
query ViewingRoomsListFeaturedTestsQuery {
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
*/

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "kind": "Literal",
    "name": "featured",
    "value": true
  }
],
v1 = [
  {
    "kind": "Literal",
    "name": "short",
    "value": true
  }
];
return {
  "kind": "Request",
  "fragment": {
    "kind": "Fragment",
    "name": "ViewingRoomsListFeaturedTestsQuery",
    "type": "Query",
    "metadata": null,
    "argumentDefinitions": [],
    "selections": [
      {
        "kind": "LinkedField",
        "alias": "featured",
        "name": "viewingRooms",
        "storageKey": "viewingRooms(featured:true)",
        "args": (v0/*: any*/),
        "concreteType": "ViewingRoomConnection",
        "plural": false,
        "selections": [
          {
            "kind": "FragmentSpread",
            "name": "ViewingRoomsListFeatured_featured",
            "args": null
          }
        ]
      }
    ]
  },
  "operation": {
    "kind": "Operation",
    "name": "ViewingRoomsListFeaturedTestsQuery",
    "argumentDefinitions": [],
    "selections": [
      {
        "kind": "LinkedField",
        "alias": "featured",
        "name": "viewingRooms",
        "storageKey": "viewingRooms(featured:true)",
        "args": (v0/*: any*/),
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
                    "args": (v1/*: any*/),
                    "storageKey": "distanceToOpen(short:true)"
                  },
                  {
                    "kind": "ScalarField",
                    "alias": null,
                    "name": "distanceToClose",
                    "args": (v1/*: any*/),
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
    "name": "ViewingRoomsListFeaturedTestsQuery",
    "id": "fa12a11f0d9fb65c7240999dc76fab5a",
    "text": null,
    "metadata": {}
  }
};
})();
(node as any).hash = 'a645d9402e5e13e3685732bd5251d9f0';
export default node;
