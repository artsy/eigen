/* tslint:disable */
/* eslint-disable */

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
  "kind": "Fragment",
  "name": "Sale_saleArtworksConnection",
  "type": "Query",
  "metadata": null,
  "argumentDefinitions": [
    {
      "kind": "LocalArgument",
      "name": "count",
      "type": "Int!",
      "defaultValue": null
    },
    {
      "kind": "LocalArgument",
      "name": "cursor",
      "type": "String",
      "defaultValue": null
    }
  ],
  "selections": [
    {
      "kind": "FragmentSpread",
      "name": "SaleLotsList2_saleArtworksConnection",
      "args": [
        {
          "kind": "Variable",
          "name": "count",
          "variableName": "count"
        }
      ]
    }
  ]
};
(node as any).hash = '2ef4dd24bc94e191217737121bc8316f';
export default node;
