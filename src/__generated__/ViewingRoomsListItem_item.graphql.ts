/* tslint:disable */
/* eslint-disable */

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type ViewingRoomsListItem_item = {
    readonly title: string;
    readonly slug: string;
    readonly internalID: string;
    readonly " $refType": "ViewingRoomsListItem_item";
};
export type ViewingRoomsListItem_item$data = ViewingRoomsListItem_item;
export type ViewingRoomsListItem_item$key = {
    readonly " $data"?: ViewingRoomsListItem_item$data;
    readonly " $fragmentRefs": FragmentRefs<"ViewingRoomsListItem_item">;
};



const node: ReaderFragment = {
  "kind": "Fragment",
  "name": "ViewingRoomsListItem_item",
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
};
(node as any).hash = 'ac977cd9d6e1f4ec7ef92458879f314e';
export default node;
