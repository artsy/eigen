/* tslint:disable */
/* eslint-disable */

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type Sale_sale = {
    readonly " $fragmentRefs": FragmentRefs<"SaleHeader_sale" | "RegisterToBidButton_sale">;
    readonly " $refType": "Sale_sale";
};
export type Sale_sale$data = Sale_sale;
export type Sale_sale$key = {
    readonly " $data"?: Sale_sale$data;
    readonly " $fragmentRefs": FragmentRefs<"Sale_sale">;
};



const node: ReaderFragment = {
  "kind": "Fragment",
  "name": "Sale_sale",
  "type": "Sale",
  "metadata": null,
  "argumentDefinitions": [],
  "selections": [
    {
      "kind": "FragmentSpread",
      "name": "SaleHeader_sale",
      "args": null
    },
    {
      "kind": "FragmentSpread",
      "name": "RegisterToBidButton_sale",
      "args": null
    }
  ]
};
(node as any).hash = '558f7837b4673a8b3a6d60ff27f60e8e';
export default node;
