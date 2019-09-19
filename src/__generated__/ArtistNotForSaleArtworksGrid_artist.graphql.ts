/* tslint:disable */

import { ReaderFragment } from "relay-runtime";
import { InfiniteScrollArtworksGrid_connection$ref } from "./InfiniteScrollArtworksGrid_connection.graphql";
declare const _ArtistNotForSaleArtworksGrid_artist$ref: unique symbol;
export type ArtistNotForSaleArtworksGrid_artist$ref = typeof _ArtistNotForSaleArtworksGrid_artist$ref;
export type ArtistNotForSaleArtworksGrid_artist = {
    readonly id: string;
    readonly notForSaleArtworks: {
        readonly edges: ReadonlyArray<{
            readonly node: {
                readonly id: string;
                readonly __typename: string;
            } | null;
            readonly cursor: string;
        } | null> | null;
        readonly pageInfo: {
            readonly endCursor: string | null;
            readonly hasNextPage: boolean;
        };
        readonly " $fragmentRefs": InfiniteScrollArtworksGrid_connection$ref;
    } | null;
    readonly " $refType": ArtistNotForSaleArtworksGrid_artist$ref;
};



const node: ReaderFragment = (function(){
var v0 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "id",
  "args": null,
  "storageKey": null
};
return {
  "kind": "Fragment",
  "name": "ArtistNotForSaleArtworksGrid_artist",
  "type": "Artist",
  "metadata": {
    "connection": [
      {
        "count": "count",
        "cursor": "cursor",
        "direction": "forward",
        "path": [
          "notForSaleArtworks"
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
    },
    {
      "kind": "LocalArgument",
      "name": "filter",
      "type": "[ArtistArtworksFilters]",
      "defaultValue": [
        "IS_NOT_FOR_SALE"
      ]
    }
  ],
  "selections": [
    (v0/*: any*/),
    {
      "kind": "LinkedField",
      "alias": "notForSaleArtworks",
      "name": "__ArtistNotForSaleArtworksGrid_notForSaleArtworks_connection",
      "storageKey": null,
      "args": [
        {
          "kind": "Variable",
          "name": "filter",
          "variableName": "filter"
        },
        {
          "kind": "Literal",
          "name": "sort",
          "value": "PARTNER_UPDATED_AT_DESC"
        }
      ],
      "concreteType": "ArtworkConnection",
      "plural": false,
      "selections": [
        {
          "kind": "LinkedField",
          "alias": null,
          "name": "edges",
          "storageKey": null,
          "args": null,
          "concreteType": "ArtworkEdge",
          "plural": true,
          "selections": [
            {
              "kind": "LinkedField",
              "alias": null,
              "name": "node",
              "storageKey": null,
              "args": null,
              "concreteType": "Artwork",
              "plural": false,
              "selections": [
                (v0/*: any*/),
                {
                  "kind": "ScalarField",
                  "alias": null,
                  "name": "__typename",
                  "args": null,
                  "storageKey": null
                }
              ]
            },
            {
              "kind": "ScalarField",
              "alias": null,
              "name": "cursor",
              "args": null,
              "storageKey": null
            }
          ]
        },
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
          "kind": "FragmentSpread",
          "name": "InfiniteScrollArtworksGrid_connection",
          "args": null
        }
      ]
    }
  ]
};
})();
(node as any).hash = 'd7bdb4613266fb97d1f2a964b63ad1da';
export default node;
