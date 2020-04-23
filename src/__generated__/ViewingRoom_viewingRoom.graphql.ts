/* tslint:disable */
/* eslint-disable */

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type ViewingRoom_viewingRoom = {
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
(node as any).hash = '0b4a41ad6719aa3e57ee2d1c7949c732';
export default node;
