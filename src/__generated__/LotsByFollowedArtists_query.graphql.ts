/* tslint:disable */

import { ReaderFragment } from "relay-runtime";
import { GenericGrid_artworks$ref } from "./GenericGrid_artworks.graphql";
declare const _LotsByFollowedArtists_query$ref: unique symbol;
export type LotsByFollowedArtists_query$ref = typeof _LotsByFollowedArtists_query$ref;
export type LotsByFollowedArtists_query = {
    readonly sale_artworks: {
        readonly pageInfo: {
            readonly endCursor: string | null;
            readonly hasNextPage: boolean;
        };
        readonly edges: ReadonlyArray<{
            readonly cursor: string;
            readonly node: {
                readonly artwork: {
                    readonly " $fragmentRefs": GenericGrid_artworks$ref;
                } | null;
            } | null;
        } | null> | null;
    } | null;
    readonly " $refType": LotsByFollowedArtists_query$ref;
};



const node: ReaderFragment = {
  "kind": "Fragment",
  "name": "LotsByFollowedArtists_query",
  "type": "Query",
  "metadata": {
    "connection": [
      {
        "count": "count",
        "cursor": "cursor",
        "direction": "forward",
        "path": [
          "sale_artworks"
        ]
      }
    ]
  },
  "argumentDefinitions": [
    {
      "kind": "LocalArgument",
      "name": "count",
      "type": "Int",
      "defaultValue": 10
    },
    {
      "kind": "LocalArgument",
      "name": "cursor",
      "type": "String",
      "defaultValue": null
    }
  ],
  "selections": [
    {
      "kind": "LinkedField",
      "alias": "sale_artworks",
      "name": "__LotsByFollowedArtists_sale_artworks_connection",
      "storageKey": "__LotsByFollowedArtists_sale_artworks_connection(includeArtworksByFollowedArtists:true,isAuction:true,liveSale:true)",
      "args": [
        {
          "kind": "Literal",
          "name": "includeArtworksByFollowedArtists",
          "value": true
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
        }
      ],
      "concreteType": "SaleArtworksConnection",
      "plural": false,
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
              "name": "endCursor",
              "args": null,
              "storageKey": null
            },
            {
              "kind": "ScalarField",
              "alias": null,
              "name": "hasNextPage",
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
          "concreteType": "SaleArtworksEdge",
          "plural": true,
          "selections": [
            {
              "kind": "ScalarField",
              "alias": null,
              "name": "cursor",
              "args": null,
              "storageKey": null
            },
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
                  "kind": "LinkedField",
                  "alias": null,
                  "name": "artwork",
                  "storageKey": null,
                  "args": null,
                  "concreteType": "Artwork",
                  "plural": false,
                  "selections": [
                    {
                      "kind": "FragmentSpread",
                      "name": "GenericGrid_artworks",
                      "args": null
                    }
                  ]
                },
                {
                  "kind": "ScalarField",
                  "alias": null,
                  "name": "__typename",
                  "args": null,
                  "storageKey": null
                }
              ]
            }
          ]
        }
      ]
    }
  ]
};
(node as any).hash = '1ad34c9ad2c092912183c85624269a28';
export default node;
