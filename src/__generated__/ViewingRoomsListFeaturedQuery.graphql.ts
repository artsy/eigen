/* tslint:disable */
/* eslint-disable */
/* @relayHash ba80f4e8eae1af2c90440ac3d1adee9a */

import { ConcreteRequest } from "relay-runtime";
export type ViewingRoomsListFeaturedQueryVariables = {};
export type ViewingRoomsListFeaturedQueryResponse = {
    readonly viewingRooms: {
        readonly edges: ReadonlyArray<{
            readonly node: {
                readonly internalID: string;
                readonly title: string;
                readonly slug: string;
                readonly heroImageURL: string | null;
                readonly status: string;
                readonly distanceToOpen: string | null;
                readonly distanceToClose: string | null;
                readonly partner: {
                    readonly name: string | null;
                } | null;
            } | null;
        } | null> | null;
    } | null;
};
export type ViewingRoomsListFeaturedQuery = {
    readonly response: ViewingRoomsListFeaturedQueryResponse;
    readonly variables: ViewingRoomsListFeaturedQueryVariables;
};



/*
query ViewingRoomsListFeaturedQuery {
  viewingRooms(featured: true) {
    edges {
      node {
        internalID
        title
        slug
        heroImageURL
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
v1 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "internalID",
  "args": null,
  "storageKey": null
},
v2 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "title",
  "args": null,
  "storageKey": null
},
v3 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "slug",
  "args": null,
  "storageKey": null
},
v4 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "heroImageURL",
  "args": null,
  "storageKey": null
},
v5 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "status",
  "args": null,
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
  "kind": "ScalarField",
  "alias": null,
  "name": "distanceToOpen",
  "args": (v6/*: any*/),
  "storageKey": "distanceToOpen(short:true)"
},
v8 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "distanceToClose",
  "args": (v6/*: any*/),
  "storageKey": "distanceToClose(short:true)"
},
v9 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "name",
  "args": null,
  "storageKey": null
};
return {
  "kind": "Request",
  "fragment": {
    "kind": "Fragment",
    "name": "ViewingRoomsListFeaturedQuery",
    "type": "Query",
    "metadata": null,
    "argumentDefinitions": [],
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
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
                  (v1/*: any*/),
                  (v2/*: any*/),
                  (v3/*: any*/),
                  (v4/*: any*/),
                  (v5/*: any*/),
                  (v7/*: any*/),
                  (v8/*: any*/),
                  {
                    "kind": "LinkedField",
                    "alias": null,
                    "name": "partner",
                    "storageKey": null,
                    "args": null,
                    "concreteType": "Partner",
                    "plural": false,
                    "selections": [
                      (v9/*: any*/)
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
  "operation": {
    "kind": "Operation",
    "name": "ViewingRoomsListFeaturedQuery",
    "argumentDefinitions": [],
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
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
                  (v1/*: any*/),
                  (v2/*: any*/),
                  (v3/*: any*/),
                  (v4/*: any*/),
                  (v5/*: any*/),
                  (v7/*: any*/),
                  (v8/*: any*/),
                  {
                    "kind": "LinkedField",
                    "alias": null,
                    "name": "partner",
                    "storageKey": null,
                    "args": null,
                    "concreteType": "Partner",
                    "plural": false,
                    "selections": [
                      (v9/*: any*/),
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
    "name": "ViewingRoomsListFeaturedQuery",
    "id": "a7b4694d663691f29b96896837d10064",
    "text": null,
    "metadata": {}
  }
};
})();
(node as any).hash = '71a1efdf2e6699aea27e0c1afe33cfc4';
export default node;
