/* tslint:disable */

import { ConcreteFragment } from "relay-runtime";
import { ArtworkGridItem_artwork$ref } from "./ArtworkGridItem_artwork.graphql";
declare const _ArtistForSaleArtworksGrid_artist$ref: unique symbol;
export type ArtistForSaleArtworksGrid_artist$ref = typeof _ArtistForSaleArtworksGrid_artist$ref;
export type ArtistForSaleArtworksGrid_artist = {
    readonly __id: string;
    readonly forSaleArtworks: ({
        readonly pageInfo: {
            readonly hasNextPage: boolean;
            readonly startCursor: string | null;
            readonly endCursor: string | null;
        };
        readonly edges: ReadonlyArray<({
            readonly node: ({
                readonly id: string;
                readonly __id: string;
                readonly image: ({
                    readonly aspect_ratio: number;
                }) | null;
                readonly " $fragmentRefs": ArtworkGridItem_artwork$ref;
            }) | null;
        }) | null> | null;
    }) | null;
    readonly " $refType": ArtistForSaleArtworksGrid_artist$ref;
};



const node: ConcreteFragment = (function(){
var v0 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "__id",
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
    v0,
    {
      "kind": "LinkedField",
      "alias": "forSaleArtworks",
      "name": "__ArtistForSaleArtworksGrid_forSaleArtworks_connection",
      "storageKey": null,
      "args": [
        {
          "kind": "Variable",
          "name": "filter",
          "variableName": "filter",
          "type": "[ArtistArtworksFilters]"
        },
        {
          "kind": "Literal",
          "name": "sort",
          "value": "partner_updated_at_desc",
          "type": "ArtworkSorts"
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
                  "name": "id",
                  "args": null,
                  "storageKey": null
                },
                v0,
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
                      "name": "aspect_ratio",
                      "args": null,
                      "storageKey": null
                    }
                  ]
                },
                {
                  "kind": "FragmentSpread",
                  "name": "ArtworkGridItem_artwork",
                  "args": null
                },
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
        }
      ]
    }
  ]
};
})();
(node as any).hash = '2c1fc4d3e1b6660af46041a3f9537d14';
export default node;
