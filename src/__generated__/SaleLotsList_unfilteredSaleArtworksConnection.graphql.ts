/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type SaleLotsList_unfilteredSaleArtworksConnection = {
    readonly counts: {
        readonly total: number | null;
    } | null;
    readonly " $refType": "SaleLotsList_unfilteredSaleArtworksConnection";
};
export type SaleLotsList_unfilteredSaleArtworksConnection$data = SaleLotsList_unfilteredSaleArtworksConnection;
export type SaleLotsList_unfilteredSaleArtworksConnection$key = {
    readonly " $data"?: SaleLotsList_unfilteredSaleArtworksConnection$data;
    readonly " $fragmentRefs": FragmentRefs<"SaleLotsList_unfilteredSaleArtworksConnection">;
};



const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "SaleLotsList_unfilteredSaleArtworksConnection",
  "selections": [
    {
      "alias": null,
      "args": null,
      "concreteType": "FilterSaleArtworksCounts",
      "kind": "LinkedField",
      "name": "counts",
      "plural": false,
      "selections": [
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "total",
          "storageKey": null
        }
      ],
      "storageKey": null
    }
  ],
  "type": "SaleArtworksConnection",
  "abstractKey": null
};
(node as any).hash = '5cf17218c3d8cc89105840a303753811';
export default node;
