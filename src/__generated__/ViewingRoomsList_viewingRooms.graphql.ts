/* tslint:disable */
/* eslint-disable */

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type ViewingRoomsList_viewingRooms = {
    readonly edges: ReadonlyArray<{
        readonly node: {
            readonly status: string;
            readonly internalID: string;
            readonly " $fragmentRefs": FragmentRefs<"ViewingRoomsListItem_item">;
        } | null;
    } | null> | null;
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
  "type": "ViewingRoomConnection",
  "metadata": null,
  "argumentDefinitions": [],
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
              "name": "status",
              "args": null,
              "storageKey": null
            },
            {
              "kind": "ScalarField",
              "alias": null,
              "name": "internalID",
              "args": null,
              "storageKey": null
            },
            {
              "kind": "FragmentSpread",
              "name": "ViewingRoomsListItem_item",
              "args": null
            }
          ]
        }
      ]
    }
  ]
};
(node as any).hash = 'ad9a2e2eb07e90763567c1b2aac6048d';
export default node;
