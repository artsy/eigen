/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type Sale_saleArtworksConnection = {
    readonly " $fragmentRefs": FragmentRefs<"SaleLotsList2_saleArtworksConnection">;
    readonly " $refType": "Sale_saleArtworksConnection";
};
export type Sale_saleArtworksConnection$data = Sale_saleArtworksConnection;
export type Sale_saleArtworksConnection$key = {
    readonly " $data"?: Sale_saleArtworksConnection$data;
    readonly " $fragmentRefs": FragmentRefs<"Sale_saleArtworksConnection">;
};



const node: ReaderFragment = {
  "argumentDefinitions": [
    {
      "defaultValue": null,
      "kind": "LocalArgument",
      "name": "count"
    },
    {
      "defaultValue": null,
      "kind": "LocalArgument",
      "name": "cursor"
    }
  ],
  "kind": "Fragment",
  "metadata": null,
  "name": "Sale_saleArtworksConnection",
  "selections": [
    {
      "args": [
        {
          "kind": "Variable",
          "name": "count",
          "variableName": "count"
        }
      ],
      "kind": "FragmentSpread",
      "name": "SaleLotsList2_saleArtworksConnection"
    }
  ],
  "type": "Query",
  "abstractKey": null
};
(node as any).hash = '2ef4dd24bc94e191217737121bc8316f';
export default node;
