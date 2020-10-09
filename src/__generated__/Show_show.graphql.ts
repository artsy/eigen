/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

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
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "Show_show",
  "selections": [
    {
      "args": null,
      "kind": "FragmentSpread",
      "name": "Detail_show"
    }
  ],
  "type": "Show",
  "abstractKey": null
};
(node as any).hash = '3508bfae54d51fc89eb5bed696d4305b';
export default node;
