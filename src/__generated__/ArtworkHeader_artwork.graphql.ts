/* tslint:disable */

import { ReaderFragment } from "relay-runtime";
import { ArtworkActions_artwork$ref } from "./ArtworkActions_artwork.graphql";
import { ArtworkTombstone_artwork$ref } from "./ArtworkTombstone_artwork.graphql";
import { ImageCarousel_images$ref } from "./ImageCarousel_images.graphql";
declare const _ArtworkHeader_artwork$ref: unique symbol;
export type ArtworkHeader_artwork$ref = typeof _ArtworkHeader_artwork$ref;
export type ArtworkHeader_artwork = {
    readonly images: ReadonlyArray<{
        readonly " $fragmentRefs": ImageCarousel_images$ref;
    } | null> | null;
    readonly " $fragmentRefs": ArtworkActions_artwork$ref & ArtworkTombstone_artwork$ref;
    readonly " $refType": ArtworkHeader_artwork$ref;
};



const node: ReaderFragment = {
  "kind": "Fragment",
  "name": "ArtworkHeader_artwork",
  "type": "Artwork",
  "metadata": null,
  "argumentDefinitions": [],
  "selections": [
    {
      "kind": "LinkedField",
      "alias": null,
      "name": "images",
      "storageKey": null,
      "args": null,
      "concreteType": "Image",
      "plural": true,
      "selections": [
        {
          "kind": "FragmentSpread",
          "name": "ImageCarousel_images",
          "args": null
        }
      ]
    },
    {
      "kind": "FragmentSpread",
      "name": "ArtworkActions_artwork",
      "args": null
    },
    {
      "kind": "FragmentSpread",
      "name": "ArtworkTombstone_artwork",
      "args": null
    }
  ]
};
(node as any).hash = 'ab997ece8f9a2923fa7f484708ba9d65';
export default node;
