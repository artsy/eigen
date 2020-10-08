/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type ArtworkHeader_artwork = {
    readonly images: ReadonlyArray<{
        readonly " $fragmentRefs": FragmentRefs<"ImageCarousel_images">;
    } | null> | null;
    readonly " $fragmentRefs": FragmentRefs<"ArtworkActions_artwork" | "ArtworkTombstone_artwork">;
    readonly " $refType": "ArtworkHeader_artwork";
};
export type ArtworkHeader_artwork$data = ArtworkHeader_artwork;
export type ArtworkHeader_artwork$key = {
    readonly " $data"?: ArtworkHeader_artwork$data;
    readonly " $fragmentRefs": FragmentRefs<"ArtworkHeader_artwork">;
};



const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "ArtworkHeader_artwork",
  "selections": [
    {
      "alias": null,
      "args": null,
      "concreteType": "Image",
      "kind": "LinkedField",
      "name": "images",
      "plural": true,
      "selections": [
        {
          "args": null,
          "kind": "FragmentSpread",
          "name": "ImageCarousel_images"
        }
      ],
      "storageKey": null
    },
    {
      "args": null,
      "kind": "FragmentSpread",
      "name": "ArtworkActions_artwork"
    },
    {
      "args": null,
      "kind": "FragmentSpread",
      "name": "ArtworkTombstone_artwork"
    }
  ],
  "type": "Artwork",
  "abstractKey": null
};
(node as any).hash = 'ab997ece8f9a2923fa7f484708ba9d65';
export default node;
