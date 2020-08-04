/* tslint:disable */
/* eslint-disable */

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type FavoriteCategories_me = {
    readonly followsAndSaves: {
        readonly genes: {
            readonly pageInfo: {
                readonly endCursor: string | null;
                readonly hasNextPage: boolean;
            };
            readonly edges: ReadonlyArray<{
                readonly node: {
                    readonly gene: {
                        readonly id: string;
                        readonly name: string | null;
                        readonly href: string | null;
                        readonly image: {
                            readonly url: string | null;
                        } | null;
                    } | null;
                } | null;
            } | null> | null;
        } | null;
    } | null;
    readonly " $refType": "FavoriteCategories_me";
};
export type FavoriteCategories_me$data = FavoriteCategories_me;
export type FavoriteCategories_me$key = {
    readonly " $data"?: FavoriteCategories_me$data;
    readonly " $fragmentRefs": FragmentRefs<"FavoriteCategories_me">;
};



const node: ReaderFragment = {
  "kind": "Fragment",
  "name": "FavoriteCategories_me",
  "type": "Me",
  "metadata": {
    "connection": [
      {
        "count": "count",
        "cursor": "cursor",
        "direction": "forward",
        "path": [
          "followsAndSaves",
          "genes"
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
      "alias": null,
      "name": "followsAndSaves",
      "storageKey": null,
      "args": null,
      "concreteType": "FollowsAndSaves",
      "plural": false,
      "selections": [
        {
          "kind": "LinkedField",
          "alias": "genes",
          "name": "__Categories_followed_genes_connection",
          "storageKey": null,
          "args": null,
          "concreteType": "FollowGeneConnection",
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
              "concreteType": "FollowGeneEdge",
              "plural": true,
              "selections": [
                {
                  "kind": "LinkedField",
                  "alias": null,
                  "name": "node",
                  "storageKey": null,
                  "args": null,
                  "concreteType": "FollowGene",
                  "plural": false,
                  "selections": [
                    {
                      "kind": "LinkedField",
                      "alias": null,
                      "name": "gene",
                      "storageKey": null,
                      "args": null,
                      "concreteType": "Gene",
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
                          "kind": "ScalarField",
                          "alias": null,
                          "name": "name",
                          "args": null,
                          "storageKey": null
                        },
                        {
                          "kind": "ScalarField",
                          "alias": null,
                          "name": "href",
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
                              "name": "url",
                              "args": null,
                              "storageKey": null
                            }
                          ]
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
(node as any).hash = '791fbf6d9d437f5eee53a4f0a00475e4';
export default node;
