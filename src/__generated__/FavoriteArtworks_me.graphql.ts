/* tslint:disable */
/* eslint-disable */

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type FavoriteArtworks_me = {
    readonly followsAndSaves: {
        readonly artworks: {
            readonly pageInfo: {
                readonly startCursor: string | null;
                readonly endCursor: string | null;
                readonly hasPreviousPage: boolean;
                readonly hasNextPage: boolean;
            };
            readonly edges: ReadonlyArray<{
                readonly node: {
                    readonly " $fragmentRefs": FragmentRefs<"GenericGrid_artworks">;
                } | null;
            } | null> | null;
        } | null;
    } | null;
    readonly " $refType": "FavoriteArtworks_me";
};
export type FavoriteArtworks_me$data = FavoriteArtworks_me;
export type FavoriteArtworks_me$key = {
    readonly " $data"?: FavoriteArtworks_me$data;
    readonly " $fragmentRefs": FragmentRefs<"FavoriteArtworks_me">;
};



const node: ReaderFragment = {
  "kind": "Fragment",
  "name": "FavoriteArtworks_me",
  "type": "Me",
  "metadata": {
    "connection": [
      {
        "count": "count",
        "cursor": "cursor",
        "direction": "forward",
        "path": [
          "followsAndSaves",
          "artworks"
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
      "defaultValue": ""
    }
  ],
  "selections": [
    {
      "kind": "LinkedField",
      "alias": null,
      "name": "followsAndSaves",
      "storageKey": null,
      "args": null,
      "concreteType": "FollowsAndSaves",
      "plural": false,
      "selections": [
        {
          "kind": "LinkedField",
          "alias": "artworks",
          "name": "__GenericGrid_artworks_connection",
          "storageKey": "__GenericGrid_artworks_connection(private:true)",
          "args": [
            {
              "kind": "Literal",
              "name": "private",
              "value": true
            }
          ],
          "concreteType": "SavedArtworksConnection",
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
                },
                {
                  "kind": "ScalarField",
                  "alias": null,
                  "name": "hasPreviousPage",
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
              "concreteType": "SavedArtworksEdge",
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
                      "name": "__typename",
                      "args": null,
                      "storageKey": null
                    },
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
                  "name": "cursor",
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
(node as any).hash = '18cca48bc32f0ad88078d4b8bbef7d92';
export default node;
