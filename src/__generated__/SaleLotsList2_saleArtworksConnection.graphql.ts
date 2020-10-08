/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type SaleLotsList2_saleArtworksConnection = {
    readonly saleArtworksConnection: {
        readonly edges: ReadonlyArray<{
            readonly node: {
                readonly title: string | null;
            } | null;
        } | null> | null;
        readonly totalCount: number | null;
    } | null;
    readonly " $refType": "SaleLotsList2_saleArtworksConnection";
};
export type SaleLotsList2_saleArtworksConnection$data = SaleLotsList2_saleArtworksConnection;
export type SaleLotsList2_saleArtworksConnection$key = {
    readonly " $data"?: SaleLotsList2_saleArtworksConnection$data;
    readonly " $fragmentRefs": FragmentRefs<"SaleLotsList2_saleArtworksConnection">;
};



const node: ReaderFragment = {
  "argumentDefinitions": [
    {
      "defaultValue": null,
      "kind": "LocalArgument",
      "name": "count"
    },
    {
      "defaultValue": null,
      "kind": "LocalArgument",
      "name": "cursor"
    }
  ],
  "kind": "Fragment",
  "metadata": {
    "connection": [
      {
        "count": "count",
        "cursor": "cursor",
        "direction": "forward",
        "path": [
          "saleArtworksConnection"
        ]
      }
    ]
  },
  "name": "SaleLotsList2_saleArtworksConnection",
  "selections": [
    {
      "alias": "saleArtworksConnection",
      "args": null,
      "concreteType": "SaleArtworksConnection",
      "kind": "LinkedField",
      "name": "__SaleLotsList2_saleArtworksConnection_connection",
      "plural": false,
      "selections": [
        {
          "alias": null,
          "args": null,
          "concreteType": "SaleArtwork",
          "kind": "LinkedField",
          "name": "edges",
          "plural": true,
          "selections": [
            {
              "alias": null,
              "args": null,
              "concreteType": "Artwork",
              "kind": "LinkedField",
              "name": "node",
              "plural": false,
              "selections": [
                {
                  "alias": null,
                  "args": null,
                  "kind": "ScalarField",
                  "name": "title",
                  "storageKey": null
                },
                {
                  "alias": null,
                  "args": null,
                  "kind": "ScalarField",
                  "name": "__typename",
                  "storageKey": null
                }
              ],
              "storageKey": null
            },
            {
              "alias": null,
              "args": null,
              "kind": "ScalarField",
              "name": "cursor",
              "storageKey": null
            }
          ],
          "storageKey": null
        },
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "totalCount",
          "storageKey": null
        },
        {
          "alias": null,
          "args": null,
          "concreteType": "PageInfo",
          "kind": "LinkedField",
          "name": "pageInfo",
          "plural": false,
          "selections": [
            {
              "alias": null,
              "args": null,
              "kind": "ScalarField",
              "name": "endCursor",
              "storageKey": null
            },
            {
              "alias": null,
              "args": null,
              "kind": "ScalarField",
              "name": "hasNextPage",
              "storageKey": null
            }
          ],
          "storageKey": null
        }
      ],
      "storageKey": null
    }
  ],
  "type": "Query",
  "abstractKey": null
};
(node as any).hash = '3d3392393b18d58cfe19a216e9cda24e';
export default node;
