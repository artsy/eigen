/* tslint:disable */

import { ReaderFragment } from "relay-runtime";
import { GenericGrid_artworks$ref } from "./GenericGrid_artworks.graphql";
declare const _ShowArtworksPreview_show$ref: unique symbol;
export type ShowArtworksPreview_show$ref = typeof _ShowArtworksPreview_show$ref;
export type ShowArtworksPreview_show = {
    readonly id: string;
    readonly counts: {
        readonly artworks: number | null;
    } | null;
    readonly artworks_connection: {
        readonly edges: ReadonlyArray<{
            readonly node: {
                readonly " $fragmentRefs": GenericGrid_artworks$ref;
            } | null;
        } | null> | null;
    } | null;
    readonly " $refType": ShowArtworksPreview_show$ref;
};



const node: ReaderFragment = {
  "kind": "Fragment",
  "name": "ShowArtworksPreview_show",
  "type": "Show",
  "metadata": null,
  "argumentDefinitions": [],
  "selections": [
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
      "name": "counts",
      "storageKey": null,
      "args": null,
      "concreteType": "ShowCounts",
      "plural": false,
      "selections": [
        {
          "kind": "ScalarField",
          "alias": null,
          "name": "artworks",
          "args": null,
          "storageKey": null
        }
      ]
    },
    {
      "kind": "LinkedField",
      "alias": "artworks_connection",
      "name": "artworksConnection",
      "storageKey": "artworksConnection(first:6)",
      "args": [
        {
          "kind": "Literal",
          "name": "first",
          "value": 6
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
                {
                  "kind": "FragmentSpread",
                  "name": "GenericGrid_artworks",
                  "args": null
                }
              ]
            }
          ]
        }
      ]
    }
  ]
};
(node as any).hash = '667503651829a198e79105ef40a93c2c';
export default node;
