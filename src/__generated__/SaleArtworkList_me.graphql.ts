/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type SaleArtworkList_me = {
    readonly lotsByFollowedArtistsConnection: {
        readonly edges: ReadonlyArray<{
            readonly cursor: string | null;
            readonly node: {
                readonly internalID: string;
                readonly " $fragmentRefs": FragmentRefs<"SaleArtworkListItem_artwork">;
            } | null;
        } | null> | null;
    } | null;
    readonly " $refType": "SaleArtworkList_me";
};
export type SaleArtworkList_me$data = SaleArtworkList_me;
export type SaleArtworkList_me$key = {
    readonly " $data"?: SaleArtworkList_me$data;
    readonly " $fragmentRefs": FragmentRefs<"SaleArtworkList_me">;
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
  "name": "SaleArtworkList_me",
  "selections": [
    {
      "alias": "lotsByFollowedArtistsConnection",
      "args": [
        {
          "kind": "Literal",
          "name": "isAuction",
          "value": true
        },
        {
          "kind": "Literal",
          "name": "liveSale",
          "value": true
        }
      ],
      "concreteType": "SaleArtworksConnection",
      "kind": "LinkedField",
      "name": "__SaleArtworkList_lotsByFollowedArtistsConnection_connection",
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
                  "name": "internalID",
                  "storageKey": null
                },
                {
                  "alias": null,
                  "args": null,
                  "kind": "ScalarField",
                  "name": "__typename",
                  "storageKey": null
                },
                {
                  "args": null,
                  "kind": "FragmentSpread",
                  "name": "SaleArtworkListItem_artwork"
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
        }
      ],
      "storageKey": "__SaleArtworkList_lotsByFollowedArtistsConnection_connection(isAuction:true,liveSale:true)"
    }
  ],
  "type": "Me",
  "abstractKey": null
};
(node as any).hash = '14a9e646933124692394ef1e89772f36';
export default node;
