/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type MyCollectionArtworkArtistMarket_artwork = {
    readonly internalID: string;
    readonly slug: string;
    readonly " $refType": "MyCollectionArtworkArtistMarket_artwork";
};
export type MyCollectionArtworkArtistMarket_artwork$data = MyCollectionArtworkArtistMarket_artwork;
export type MyCollectionArtworkArtistMarket_artwork$key = {
    readonly " $data"?: MyCollectionArtworkArtistMarket_artwork$data;
    readonly " $fragmentRefs": FragmentRefs<"MyCollectionArtworkArtistMarket_artwork">;
};



const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "MyCollectionArtworkArtistMarket_artwork",
  "selections": [
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "internalID",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "slug",
      "storageKey": null
    }
  ],
  "type": "Artwork",
  "abstractKey": null
};
(node as any).hash = '9d568c0906219d2848cde66f93177267';
export default node;
