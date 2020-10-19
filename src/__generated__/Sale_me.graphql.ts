/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type Sale_me = {
    readonly " $fragmentRefs": FragmentRefs<"SaleLotsList_me">;
    readonly " $refType": "Sale_me";
};
export type Sale_me$data = Sale_me;
export type Sale_me$key = {
    readonly " $data"?: Sale_me$data;
    readonly " $fragmentRefs": FragmentRefs<"Sale_me">;
};



const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "Sale_me",
  "selections": [
    {
      "args": null,
      "kind": "FragmentSpread",
      "name": "SaleLotsList_me"
    }
  ],
  "type": "Me",
  "abstractKey": null
};
(node as any).hash = 'da72557cc0bda66a4449c3d5d66cf54f';
export default node;
