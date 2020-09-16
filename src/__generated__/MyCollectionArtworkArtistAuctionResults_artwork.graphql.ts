/* tslint:disable */
/* eslint-disable */

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type MyCollectionArtworkArtistAuctionResults_artwork = {
    readonly id: string;
    readonly " $refType": "MyCollectionArtworkArtistAuctionResults_artwork";
};
export type MyCollectionArtworkArtistAuctionResults_artwork$data = MyCollectionArtworkArtistAuctionResults_artwork;
export type MyCollectionArtworkArtistAuctionResults_artwork$key = {
    readonly " $data"?: MyCollectionArtworkArtistAuctionResults_artwork$data;
    readonly " $fragmentRefs": FragmentRefs<"MyCollectionArtworkArtistAuctionResults_artwork">;
};



const node: ReaderFragment = {
  "kind": "Fragment",
  "name": "MyCollectionArtworkArtistAuctionResults_artwork",
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
(node as any).hash = '550ff09ea0288497a87c4c7e4fa2e26d';
export default node;
