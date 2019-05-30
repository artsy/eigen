/* tslint:disable */

import { ReaderFragment } from "relay-runtime";
import { Header_sale$ref } from "./Header_sale.graphql";
import { SaleArtworksGrid_sale$ref } from "./SaleArtworksGrid_sale.graphql";
declare const _Sale_sale$ref: unique symbol;
export type Sale_sale$ref = typeof _Sale_sale$ref;
export type Sale_sale = {
    readonly gravityID: string;
    readonly name: string | null;
    readonly " $fragmentRefs": Header_sale$ref & SaleArtworksGrid_sale$ref;
    readonly " $refType": Sale_sale$ref;
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
      "name": "gravityID",
      "args": null,
      "storageKey": null
    },
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "name",
      "args": null,
      "storageKey": null
    },
    {
      "kind": "FragmentSpread",
      "name": "Header_sale",
      "args": null
    },
    {
      "kind": "FragmentSpread",
      "name": "SaleArtworksGrid_sale",
      "args": null
    }
  ]
};
(node as any).hash = '1f5993da527b3becc0a974f2e84bcf07';
export default node;
