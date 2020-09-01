/* tslint:disable */
/* eslint-disable */

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type Lot_saleArtwork = {
    readonly lotLabel: string | null;
    readonly artwork: {
        readonly artistNames: string | null;
        readonly href: string | null;
        readonly image: {
            readonly url: string | null;
        } | null;
    } | null;
    readonly " $refType": "Lot_saleArtwork";
};
export type Lot_saleArtwork$data = Lot_saleArtwork;
export type Lot_saleArtwork$key = {
    readonly " $data"?: Lot_saleArtwork$data;
    readonly " $fragmentRefs": FragmentRefs<"Lot_saleArtwork">;
};



const node: ReaderFragment = {
  "kind": "Fragment",
  "name": "Lot_saleArtwork",
  "type": "SaleArtwork",
  "metadata": null,
  "argumentDefinitions": [],
  "selections": [
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "lotLabel",
      "args": null,
      "storageKey": null
    },
    {
      "kind": "LinkedField",
      "alias": null,
      "name": "artwork",
      "storageKey": null,
      "args": null,
      "concreteType": "Artwork",
      "plural": false,
      "selections": [
        {
          "kind": "ScalarField",
          "alias": null,
          "name": "artistNames",
          "args": null,
          "storageKey": null
        },
        {
          "kind": "ScalarField",
          "alias": null,
          "name": "href",
          "args": null,
          "storageKey": null
        },
        {
          "kind": "LinkedField",
          "alias": null,
          "name": "image",
          "storageKey": null,
          "args": null,
          "concreteType": "Image",
          "plural": false,
          "selections": [
            {
              "kind": "ScalarField",
              "alias": null,
              "name": "url",
              "args": [
                {
                  "kind": "Literal",
                  "name": "version",
                  "value": "medium"
                }
              ],
              "storageKey": "url(version:\"medium\")"
            }
          ]
        }
      ]
    }
  ]
};
(node as any).hash = '7362f1283efd28a8c41e0cd2bec8909b';
export default node;
