/* tslint:disable */
/* eslint-disable */

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type InfiniteScrollSaleArtworksGrid_connection = {
    readonly pageInfo: {
        readonly hasNextPage: boolean;
        readonly startCursor: string | null;
        readonly endCursor: string | null;
    };
    readonly edges: ReadonlyArray<{
        readonly node: {
            readonly id: string;
            readonly artwork: {
                readonly slug: string;
                readonly image: {
                    readonly aspectRatio: number;
                } | null;
            } | null;
            readonly " $fragmentRefs": FragmentRefs<"SaleArtworkGridItem_saleArtwork">;
        } | null;
    } | null> | null;
    readonly " $refType": "InfiniteScrollSaleArtworksGrid_connection";
};
export type InfiniteScrollSaleArtworksGrid_connection$data = InfiniteScrollSaleArtworksGrid_connection;
export type InfiniteScrollSaleArtworksGrid_connection$key = {
    readonly " $data"?: InfiniteScrollSaleArtworksGrid_connection$data;
    readonly " $fragmentRefs": FragmentRefs<"InfiniteScrollSaleArtworksGrid_connection">;
};



const node: ReaderFragment = {
  "kind": "Fragment",
  "name": "InfiniteScrollSaleArtworksGrid_connection",
  "type": "SaleArtworkConnection",
  "metadata": null,
  "argumentDefinitions": [],
  "selections": [
    {
      "kind": "LinkedField",
      "alias": null,
      "name": "pageInfo",
      "storageKey": null,
      "args": null,
      "concreteType": "PageInfo",
      "plural": false,
      "selections": [
        {
          "kind": "ScalarField",
          "alias": null,
          "name": "hasNextPage",
          "args": null,
          "storageKey": null
        },
        {
          "kind": "ScalarField",
          "alias": null,
          "name": "startCursor",
          "args": null,
          "storageKey": null
        },
        {
          "kind": "ScalarField",
          "alias": null,
          "name": "endCursor",
          "args": null,
          "storageKey": null
        }
      ]
    },
    {
      "kind": "LinkedField",
      "alias": null,
      "name": "edges",
      "storageKey": null,
      "args": null,
      "concreteType": "SaleArtworkEdge",
      "plural": true,
      "selections": [
        {
          "kind": "LinkedField",
          "alias": null,
          "name": "node",
          "storageKey": null,
          "args": null,
          "concreteType": "SaleArtwork",
          "plural": false,
          "selections": [
            {
              "kind": "ScalarField",
              "alias": null,
              "name": "id",
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
                  "name": "slug",
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
                      "name": "aspectRatio",
                      "args": null,
                      "storageKey": null
                    }
                  ]
                }
              ]
            },
            {
              "kind": "FragmentSpread",
              "name": "SaleArtworkGridItem_saleArtwork",
              "args": null
            }
          ]
        }
      ]
    }
  ]
};
(node as any).hash = 'ca87a38e42257b31834323caac4a1e48';
export default node;
