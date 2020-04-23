/* tslint:disable */
/* eslint-disable */

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type ViewingRoomHeader_viewingRoom = {
    readonly title: string;
    readonly startAt: unknown | null;
    readonly endAt: unknown | null;
    readonly heroImageURL: string | null;
    readonly " $refType": "ViewingRoomHeader_viewingRoom";
};
export type ViewingRoomHeader_viewingRoom$data = ViewingRoomHeader_viewingRoom;
export type ViewingRoomHeader_viewingRoom$key = {
    readonly " $data"?: ViewingRoomHeader_viewingRoom$data;
    readonly " $fragmentRefs": FragmentRefs<"ViewingRoomHeader_viewingRoom">;
};



const node: ReaderFragment = {
  "kind": "Fragment",
  "name": "ViewingRoomHeader_viewingRoom",
  "type": "ViewingRoom",
  "metadata": null,
  "argumentDefinitions": [],
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
      "name": "startAt",
      "args": null,
      "storageKey": null
    },
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "endAt",
      "args": null,
      "storageKey": null
    },
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "heroImageURL",
      "args": null,
      "storageKey": null
    }
  ]
};
(node as any).hash = '2db17e8a898636e302ba0523d4624eba';
export default node;
