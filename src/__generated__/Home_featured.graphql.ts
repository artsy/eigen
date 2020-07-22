/* tslint:disable */
/* eslint-disable */

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type Home_featured = {
    readonly " $fragmentRefs": FragmentRefs<"ViewingRoomsListFeatured_featured">;
    readonly " $refType": "Home_featured";
};
export type Home_featured$data = Home_featured;
export type Home_featured$key = {
    readonly " $data"?: Home_featured$data;
    readonly " $fragmentRefs": FragmentRefs<"Home_featured">;
};



const node: ReaderFragment = {
  "kind": "Fragment",
  "name": "Home_featured",
  "type": "ViewingRoomConnection",
  "metadata": null,
  "argumentDefinitions": [],
  "selections": [
    {
      "kind": "FragmentSpread",
      "name": "ViewingRoomsListFeatured_featured",
      "args": null
    }
  ]
};
(node as any).hash = '4d174acc6246fbadb42f085240d77e55';
export default node;
