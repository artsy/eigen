/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type Show2_show = {
    readonly " $fragmentRefs": FragmentRefs<"Show2Header_show" | "Show2InstallShots_show">;
    readonly " $refType": "Show2_show";
};
export type Show2_show$data = Show2_show;
export type Show2_show$key = {
    readonly " $data"?: Show2_show$data;
    readonly " $fragmentRefs": FragmentRefs<"Show2_show">;
};



const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "Show2_show",
  "selections": [
    {
      "args": null,
      "kind": "FragmentSpread",
      "name": "Show2Header_show"
    },
    {
      "args": null,
      "kind": "FragmentSpread",
      "name": "Show2InstallShots_show"
    }
  ],
  "type": "Show",
  "abstractKey": null
};
(node as any).hash = 'd59ae3175f339dca832a99511606c8d0';
export default node;
