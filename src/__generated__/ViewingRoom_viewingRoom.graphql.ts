/* tslint:disable */
/* eslint-disable */

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type ViewingRoom_viewingRoom = {
    readonly artworksForCount: {
        readonly totalCount: number | null;
    } | null;
    readonly " $fragmentRefs": FragmentRefs<"ViewingRoomHeader_viewingRoom" | "ViewingRoomArtworks_viewingRoom" | "ViewingRoomStatement_viewingRoom">;
    readonly " $refType": "ViewingRoom_viewingRoom";
};
export type ViewingRoom_viewingRoom$data = ViewingRoom_viewingRoom;
export type ViewingRoom_viewingRoom$key = {
    readonly " $data"?: ViewingRoom_viewingRoom$data;
    readonly " $fragmentRefs": FragmentRefs<"ViewingRoom_viewingRoom">;
};



const node: ReaderFragment = {
  "kind": "Fragment",
  "name": "ViewingRoom_viewingRoom",
  "type": "ViewingRoom",
  "metadata": null,
  "argumentDefinitions": [],
  "selections": [
    {
      "kind": "LinkedField",
      "alias": "artworksForCount",
      "name": "artworksConnection",
      "storageKey": "artworksConnection(first:1)",
      "args": [
        {
          "kind": "Literal",
          "name": "first",
          "value": 1
        }
      ],
      "concreteType": "ArtworkConnection",
      "plural": false,
      "selections": [
        {
          "kind": "ScalarField",
          "alias": null,
          "name": "totalCount",
          "args": null,
          "storageKey": null
        }
      ]
    },
    {
      "kind": "FragmentSpread",
      "name": "ViewingRoomHeader_viewingRoom",
      "args": null
    },
    {
      "kind": "FragmentSpread",
      "name": "ViewingRoomArtworks_viewingRoom",
      "args": null
    },
    {
      "kind": "FragmentSpread",
      "name": "ViewingRoomStatement_viewingRoom",
      "args": null
    }
  ]
};
(node as any).hash = '4d9ff3cba557d343922d8e1a98f5c21a';
export default node;
