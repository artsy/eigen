/* tslint:disable */
/* eslint-disable */

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type MyCollectionArtworkArtistMarket_artwork = {
    readonly id: string;
    readonly " $refType": "MyCollectionArtworkArtistMarket_artwork";
};
export type MyCollectionArtworkArtistMarket_artwork$data = MyCollectionArtworkArtistMarket_artwork;
export type MyCollectionArtworkArtistMarket_artwork$key = {
    readonly " $data"?: MyCollectionArtworkArtistMarket_artwork$data;
    readonly " $fragmentRefs": FragmentRefs<"MyCollectionArtworkArtistMarket_artwork">;
};



const node: ReaderFragment = {
  "kind": "Fragment",
  "name": "MyCollectionArtworkArtistMarket_artwork",
  "type": "Artwork",
  "metadata": null,
  "argumentDefinitions": [],
  "selections": [
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "id",
      "args": null,
      "storageKey": null
    }
  ]
};
(node as any).hash = '516aa6e24c790074379d0f80bd00e2f6';
export default node;
