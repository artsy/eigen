/* tslint:disable */
/* eslint-disable */
/* @relayHash 781211149c02f6a8a4c677a7c4aa67cf */

import { ConcreteRequest } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type ViewingRoomsListQueryVariables = {};
export type ViewingRoomsListQueryResponse = {
    readonly " $fragmentRefs": FragmentRefs<"ViewingRoomsList_viewingRooms">;
};
export type ViewingRoomsListQuery = {
    readonly response: ViewingRoomsListQueryResponse;
    readonly variables: ViewingRoomsListQueryVariables;
};



/*
query ViewingRoomsListQuery {
  ...ViewingRoomsList_viewingRooms
}

fragment ViewingRoomsListItem_data on ViewingRoom {
  title
  slug
  internalID
}

fragment ViewingRoomsList_viewingRooms on Query {
  viewingRooms {
    edges {
      node {
        ...ViewingRoomsListItem_data
      }
    }
  }
}
*/

const node: ConcreteRequest = {
  "kind": "Request",
  "fragment": {
    "kind": "Fragment",
    "name": "ViewingRoomsListQuery",
    "type": "Query",
    "metadata": null,
    "argumentDefinitions": [],
    "selections": [
      {
        "kind": "FragmentSpread",
        "name": "ViewingRoomsList_viewingRooms",
        "args": null
      }
    ]
  },
  "operation": {
    "kind": "Operation",
    "name": "ViewingRoomsListQuery",
    "argumentDefinitions": [],
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "viewingRooms",
        "storageKey": null,
        "args": null,
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
                    "kind": "ScalarField",
                    "alias": null,
                    "name": "internalID",
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
  },
  "params": {
    "operationKind": "query",
    "name": "ViewingRoomsListQuery",
    "id": "5f4827ebb7c62c92b11841d0b9b5d100",
    "text": null,
    "metadata": {}
  }
};
(node as any).hash = 'fd90f4ddaaecc88ec2e004bf09ddb9e3';
export default node;
