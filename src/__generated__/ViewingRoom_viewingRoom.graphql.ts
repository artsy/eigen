/* tslint:disable */
/* eslint-disable */

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type ViewingRoom_viewingRoom = {
    readonly title: string;
    readonly startAt: unknown | null;
    readonly endAt: unknown | null;
    readonly heroImageURL: string | null;
    readonly " $fragmentRefs": FragmentRefs<"ViewingRoomArtworks_viewingRoom" | "ViewingRoomStatement_viewingRoom">;
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
(node as any).hash = 'b4ebbdce5a212cfde3a83fd2e474a6f5';
export default node;
