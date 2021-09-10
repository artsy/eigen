/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type SearchArtworksGrid_artworks = ReadonlyArray<{
    readonly id: string;
    readonly image: {
        readonly aspect_ratio: number;
    } | null;
    readonly " $fragmentRefs": FragmentRefs<"ArtworkGridItem_artwork">;
    readonly " $refType": "SearchArtworksGrid_artworks";
}>;
export type SearchArtworksGrid_artworks$data = SearchArtworksGrid_artworks;
export type SearchArtworksGrid_artworks$key = ReadonlyArray<{
    readonly " $data"?: SearchArtworksGrid_artworks$data;
    readonly " $fragmentRefs": FragmentRefs<"SearchArtworksGrid_artworks">;
}>;



const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": {
    "plural": true
  },
  "name": "SearchArtworksGrid_artworks",
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
      "concreteType": "Image",
      "kind": "LinkedField",
      "name": "image",
      "plural": false,
      "selections": [
        {
          "alias": "aspect_ratio",
          "args": null,
          "kind": "ScalarField",
          "name": "aspectRatio",
          "storageKey": null
        }
      ],
      "storageKey": null
    },
    {
      "args": null,
      "kind": "FragmentSpread",
      "name": "ArtworkGridItem_artwork"
    }
  ],
  "type": "Artwork",
  "abstractKey": null
};
(node as any).hash = '7d9f73429d23691fd24fa6b2e8806da7';
export default node;
