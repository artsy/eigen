/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

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
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": {
    "plural": true
  },
  "name": "SaleArtworksRail_saleArtworks",
  "selections": [
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
                  "value": "small"
                }
              ],
              "kind": "ScalarField",
              "name": "url",
              "storageKey": "url(version:\"small\")"
            }
          ],
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
          "name": "saleMessage",
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
          "name": "slug",
          "storageKey": null
        },
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
          "concreteType": "Sale",
          "kind": "LinkedField",
          "name": "sale",
          "plural": false,
          "selections": [
            {
              "alias": null,
              "args": null,
              "kind": "ScalarField",
              "name": "isAuction",
              "storageKey": null
            },
            {
              "alias": null,
              "args": null,
              "kind": "ScalarField",
              "name": "isClosed",
              "storageKey": null
            },
            {
              "alias": null,
              "args": null,
              "kind": "ScalarField",
              "name": "displayTimelyAt",
              "storageKey": null
            },
            {
              "alias": null,
              "args": null,
              "kind": "ScalarField",
              "name": "endAt",
              "storageKey": null
            }
          ],
          "storageKey": null
        },
        {
          "alias": null,
          "args": null,
          "concreteType": "SaleArtwork",
          "kind": "LinkedField",
          "name": "saleArtwork",
          "plural": false,
          "selections": [
            {
              "alias": null,
              "args": null,
              "concreteType": "SaleArtworkCounts",
              "kind": "LinkedField",
              "name": "counts",
              "plural": false,
              "selections": [
                {
                  "alias": null,
                  "args": null,
                  "kind": "ScalarField",
                  "name": "bidderPositions",
                  "storageKey": null
                }
              ],
              "storageKey": null
            },
            {
              "alias": null,
              "args": null,
              "concreteType": "SaleArtworkCurrentBid",
              "kind": "LinkedField",
              "name": "currentBid",
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
          "concreteType": "Partner",
          "kind": "LinkedField",
          "name": "partner",
          "plural": false,
          "selections": [
            {
              "alias": null,
              "args": null,
              "kind": "ScalarField",
              "name": "name",
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
      "kind": "ScalarField",
      "name": "lotLabel",
      "storageKey": null
    }
  ],
  "type": "SaleArtwork",
  "abstractKey": null
};
(node as any).hash = '65c21ec9ea1bbc1ba4eea8f2e4fadcc3';
export default node;
