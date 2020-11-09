/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type MyCollectionArtworkFullDetails_artwork = {
    readonly " $fragmentRefs": FragmentRefs<"MyCollectionArtworkMeta2_artwork">;
    readonly " $refType": "MyCollectionArtworkFullDetails_artwork";
};
export type MyCollectionArtworkFullDetails_artwork$data = MyCollectionArtworkFullDetails_artwork;
export type MyCollectionArtworkFullDetails_artwork$key = {
    readonly " $data"?: MyCollectionArtworkFullDetails_artwork$data;
    readonly " $fragmentRefs": FragmentRefs<"MyCollectionArtworkFullDetails_artwork">;
};



const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "MyCollectionArtworkFullDetails_artwork",
  "selections": [
    {
      "args": null,
      "kind": "FragmentSpread",
      "name": "MyCollectionArtworkMeta2_artwork"
    }
  ],
  "type": "Artwork",
  "abstractKey": null
};
(node as any).hash = '7096d2f2bb077dc05ba8503a989d25a6';
export default node;
