/* tslint:disable */
/* eslint-disable */

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type SaleArtworksRail_saleArtworks = ReadonlyArray<{
    readonly artwork: {
        readonly image: {
            readonly url: string | null;
        } | null;
        readonly href: string | null;
        readonly saleMessage: string | null;
        readonly artistNames: string | null;
        readonly slug: string;
        readonly internalID: string;
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
        } | null;
        readonly partner: {
            readonly name: string | null;
        } | null;
    } | null;
    readonly lotLabel: string | null;
    readonly " $refType": "SaleArtworksRail_saleArtworks";
}>;
export type SaleArtworksRail_saleArtworks$data = SaleArtworksRail_saleArtworks;
export type SaleArtworksRail_saleArtworks$key = ReadonlyArray<{
    readonly " $data"?: SaleArtworksRail_saleArtworks$data;
    readonly " $fragmentRefs": FragmentRefs<"SaleArtworksRail_saleArtworks">;
}>;



const node: ReaderFragment = {
  "kind": "Fragment",
  "name": "SaleArtworksRail_saleArtworks",
  "type": "SaleArtwork",
  "metadata": {
    "plural": true
  },
  "argumentDefinitions": [],
  "selections": [
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
                  "value": "small"
                }
              ],
              "storageKey": "url(version:\"small\")"
            }
          ]
        },
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
            }
          ]
        },
        {
          "kind": "LinkedField",
          "alias": null,
          "name": "partner",
          "storageKey": null,
          "args": null,
          "concreteType": "Partner",
          "plural": false,
          "selections": [
            {
              "kind": "ScalarField",
              "alias": null,
              "name": "name",
              "args": null,
              "storageKey": null
            }
          ]
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
};
(node as any).hash = '65c21ec9ea1bbc1ba4eea8f2e4fadcc3';
export default node;
