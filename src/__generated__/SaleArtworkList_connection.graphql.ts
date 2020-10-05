/* tslint:disable */
/* eslint-disable */

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type SaleArtworkList_connection = {
    readonly edges: ReadonlyArray<{
        readonly node: {
            readonly id: string;
            readonly " $fragmentRefs": FragmentRefs<"SaleArtworkListItem_artwork">;
        } | null;
    } | null> | null;
    readonly " $refType": "SaleArtworkList_connection";
};
export type SaleArtworkList_connection$data = SaleArtworkList_connection;
export type SaleArtworkList_connection$key = {
    readonly " $data"?: SaleArtworkList_connection$data;
    readonly " $fragmentRefs": FragmentRefs<"SaleArtworkList_connection">;
};



const node: ReaderFragment = {
  "kind": "Fragment",
  "name": "SaleArtworkList_connection",
  "type": "ArtworkConnectionInterface",
  "metadata": null,
  "argumentDefinitions": [],
  "selections": [
    {
      "kind": "LinkedField",
      "alias": null,
      "name": "edges",
      "storageKey": null,
      "args": null,
      "concreteType": null,
      "plural": true,
      "selections": [
        {
          "kind": "LinkedField",
          "alias": null,
          "name": "node",
          "storageKey": null,
          "args": null,
          "concreteType": "Artwork",
          "plural": false,
          "selections": [
            {
              "kind": "ScalarField",
              "alias": null,
              "name": "id",
              "args": null,
              "storageKey": null
            },
            {
              "kind": "FragmentSpread",
              "name": "SaleArtworkListItem_artwork",
              "args": null
            }
          ]
        }
      ]
    }
  ]
};
(node as any).hash = '1241118cd48310d2d7972bee44ff089a';
export default node;
