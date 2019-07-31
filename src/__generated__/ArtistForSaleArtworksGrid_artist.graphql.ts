/* tslint:disable */

import { ReaderFragment } from "relay-runtime";
import { ArtworkGridItem_artwork$ref } from "./ArtworkGridItem_artwork.graphql";
declare const _ArtistForSaleArtworksGrid_artist$ref: unique symbol;
export type ArtistForSaleArtworksGrid_artist$ref = typeof _ArtistForSaleArtworksGrid_artist$ref;
export type ArtistForSaleArtworksGrid_artist = {
    readonly id: string;
    readonly forSaleArtworks: {
        readonly pageInfo: {
            readonly hasNextPage: boolean;
            readonly startCursor: string | null;
            readonly endCursor: string | null;
        };
        readonly edges: ReadonlyArray<{
            readonly node: {
                readonly slug: string;
                readonly id: string;
                readonly image: {
                    readonly aspect_ratio: number;
                } | null;
                readonly " $fragmentRefs": ArtworkGridItem_artwork$ref;
            } | null;
        } | null> | null;
    } | null;
    readonly " $refType": ArtistForSaleArtworksGrid_artist$ref;
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
  "name": "ArtistForSaleArtworksGrid_artist",
  "type": "Artist",
  "metadata": {
    "connection": [
      {
        "count": "count",
        "cursor": "cursor",
        "direction": "forward",
        "path": [
          "forSaleArtworks"
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
        "IS_FOR_SALE"
      ]
    }
  ],
  "selections": [
    (v0/*: any*/),
    {
      "kind": "LinkedField",
      "alias": "forSaleArtworks",
      "name": "__ArtistForSaleArtworksGrid_forSaleArtworks_connection",
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
                {
                  "kind": "ScalarField",
                  "alias": null,
                  "name": "slug",
                  "args": null,
                  "storageKey": null
                },
                (v0/*: any*/),
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
                      "alias": "aspect_ratio",
                      "name": "aspectRatio",
                      "args": null,
                      "storageKey": null
                    }
                  ]
                },
                {
                  "kind": "ScalarField",
                  "alias": null,
                  "name": "__typename",
                  "args": null,
                  "storageKey": null
                },
                {
                  "kind": "FragmentSpread",
                  "name": "ArtworkGridItem_artwork",
                  "args": null
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
        }
      ]
    }
  ]
};
})();
(node as any).hash = '0a6ae3d4d65df041832fa8ff6ddd0dae';
export default node;
