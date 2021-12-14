/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type NewWorksForYou_me = {
    readonly artworks: {
        readonly edges: ReadonlyArray<{
            readonly node: {
                readonly id: string;
            } | null;
        } | null> | null;
        readonly " $fragmentRefs": FragmentRefs<"InfiniteScrollArtworksGrid_connection">;
    } | null;
    readonly " $refType": "NewWorksForYou_me";
};
export type NewWorksForYou_me$data = NewWorksForYou_me;
export type NewWorksForYou_me$key = {
    readonly " $data"?: NewWorksForYou_me$data | undefined;
    readonly " $fragmentRefs": FragmentRefs<"NewWorksForYou_me">;
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
          "artworks"
        ]
      }
    ]
  },
  "name": "NewWorksForYou_me",
  "selections": [
    {
      "alias": "artworks",
      "args": null,
      "concreteType": "ArtworkConnection",
      "kind": "LinkedField",
      "name": "__NewWorksForYou_artworks_connection",
      "plural": false,
      "selections": [
        {
          "alias": null,
          "args": null,
          "concreteType": "ArtworkEdge",
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
          "name": "InfiniteScrollArtworksGrid_connection"
        }
      ],
      "storageKey": null
    }
  ],
  "type": "Me",
  "abstractKey": null
};
(node as any).hash = '539d4a1fc0b82be192d8d486e2177dd5';
export default node;
