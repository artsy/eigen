/* tslint:disable */
/* eslint-disable */

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type Sale_sale = {
    readonly internalID: string;
    readonly slug: string;
    readonly " $fragmentRefs": FragmentRefs<"SaleHeader_sale" | "RegisterToBidButton_sale" | "SaleLotsList_sale">;
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
      "kind": "ScalarField",
      "alias": null,
      "name": "internalID",
      "args": null,
      "storageKey": null
    },
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "slug",
      "args": null,
      "storageKey": null
    },
    {
      "kind": "FragmentSpread",
      "name": "SaleHeader_sale",
      "args": null
    },
    {
      "kind": "FragmentSpread",
      "name": "RegisterToBidButton_sale",
      "args": null
    },
    {
      "kind": "FragmentSpread",
      "name": "SaleLotsList_sale",
      "args": null
    }
  ]
};
(node as any).hash = 'f44562ce5243bacd2c6b47975c53e1a0';
export default node;
