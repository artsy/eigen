/* tslint:disable */
/* eslint-disable */

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type ViewingRoomSubsections_viewingRoom = {
    readonly internalID: string;
    readonly subsectionsConnection: {
        readonly edges: ReadonlyArray<{
            readonly node: {
                readonly title: string | null;
                readonly body: string | null;
                readonly imageURL: string | null;
                readonly caption: string | null;
            } | null;
        } | null> | null;
    } | null;
    readonly " $refType": "ViewingRoomSubsections_viewingRoom";
};
export type ViewingRoomSubsections_viewingRoom$data = ViewingRoomSubsections_viewingRoom;
export type ViewingRoomSubsections_viewingRoom$key = {
    readonly " $data"?: ViewingRoomSubsections_viewingRoom$data;
    readonly " $fragmentRefs": FragmentRefs<"ViewingRoomSubsections_viewingRoom">;
};



const node: ReaderFragment = {
  "kind": "Fragment",
  "name": "ViewingRoomSubsections_viewingRoom",
  "type": "ViewingRoom",
  "metadata": {
    "connection": [
      {
        "count": "count",
        "cursor": "cursor",
        "direction": "forward",
        "path": [
          "subsectionsConnection"
        ]
      }
    ]
  },
  "argumentDefinitions": [
    {
      "kind": "LocalArgument",
      "name": "count",
      "type": "Int",
      "defaultValue": 10
    },
    {
      "kind": "LocalArgument",
      "name": "cursor",
      "type": "String",
      "defaultValue": ""
    }
  ],
  "selections": [
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "internalID",
      "args": null,
      "storageKey": null
    },
    {
      "kind": "LinkedField",
      "alias": "subsectionsConnection",
      "name": "__ViewingRoomSubsections_subsectionsConnection_connection",
      "storageKey": null,
      "args": null,
      "concreteType": "ViewingRoomSubsectionConnection",
      "plural": false,
      "selections": [
        {
          "kind": "LinkedField",
          "alias": null,
          "name": "edges",
          "storageKey": null,
          "args": null,
          "concreteType": "ViewingRoomSubsectionEdge",
          "plural": true,
          "selections": [
            {
              "kind": "LinkedField",
              "alias": null,
              "name": "node",
              "storageKey": null,
              "args": null,
              "concreteType": "ViewingRoomSubsection",
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
                  "name": "body",
                  "args": null,
                  "storageKey": null
                },
                {
                  "kind": "ScalarField",
                  "alias": null,
                  "name": "imageURL",
                  "args": null,
                  "storageKey": null
                },
                {
                  "kind": "ScalarField",
                  "alias": null,
                  "name": "caption",
                  "args": null,
                  "storageKey": null
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
    }
  ]
};
(node as any).hash = 'cc813efa117e6e4399d8ce3952728e30';
export default node;
