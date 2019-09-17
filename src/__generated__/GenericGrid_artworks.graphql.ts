/* tslint:disable */

import { ReaderFragment } from "relay-runtime";
import { ArtworkGridItem_artwork$ref } from "./ArtworkGridItem_artwork.graphql";
declare const _GenericGrid_artworks$ref: unique symbol;
export type GenericGrid_artworks$ref = typeof _GenericGrid_artworks$ref;
export type GenericGrid_artworks = ReadonlyArray<{
    readonly id: string;
    readonly image: {
        readonly aspect_ratio: number;
    } | null;
    readonly " $fragmentRefs": ArtworkGridItem_artwork$ref;
    readonly " $refType": GenericGrid_artworks$ref;
}>;



const node: ReaderFragment = {
  "kind": "Fragment",
  "name": "GenericGrid_artworks",
  "type": "Artwork",
  "metadata": {
    "plural": true
  },
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
      "kind": "FragmentSpread",
      "name": "ArtworkGridItem_artwork",
      "args": null
    }
  ]
};
(node as any).hash = '52d9394f994a4e3110dc4747d1ec410a';
export default node;
