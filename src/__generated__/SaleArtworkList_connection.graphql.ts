/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

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
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "SaleArtworkList_connection",
  "selections": [
    {
      "alias": null,
      "args": null,
      "concreteType": null,
      "kind": "LinkedField",
      "name": "edges",
      "plural": true,
      "selections": [
        {
          "alias": null,
          "args": null,
          "concreteType": "Artwork",
          "kind": "LinkedField",
          "name": "node",
          "plural": false,
          "selections": [
            {
              "alias": null,
              "args": null,
              "kind": "ScalarField",
              "name": "id",
              "storageKey": null
            },
            {
              "args": null,
              "kind": "FragmentSpread",
              "name": "SaleArtworkListItem_artwork"
            }
          ],
          "storageKey": null
        }
      ],
      "storageKey": null
    }
  ],
  "type": "ArtworkConnectionInterface",
  "abstractKey": "__isArtworkConnectionInterface"
};
(node as any).hash = '1241118cd48310d2d7972bee44ff089a';
export default node;
