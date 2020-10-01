/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type Sale_sale = {
    readonly saleArtworksConnection: {
        readonly edges: ReadonlyArray<{
            readonly node: {
                readonly " $fragmentRefs": FragmentRefs<"SaleArtworksRail_saleArtworks">;
            } | null;
        } | null> | null;
    } | null;
    readonly " $fragmentRefs": FragmentRefs<"SaleHeader_sale" | "RegisterToBidButton_sale">;
    readonly " $refType": "Sale_sale";
};
export type Sale_sale$data = Sale_sale;
export type Sale_sale$key = {
    readonly " $data"?: Sale_sale$data;
    readonly " $fragmentRefs": FragmentRefs<"Sale_sale">;
};



const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "Sale_sale",
  "selections": [
    {
      "alias": null,
      "args": [
        {
          "kind": "Literal",
          "name": "first",
          "value": 10
        }
      ],
      "concreteType": "SaleArtworkConnection",
      "kind": "LinkedField",
      "name": "saleArtworksConnection",
      "plural": false,
      "selections": [
        {
          "alias": null,
          "args": null,
          "concreteType": "SaleArtworkEdge",
          "kind": "LinkedField",
          "name": "edges",
          "plural": true,
          "selections": [
            {
              "alias": null,
              "args": null,
              "concreteType": "SaleArtwork",
              "kind": "LinkedField",
              "name": "node",
              "plural": false,
              "selections": [
                {
                  "args": null,
                  "kind": "FragmentSpread",
                  "name": "SaleArtworksRail_saleArtworks"
                }
              ],
              "storageKey": null
            }
          ],
          "storageKey": null
        }
      ],
      "storageKey": "saleArtworksConnection(first:10)"
    },
    {
      "args": null,
      "kind": "FragmentSpread",
      "name": "SaleHeader_sale"
    },
    {
      "args": null,
      "kind": "FragmentSpread",
      "name": "RegisterToBidButton_sale"
    }
  ],
  "type": "Sale",
  "abstractKey": null
};
(node as any).hash = '8e7755d57dc6b5445507a23eb23c2e0e';
export default node;
