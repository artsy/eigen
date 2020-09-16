/* tslint:disable */
/* eslint-disable */

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type SaleLotsList_saleArtworks = ReadonlyArray<{
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
    readonly " $refType": "SaleLotsList_saleArtworks";
}>;
export type SaleLotsList_saleArtworks$data = SaleLotsList_saleArtworks;
export type SaleLotsList_saleArtworks$key = ReadonlyArray<{
    readonly " $data"?: SaleLotsList_saleArtworks$data;
    readonly " $fragmentRefs": FragmentRefs<"SaleLotsList_saleArtworks">;
}>;



const node: ReaderFragment = {
  "kind": "Fragment",
  "name": "SaleLotsList_saleArtworks",
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
(node as any).hash = 'ca4a46e0cceecae6da53b8bce55cebb2';
export default node;
