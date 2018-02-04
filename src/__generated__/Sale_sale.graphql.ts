/* tslint:disable */

import { ConcreteFragment } from "relay-runtime";
export type Sale_sale = {
    readonly id: string;
    readonly name: string | null;
};



const node: ConcreteFragment = {
  "kind": "Fragment",
  "name": "Sale_sale",
  "type": "Sale",
  "metadata": null,
  "argumentDefinitions": [],
  "selections": [
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "id",
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
    },
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "__id",
      "args": null,
      "storageKey": null
    }
  ],
  "idField": "__id"
};
(node as any).hash = '30b1c1de8097c9e195c5a941c08fe00f';
export default node;
