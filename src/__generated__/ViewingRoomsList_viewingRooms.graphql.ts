/* tslint:disable */
/* eslint-disable */

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type ViewingRoomsList_viewingRooms = {
    readonly viewingRooms: {
        readonly edges: ReadonlyArray<{
            readonly node: {
                readonly " $fragmentRefs": FragmentRefs<"ViewingRoomsListItem_data">;
            } | null;
        } | null> | null;
    } | null;
    readonly " $refType": "ViewingRoomsList_viewingRooms";
};
export type ViewingRoomsList_viewingRooms$data = ViewingRoomsList_viewingRooms;
export type ViewingRoomsList_viewingRooms$key = {
    readonly " $data"?: ViewingRoomsList_viewingRooms$data;
    readonly " $fragmentRefs": FragmentRefs<"ViewingRoomsList_viewingRooms">;
};



const node: ReaderFragment = {
  "kind": "Fragment",
  "name": "ViewingRoomsList_viewingRooms",
  "type": "Query",
  "metadata": null,
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
                  "kind": "FragmentSpread",
                  "name": "ViewingRoomsListItem_data",
                  "args": null
                }
              ]
            }
          ]
        }
      ]
    }
  ]
};
(node as any).hash = '4c4c4b5683ad7217e158569550047806';
export default node;
