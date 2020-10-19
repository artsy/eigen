/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type Show2_show = {
    readonly images: ReadonlyArray<{
        readonly __typename: string;
    } | null> | null;
    readonly " $fragmentRefs": FragmentRefs<"Show2Header_show" | "Show2InstallShots_show" | "Show2Info_show">;
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
      "concreteType": "Image",
      "kind": "LinkedField",
      "name": "images",
      "plural": true,
      "selections": [
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "__typename",
          "storageKey": null
        }
      ],
      "storageKey": null
    },
    {
      "args": null,
      "kind": "FragmentSpread",
      "name": "Show2Header_show"
    },
    {
      "args": null,
      "kind": "FragmentSpread",
      "name": "Show2InstallShots_show"
    },
    {
      "args": null,
      "kind": "FragmentSpread",
      "name": "Show2Info_show"
    }
  ],
  "type": "Show",
  "abstractKey": null
};
(node as any).hash = '3e21cb7c7fee76e6a44a60ff2b30c4b7';
export default node;
