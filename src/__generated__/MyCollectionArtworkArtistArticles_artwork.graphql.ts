/* tslint:disable */
/* eslint-disable */

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type MyCollectionArtworkArtistArticles_artwork = {
    readonly id: string;
    readonly " $refType": "MyCollectionArtworkArtistArticles_artwork";
};
export type MyCollectionArtworkArtistArticles_artwork$data = MyCollectionArtworkArtistArticles_artwork;
export type MyCollectionArtworkArtistArticles_artwork$key = {
    readonly " $data"?: MyCollectionArtworkArtistArticles_artwork$data;
    readonly " $fragmentRefs": FragmentRefs<"MyCollectionArtworkArtistArticles_artwork">;
};



const node: ReaderFragment = {
  "kind": "Fragment",
  "name": "MyCollectionArtworkArtistArticles_artwork",
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
(node as any).hash = 'feff3c75b0ab2e548cd6c357f4d6a24b';
export default node;
