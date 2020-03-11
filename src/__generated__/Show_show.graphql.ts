/* tslint:disable */
/* eslint-disable */

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type Show_show = {
    readonly " $fragmentRefs": FragmentRefs<"Detail_show">;
    readonly " $refType": "Show_show";
};
export type Show_show$data = Show_show;
export type Show_show$key = {
    readonly " $data"?: Show_show$data;
    readonly " $fragmentRefs": FragmentRefs<"Show_show">;
};



const node: ReaderFragment = {
  "kind": "Fragment",
  "name": "Show_show",
  "type": "Show",
  "metadata": null,
  "argumentDefinitions": [],
  "selections": [
    {
      "kind": "FragmentSpread",
      "name": "Detail_show",
      "args": null
    }
  ]
};
(node as any).hash = '3508bfae54d51fc89eb5bed696d4305b';
export default node;
