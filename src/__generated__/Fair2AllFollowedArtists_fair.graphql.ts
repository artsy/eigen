/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type Fair2AllFollowedArtists_fair = {
    readonly " $fragmentRefs": FragmentRefs<"Fair2Artworks_fair">;
    readonly " $refType": "Fair2AllFollowedArtists_fair";
};
export type Fair2AllFollowedArtists_fair$data = Fair2AllFollowedArtists_fair;
export type Fair2AllFollowedArtists_fair$key = {
    readonly " $data"?: Fair2AllFollowedArtists_fair$data;
    readonly " $fragmentRefs": FragmentRefs<"Fair2AllFollowedArtists_fair">;
};



const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "Fair2AllFollowedArtists_fair",
  "selections": [
    {
      "args": [
        {
          "kind": "Literal",
          "name": "includeArtworksByFollowedArtists",
          "value": true
        }
      ],
      "kind": "FragmentSpread",
      "name": "Fair2Artworks_fair"
    }
  ],
  "type": "Fair",
  "abstractKey": null
};
(node as any).hash = '9af8ab417aed01f41fb6c04912e66c88';
export default node;
