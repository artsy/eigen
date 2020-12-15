/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type Lot_saleArtwork = {
    readonly lotLabel: string | null;
    readonly artwork: {
        readonly internalID: string;
        readonly artistNames: string | null;
        readonly href: string | null;
        readonly image: {
            readonly url: string | null;
        } | null;
        readonly slug: string;
    } | null;
    readonly " $refType": "Lot_saleArtwork";
};
export type Lot_saleArtwork$data = Lot_saleArtwork;
export type Lot_saleArtwork$key = {
    readonly " $data"?: Lot_saleArtwork$data;
    readonly " $fragmentRefs": FragmentRefs<"Lot_saleArtwork">;
};



const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "Lot_saleArtwork",
  "selections": [
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "lotLabel",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "concreteType": "Artwork",
      "kind": "LinkedField",
      "name": "artwork",
      "plural": false,
      "selections": [
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "internalID",
          "storageKey": null
        },
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "artistNames",
          "storageKey": null
        },
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "href",
          "storageKey": null
        },
        {
          "alias": null,
          "args": null,
          "concreteType": "Image",
          "kind": "LinkedField",
          "name": "image",
          "plural": false,
          "selections": [
            {
              "alias": null,
              "args": [
                {
                  "kind": "Literal",
                  "name": "version",
                  "value": "medium"
                }
              ],
              "kind": "ScalarField",
              "name": "url",
              "storageKey": "url(version:\"medium\")"
            }
          ],
          "storageKey": null
        },
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "slug",
          "storageKey": null
        }
      ],
      "storageKey": null
    }
  ],
  "type": "SaleArtwork",
  "abstractKey": null
};
(node as any).hash = 'faba5fc5663f570bf73bc79e70fae42d';
export default node;
