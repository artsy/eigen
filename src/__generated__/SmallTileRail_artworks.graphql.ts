/* tslint:disable */
/* eslint-disable */

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type SmallTileRail_artworks = ReadonlyArray<{
    readonly href: string | null;
    readonly saleMessage: string | null;
    readonly artistNames: string | null;
    readonly sale: {
        readonly isAuction: boolean | null;
        readonly isClosed: boolean | null;
        readonly displayTimelyAt: string | null;
    } | null;
    readonly saleArtwork: {
        readonly currentBid: {
            readonly display: string | null;
        } | null;
    } | null;
    readonly image: {
        readonly imageURL: string | null;
    } | null;
    readonly " $refType": "SmallTileRail_artworks";
}>;
export type SmallTileRail_artworks$data = SmallTileRail_artworks;
export type SmallTileRail_artworks$key = ReadonlyArray<{
    readonly " $data"?: SmallTileRail_artworks$data;
    readonly " $fragmentRefs": FragmentRefs<"SmallTileRail_artworks">;
}>;



const node: ReaderFragment = {
  "kind": "Fragment",
  "name": "SmallTileRail_artworks",
  "type": "Artwork",
  "metadata": {
    "plural": true
  },
  "argumentDefinitions": [],
  "selections": [
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "href",
      "args": null,
      "storageKey": null
    },
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "saleMessage",
      "args": null,
      "storageKey": null
    },
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "artistNames",
      "args": null,
      "storageKey": null
    },
    {
      "kind": "LinkedField",
      "alias": null,
      "name": "sale",
      "storageKey": null,
      "args": null,
      "concreteType": "Sale",
      "plural": false,
      "selections": [
        {
          "kind": "ScalarField",
          "alias": null,
          "name": "isAuction",
          "args": null,
          "storageKey": null
        },
        {
          "kind": "ScalarField",
          "alias": null,
          "name": "isClosed",
          "args": null,
          "storageKey": null
        },
        {
          "kind": "ScalarField",
          "alias": null,
          "name": "displayTimelyAt",
          "args": null,
          "storageKey": null
        }
      ]
    },
    {
      "kind": "LinkedField",
      "alias": null,
      "name": "saleArtwork",
      "storageKey": null,
      "args": null,
      "concreteType": "SaleArtwork",
      "plural": false,
      "selections": [
        {
          "kind": "LinkedField",
          "alias": null,
          "name": "currentBid",
          "storageKey": null,
          "args": null,
          "concreteType": "SaleArtworkCurrentBid",
          "plural": false,
          "selections": [
            {
              "kind": "ScalarField",
              "alias": null,
              "name": "display",
              "args": null,
              "storageKey": null
            }
          ]
        }
      ]
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
          "name": "imageURL",
          "args": null,
          "storageKey": null
        }
      ]
    }
  ]
};
(node as any).hash = '590fe14122b5d4e4b116582632664623';
export default node;
