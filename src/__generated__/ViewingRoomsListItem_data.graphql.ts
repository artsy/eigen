/* tslint:disable */
/* eslint-disable */

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type ViewingRoomsListItem_data = {
    readonly title: string;
    readonly slug: string;
    readonly internalID: string;
    readonly " $refType": "ViewingRoomsListItem_data";
};
export type ViewingRoomsListItem_data$data = ViewingRoomsListItem_data;
export type ViewingRoomsListItem_data$key = {
    readonly " $data"?: ViewingRoomsListItem_data$data;
    readonly " $fragmentRefs": FragmentRefs<"ViewingRoomsListItem_data">;
};



const node: ReaderFragment = {
  "kind": "Fragment",
  "name": "ViewingRoomsListItem_data",
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
(node as any).hash = '100e1c2f7d2a2da6d2c1846989fba653';
export default node;
