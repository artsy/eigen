/* tslint:disable */
/* eslint-disable */

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type ViewingRoomsList_query = {
    readonly viewingRooms: {
        readonly edges: ReadonlyArray<{
            readonly node: {
                readonly internalID: string;
                readonly status: string;
                readonly " $fragmentRefs": FragmentRefs<"ViewingRoomsListItem_item">;
            } | null;
        } | null> | null;
    } | null;
    readonly " $refType": "ViewingRoomsList_query";
};
export type ViewingRoomsList_query$data = ViewingRoomsList_query;
export type ViewingRoomsList_query$key = {
    readonly " $data"?: ViewingRoomsList_query$data;
    readonly " $fragmentRefs": FragmentRefs<"ViewingRoomsList_query">;
};



const node: ReaderFragment = {
  "kind": "Fragment",
  "name": "ViewingRoomsList_query",
  "type": "Query",
  "metadata": {
    "connection": [
      {
        "count": "count",
        "cursor": "after",
        "direction": "forward",
        "path": [
          "viewingRooms"
        ]
      }
    ]
  },
  "argumentDefinitions": [
    {
      "kind": "LocalArgument",
      "name": "count",
      "type": "Int",
      "defaultValue": null
    },
    {
      "kind": "LocalArgument",
      "name": "after",
      "type": "String",
      "defaultValue": null
    }
  ],
  "selections": [
    {
      "kind": "LinkedField",
      "alias": "viewingRooms",
      "name": "__ViewingRoomsList_viewingRooms_connection",
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
                  "name": "internalID",
                  "args": null,
                  "storageKey": null
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
                  "name": "__typename",
                  "args": null,
                  "storageKey": null
                },
                {
                  "kind": "FragmentSpread",
                  "name": "ViewingRoomsListItem_item",
                  "args": null
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
    }
  ]
};
(node as any).hash = 'ff49a6eed2020c9c2717da88075ad1c7';
export default node;
