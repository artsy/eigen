/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type Show2_show = {
    readonly name: string | null;
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
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "name",
      "storageKey": null
    }
  ],
  "type": "Show",
  "abstractKey": null
};
(node as any).hash = 'a1fe9ef4bb3adce2714cc4811f67c1c2';
export default node;
