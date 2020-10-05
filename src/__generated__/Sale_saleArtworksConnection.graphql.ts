/* tslint:disable */
/* eslint-disable */

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type Sale_saleArtworksConnection = {
    readonly " $fragmentRefs": FragmentRefs<"SaleLotsList_saleArtworksConnection">;
    readonly " $refType": "Sale_saleArtworksConnection";
};
export type Sale_saleArtworksConnection$data = Sale_saleArtworksConnection;
export type Sale_saleArtworksConnection$key = {
    readonly " $data"?: Sale_saleArtworksConnection$data;
    readonly " $fragmentRefs": FragmentRefs<"Sale_saleArtworksConnection">;
};



const node: ReaderFragment = {
  "kind": "Fragment",
  "name": "Sale_saleArtworksConnection",
  "type": "SaleArtworksConnection",
  "metadata": null,
  "argumentDefinitions": [],
  "selections": [
    {
      "kind": "FragmentSpread",
      "name": "SaleLotsList_saleArtworksConnection",
      "args": null
    }
  ]
};
(node as any).hash = 'b520772a89667aa3fc3ec5fcfe994494';
export default node;
