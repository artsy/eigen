/* tslint:disable */

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type ArtworkHeader_artwork = {
    readonly images: ReadonlyArray<{
        readonly " $fragmentRefs": FragmentRefs<"ImageCarousel_images">;
    } | null> | null;
    readonly " $fragmentRefs": FragmentRefs<"ArtworkActions_artwork" | "ArtworkTombstone_artwork">;
    readonly " $refType": "ArtworkHeader_artwork";
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
