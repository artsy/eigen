/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type SaleArtworkAggregation = "ARTIST" | "FOLLOWED_ARTISTS" | "MEDIUM" | "TOTAL" | "%future added value";
export type SaleLotsList_saleArtworksConnection = {
    readonly saleArtworksConnection: {
        readonly aggregations: ReadonlyArray<{
            readonly slice: SaleArtworkAggregation | null;
            readonly counts: ReadonlyArray<{
                readonly count: number;
                readonly name: string;
                readonly value: string;
            } | null> | null;
        } | null> | null;
        readonly counts: {
            readonly followedArtists: number | null;
            readonly total: number | null;
        } | null;
        readonly edges: ReadonlyArray<{
            readonly node: {
                readonly id: string;
            } | null;
        } | null> | null;
        readonly " $fragmentRefs": FragmentRefs<"SaleArtworkList_connection" | "InfiniteScrollArtworksGrid_connection">;
    } | null;
    readonly " $refType": "SaleLotsList_saleArtworksConnection";
};
export type SaleLotsList_saleArtworksConnection$data = SaleLotsList_saleArtworksConnection;
export type SaleLotsList_saleArtworksConnection$key = {
    readonly " $data"?: SaleLotsList_saleArtworksConnection$data;
    readonly " $fragmentRefs": FragmentRefs<"SaleLotsList_saleArtworksConnection">;
};



const node: ReaderFragment = {
  "argumentDefinitions": [
    {
      "defaultValue": [],
      "kind": "LocalArgument",
      "name": "artistIDs"
    },
    {
      "defaultValue": 10,
      "kind": "LocalArgument",
      "name": "count"
    },
    {
      "defaultValue": null,
      "kind": "LocalArgument",
      "name": "cursor"
    },
    {
      "defaultValue": "",
      "kind": "LocalArgument",
      "name": "estimateRange"
    },
    {
      "defaultValue": [],
      "kind": "LocalArgument",
      "name": "geneIDs"
    },
    {
      "defaultValue": false,
      "kind": "LocalArgument",
      "name": "includeArtworksByFollowedArtists"
    },
    {
      "defaultValue": null,
      "kind": "LocalArgument",
      "name": "saleID"
    },
    {
      "defaultValue": "position",
      "kind": "LocalArgument",
      "name": "sort"
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
  "name": "SaleLotsList_saleArtworksConnection",
  "selections": [
    {
      "alias": "saleArtworksConnection",
      "args": [
        {
          "kind": "Literal",
          "name": "aggregations",
          "value": [
            "FOLLOWED_ARTISTS",
            "ARTIST",
            "MEDIUM",
            "TOTAL"
          ]
        },
        {
          "kind": "Variable",
          "name": "artistIDs",
          "variableName": "artistIDs"
        },
        {
          "kind": "Variable",
          "name": "estimateRange",
          "variableName": "estimateRange"
        },
        {
          "kind": "Variable",
          "name": "geneIDs",
          "variableName": "geneIDs"
        },
        {
          "kind": "Variable",
          "name": "includeArtworksByFollowedArtists",
          "variableName": "includeArtworksByFollowedArtists"
        },
        {
          "kind": "Variable",
          "name": "saleID",
          "variableName": "saleID"
        },
        {
          "kind": "Variable",
          "name": "sort",
          "variableName": "sort"
        }
      ],
      "concreteType": "SaleArtworksConnection",
      "kind": "LinkedField",
      "name": "__SaleLotsList_saleArtworksConnection_connection",
      "plural": false,
      "selections": [
        {
          "alias": null,
          "args": null,
          "concreteType": "SaleArtworksAggregationResults",
          "kind": "LinkedField",
          "name": "aggregations",
          "plural": true,
          "selections": [
            {
              "alias": null,
              "args": null,
              "kind": "ScalarField",
              "name": "slice",
              "storageKey": null
            },
            {
              "alias": null,
              "args": null,
              "concreteType": "AggregationCount",
              "kind": "LinkedField",
              "name": "counts",
              "plural": true,
              "selections": [
                {
                  "alias": null,
                  "args": null,
                  "kind": "ScalarField",
                  "name": "count",
                  "storageKey": null
                },
                {
                  "alias": null,
                  "args": null,
                  "kind": "ScalarField",
                  "name": "name",
                  "storageKey": null
                },
                {
                  "alias": null,
                  "args": null,
                  "kind": "ScalarField",
                  "name": "value",
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
          "concreteType": "FilterSaleArtworksCounts",
          "kind": "LinkedField",
          "name": "counts",
          "plural": false,
          "selections": [
            {
              "alias": null,
              "args": null,
              "kind": "ScalarField",
              "name": "followedArtists",
              "storageKey": null
            },
            {
              "alias": null,
              "args": null,
              "kind": "ScalarField",
              "name": "total",
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
                  "name": "id",
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
        },
        {
          "args": null,
          "kind": "FragmentSpread",
          "name": "SaleArtworkList_connection"
        },
        {
          "args": null,
          "kind": "FragmentSpread",
          "name": "InfiniteScrollArtworksGrid_connection"
        }
      ],
      "storageKey": null
    }
  ],
  "type": "Query",
  "abstractKey": null
};
(node as any).hash = '0cb50cbc9480c5ec997a1fcd2d03df13';
export default node;
