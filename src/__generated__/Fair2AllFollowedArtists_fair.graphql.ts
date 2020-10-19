/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type Fair2AllFollowedArtists_fair = {
    readonly internalID: string;
    readonly slug: string;
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
    },
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
(node as any).hash = 'c159d442fa2d3d182bf80f0e3e4ea207';
export default node;
