/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type SaleLotsList_me = {
    readonly lotsByFollowedArtistsConnection: {
        readonly edges: ReadonlyArray<{
            readonly cursor: string | null;
        } | null> | null;
        readonly " $fragmentRefs": FragmentRefs<"SaleArtworkList_connection" | "InfiniteScrollArtworksGrid_connection">;
    } | null;
    readonly " $refType": "SaleLotsList_me";
};
export type SaleLotsList_me$data = SaleLotsList_me;
export type SaleLotsList_me$key = {
    readonly " $data"?: SaleLotsList_me$data;
    readonly " $fragmentRefs": FragmentRefs<"SaleLotsList_me">;
};



const node: ReaderFragment = {
  "argumentDefinitions": [
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
      "defaultValue": null,
      "kind": "LocalArgument",
      "name": "saleID"
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
          "lotsByFollowedArtistsConnection"
        ]
      }
    ]
  },
  "name": "SaleLotsList_me",
  "selections": [
    {
      "alias": "lotsByFollowedArtistsConnection",
      "args": [
        {
          "kind": "Literal",
          "name": "includeArtworksByFollowedArtists",
          "value": false
        },
        {
          "kind": "Literal",
          "name": "isAuction",
          "value": true
        },
        {
          "kind": "Literal",
          "name": "liveSale",
          "value": true
        },
        {
          "kind": "Variable",
          "name": "saleID",
          "variableName": "saleID"
        }
      ],
      "concreteType": "SaleArtworksConnection",
      "kind": "LinkedField",
      "name": "__SaleLotsList_lotsByFollowedArtistsConnection_connection",
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
              "kind": "ScalarField",
              "name": "cursor",
              "storageKey": null
            },
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
                  "name": "__typename",
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
  "type": "Me",
  "abstractKey": null
};
(node as any).hash = '1774e0ba00b7e3e87f6deee01861398b';
export default node;
