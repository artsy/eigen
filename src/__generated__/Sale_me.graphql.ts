/* tslint:disable */
/* eslint-disable */

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type Sale_me = {
    readonly " $fragmentRefs": FragmentRefs<"SaleArtworksRail_me">;
    readonly " $refType": "Sale_me";
};
export type Sale_me$data = Sale_me;
export type Sale_me$key = {
    readonly " $data"?: Sale_me$data;
    readonly " $fragmentRefs": FragmentRefs<"Sale_me">;
};



const node: ReaderFragment = {
  "kind": "Fragment",
  "name": "Sale_me",
  "type": "Me",
  "metadata": null,
  "argumentDefinitions": [],
  "selections": [
    {
      "kind": "FragmentSpread",
      "name": "SaleArtworksRail_me",
      "args": null
    }
  ]
};
(node as any).hash = '162fe020971dbd7d39053dc166d2055e';
export default node;
