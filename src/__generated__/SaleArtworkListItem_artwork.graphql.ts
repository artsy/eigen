/* tslint:disable */
/* eslint-disable */

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type SaleArtworkListItem_artwork = {
    readonly title: string | null;
    readonly date: string | null;
    readonly saleMessage: string | null;
    readonly slug: string;
    readonly internalID: string;
    readonly artistNames: string | null;
    readonly href: string | null;
    readonly sale: {
        readonly isAuction: boolean | null;
        readonly isClosed: boolean | null;
        readonly displayTimelyAt: string | null;
        readonly endAt: string | null;
    } | null;
    readonly saleArtwork: {
        readonly counts: {
            readonly bidderPositions: number | null;
        } | null;
        readonly currentBid: {
            readonly display: string | null;
        } | null;
        readonly lotLabel: string | null;
    } | null;
    readonly image: {
        readonly small: string | null;
        readonly aspectRatio: number;
        readonly height: number | null;
        readonly width: number | null;
    } | null;
    readonly " $refType": "SaleArtworkListItem_artwork";
};
export type SaleArtworkListItem_artwork$data = SaleArtworkListItem_artwork;
export type SaleArtworkListItem_artwork$key = {
    readonly " $data"?: SaleArtworkListItem_artwork$data;
    readonly " $fragmentRefs": FragmentRefs<"SaleArtworkListItem_artwork">;
};



const node: ReaderFragment = {
  "kind": "Fragment",
  "name": "SaleArtworkListItem_artwork",
  "type": "Artwork",
  "metadata": null,
  "argumentDefinitions": [],
  "selections": [
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "title",
      "args": null,
      "storageKey": null
    },
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "date",
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
      "name": "slug",
      "args": null,
      "storageKey": null
    },
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "internalID",
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
      "kind": "ScalarField",
      "alias": null,
      "name": "href",
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
        },
        {
          "kind": "ScalarField",
          "alias": null,
          "name": "endAt",
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
          "name": "counts",
          "storageKey": null,
          "args": null,
          "concreteType": "SaleArtworkCounts",
          "plural": false,
          "selections": [
            {
              "kind": "ScalarField",
              "alias": null,
              "name": "bidderPositions",
              "args": null,
              "storageKey": null
            }
          ]
        },
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
        },
        {
          "kind": "ScalarField",
          "alias": null,
          "name": "lotLabel",
          "args": null,
          "storageKey": null
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
          "alias": "small",
          "name": "url",
          "args": [
            {
              "kind": "Literal",
              "name": "version",
              "value": "small"
            }
          ],
          "storageKey": "url(version:\"small\")"
        },
        {
          "kind": "ScalarField",
          "alias": null,
          "name": "aspectRatio",
          "args": null,
          "storageKey": null
        },
        {
          "kind": "ScalarField",
          "alias": null,
          "name": "height",
          "args": null,
          "storageKey": null
        },
        {
          "kind": "ScalarField",
          "alias": null,
          "name": "width",
          "args": null,
          "storageKey": null
        }
      ]
    }
  ]
};
(node as any).hash = 'eb1709d589e6301c760b9dc7b51a4663';
export default node;
