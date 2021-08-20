/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type WatchedLot_saleArtwork = {
    readonly lotState: {
        readonly bidCount: number | null;
        readonly sellingPrice: {
            readonly display: string | null;
        } | null;
    } | null;
    readonly artwork: {
        readonly internalID: string;
        readonly href: string | null;
        readonly slug: string;
    } | null;
    readonly " $fragmentRefs": FragmentRefs<"Lot_saleArtwork">;
    readonly " $refType": "WatchedLot_saleArtwork";
};
export type WatchedLot_saleArtwork$data = WatchedLot_saleArtwork;
export type WatchedLot_saleArtwork$key = {
    readonly " $data"?: WatchedLot_saleArtwork$data;
    readonly " $fragmentRefs": FragmentRefs<"WatchedLot_saleArtwork">;
};



const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "WatchedLot_saleArtwork",
  "selections": [
    {
      "alias": null,
      "args": null,
      "concreteType": "CausalityLotState",
      "kind": "LinkedField",
      "name": "lotState",
      "plural": false,
      "selections": [
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "bidCount",
          "storageKey": null
        },
        {
          "alias": null,
          "args": null,
          "concreteType": "Money",
          "kind": "LinkedField",
          "name": "sellingPrice",
          "plural": false,
          "selections": [
            {
              "alias": null,
              "args": null,
              "kind": "ScalarField",
              "name": "display",
              "storageKey": null
            }
          ],
          "storageKey": null
        }
      ],
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
          "name": "href",
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
    },
    {
      "args": null,
      "kind": "FragmentSpread",
      "name": "Lot_saleArtwork"
    }
  ],
  "type": "SaleArtwork",
  "abstractKey": null
};
(node as any).hash = '6111866c78843dcaaeddbc368afb0f5b';
export default node;
