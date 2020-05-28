/* tslint:disable */
/* eslint-disable */

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type CitySavedList_city = {
    readonly name: string | null;
    readonly " $refType": "CitySavedList_city";
};
export type CitySavedList_city$data = CitySavedList_city;
export type CitySavedList_city$key = {
    readonly " $data"?: CitySavedList_city$data;
    readonly " $fragmentRefs": FragmentRefs<"CitySavedList_city">;
};



const node: ReaderFragment = {
  "kind": "Fragment",
  "name": "CitySavedList_city",
  "type": "City",
  "metadata": null,
  "argumentDefinitions": [],
  "selections": [
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "name",
      "args": null,
      "storageKey": null
    }
  ]
};
(node as any).hash = '74c19a1423a2fc69b228a393596a29c9';
export default node;
