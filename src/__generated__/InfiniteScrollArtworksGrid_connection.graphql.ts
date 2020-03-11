/* tslint:disable */

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type InfiniteScrollArtworksGrid_connection = {
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
            readonly " $fragmentRefs": FragmentRefs<"ArtworkGridItem_artwork">;
        } | null;
    } | null> | null;
    readonly " $refType": "InfiniteScrollArtworksGrid_connection";
};



const node: ReaderFragment = {
  "kind": "Fragment",
  "name": "InfiniteScrollArtworksGrid_connection",
  "type": "ArtworkConnectionInterface",
  "metadata": null,
  "argumentDefinitions": [],
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
      "concreteType": null,
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
            {
              "kind": "ScalarField",
              "alias": null,
              "name": "id",
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
                  "name": "aspectRatio",
                  "args": null,
                  "storageKey": null
                }
              ]
            },
            {
              "kind": "FragmentSpread",
              "name": "ArtworkGridItem_artwork",
              "args": null
            }
          ]
        }
      ]
    }
  ]
};
(node as any).hash = '3dbe4d4a52a1c5aede121c154e463718';
export default node;
