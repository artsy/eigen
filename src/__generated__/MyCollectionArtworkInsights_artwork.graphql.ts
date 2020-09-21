/* tslint:disable */
/* eslint-disable */

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type MyCollectionArtworkInsights_artwork = {
    readonly " $fragmentRefs": FragmentRefs<"MyCollectionArtworkArtistAuctionResults_artwork" | "MyCollectionArtworkArtistArticles_artwork">;
    readonly " $refType": "MyCollectionArtworkInsights_artwork";
};
export type MyCollectionArtworkInsights_artwork$data = MyCollectionArtworkInsights_artwork;
export type MyCollectionArtworkInsights_artwork$key = {
    readonly " $data"?: MyCollectionArtworkInsights_artwork$data;
    readonly " $fragmentRefs": FragmentRefs<"MyCollectionArtworkInsights_artwork">;
};



const node: ReaderFragment = {
  "kind": "Fragment",
  "name": "MyCollectionArtworkInsights_artwork",
  "type": "Artwork",
  "metadata": null,
  "argumentDefinitions": [],
  "selections": [
    {
      "kind": "FragmentSpread",
      "name": "MyCollectionArtworkArtistAuctionResults_artwork",
      "args": null
    },
    {
      "kind": "FragmentSpread",
      "name": "MyCollectionArtworkArtistArticles_artwork",
      "args": null
    }
  ]
};
(node as any).hash = 'b420c2a7e2c6ecb93d6dab11a42df82a';
export default node;
