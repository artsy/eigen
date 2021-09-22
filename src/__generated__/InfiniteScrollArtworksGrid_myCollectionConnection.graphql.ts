/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type InfiniteScrollArtworksGrid_myCollectionConnection = {
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
                readonly aspectRatio: number;
            } | null;
            readonly " $fragmentRefs": FragmentRefs<"ArtworkGridItem_artwork" | "MyCollectionArtworkListItem_artwork">;
        } | null;
    } | null> | null;
    readonly " $refType": "InfiniteScrollArtworksGrid_myCollectionConnection";
};
export type InfiniteScrollArtworksGrid_myCollectionConnection$data = InfiniteScrollArtworksGrid_myCollectionConnection;
export type InfiniteScrollArtworksGrid_myCollectionConnection$key = {
    readonly " $data"?: InfiniteScrollArtworksGrid_myCollectionConnection$data;
    readonly " $fragmentRefs": FragmentRefs<"InfiniteScrollArtworksGrid_myCollectionConnection">;
};



const node: ReaderFragment = {
  "argumentDefinitions": [
    {
      "defaultValue": true,
      "kind": "LocalArgument",
      "name": "skipArtworkGridItem"
    }
  ],
  "kind": "Fragment",
  "metadata": null,
  "name": "InfiniteScrollArtworksGrid_myCollectionConnection",
  "selections": [
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
          "name": "hasNextPage",
          "storageKey": null
        },
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "startCursor",
          "storageKey": null
        },
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "endCursor",
          "storageKey": null
        }
      ],
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "concreteType": "MyCollectionEdge",
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
              "name": "slug",
              "storageKey": null
            },
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
              "concreteType": "Image",
              "kind": "LinkedField",
              "name": "image",
              "plural": false,
              "selections": [
                {
                  "alias": null,
                  "args": null,
                  "kind": "ScalarField",
                  "name": "aspectRatio",
                  "storageKey": null
                }
              ],
              "storageKey": null
            },
            {
              "condition": "skipArtworkGridItem",
              "kind": "Condition",
              "passingValue": false,
              "selections": [
                {
                  "args": null,
                  "kind": "FragmentSpread",
                  "name": "ArtworkGridItem_artwork"
                }
              ]
            },
            {
              "args": null,
              "kind": "FragmentSpread",
              "name": "MyCollectionArtworkListItem_artwork"
            }
          ],
          "storageKey": null
        }
      ],
      "storageKey": null
    }
  ],
  "type": "MyCollectionConnection",
  "abstractKey": null
};
(node as any).hash = 'e789684cec31a79f9a3a9a7548b781a4';
export default node;
