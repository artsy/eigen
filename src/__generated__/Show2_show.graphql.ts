/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type Show2_show = {
    readonly name: string | null;
    readonly " $fragmentRefs": FragmentRefs<"Show2Header_show">;
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
    },
    {
      "args": null,
      "kind": "FragmentSpread",
      "name": "Show2Header_show"
    }
  ],
  "type": "Show",
  "abstractKey": null
};
(node as any).hash = '29f9042ba713c3c50787df0c89e87468';
export default node;
