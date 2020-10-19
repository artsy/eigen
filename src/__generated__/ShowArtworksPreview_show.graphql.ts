/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type ShowArtworksPreview_show = {
    readonly id: string;
    readonly counts: {
        readonly artworks: number | null;
    } | null;
    readonly artworks: {
        readonly edges: ReadonlyArray<{
            readonly node: {
                readonly " $fragmentRefs": FragmentRefs<"GenericGrid_artworks">;
            } | null;
        } | null> | null;
    } | null;
    readonly " $refType": "ShowArtworksPreview_show";
};
export type ShowArtworksPreview_show$data = ShowArtworksPreview_show;
export type ShowArtworksPreview_show$key = {
    readonly " $data"?: ShowArtworksPreview_show$data;
    readonly " $fragmentRefs": FragmentRefs<"ShowArtworksPreview_show">;
};



const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "ShowArtworksPreview_show",
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
      "concreteType": "ShowCounts",
      "kind": "LinkedField",
      "name": "counts",
      "plural": false,
      "selections": [
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "artworks",
          "storageKey": null
        }
      ],
      "storageKey": null
    },
    {
      "alias": "artworks",
      "args": [
        {
          "kind": "Literal",
          "name": "first",
          "value": 6
        }
      ],
      "concreteType": "ArtworkConnection",
      "kind": "LinkedField",
      "name": "artworksConnection",
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
                  "args": null,
                  "kind": "FragmentSpread",
                  "name": "GenericGrid_artworks"
                }
              ],
              "storageKey": null
            }
          ],
          "storageKey": null
        }
      ],
      "storageKey": "artworksConnection(first:6)"
    }
  ],
  "type": "Show",
  "abstractKey": null
};
(node as any).hash = '9dbd4c1cb63baa83a061b7488c107346';
export default node;
