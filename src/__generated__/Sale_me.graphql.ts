/* tslint:disable */
/* eslint-disable */

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
  "kind": "Fragment",
  "name": "Sale_me",
  "type": "Me",
  "metadata": null,
  "argumentDefinitions": [],
  "selections": [
    {
      "kind": "FragmentSpread",
      "name": "SaleLotsList_me",
      "args": null
    }
  ]
};
(node as any).hash = 'da72557cc0bda66a4449c3d5d66cf54f';
export default node;
