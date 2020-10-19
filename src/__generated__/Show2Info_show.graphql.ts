/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type Show2Info_show = {
    readonly href: string | null;
    readonly about: string | null;
    readonly " $refType": "Show2Info_show";
};
export type Show2Info_show$data = Show2Info_show;
export type Show2Info_show$key = {
    readonly " $data"?: Show2Info_show$data;
    readonly " $fragmentRefs": FragmentRefs<"Show2Info_show">;
};



const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "Show2Info_show",
  "selections": [
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "href",
      "storageKey": null
    },
    {
      "alias": "about",
      "args": null,
      "kind": "ScalarField",
      "name": "description",
      "storageKey": null
    }
  ],
  "type": "Show",
  "abstractKey": null
};
(node as any).hash = '38d9f3fc49f2ca8cbe0f243b821f6f90';
export default node;
