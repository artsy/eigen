/* tslint:disable */
/* eslint-disable */

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type SaleLotsList_saleArtworksConnection = {
    readonly totalCount: number | null;
    readonly " $refType": "SaleLotsList_saleArtworksConnection";
};
export type SaleLotsList_saleArtworksConnection$data = SaleLotsList_saleArtworksConnection;
export type SaleLotsList_saleArtworksConnection$key = {
    readonly " $data"?: SaleLotsList_saleArtworksConnection$data;
    readonly " $fragmentRefs": FragmentRefs<"SaleLotsList_saleArtworksConnection">;
};



const node: ReaderFragment = {
  "kind": "Fragment",
  "name": "SaleLotsList_saleArtworksConnection",
  "type": "SaleArtworksConnection",
  "metadata": null,
  "argumentDefinitions": [],
  "selections": [
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "totalCount",
      "args": null,
      "storageKey": null
    }
  ]
};
(node as any).hash = '2ee5815d36eb42c80f82bd237e7ac7a1';
export default node;
