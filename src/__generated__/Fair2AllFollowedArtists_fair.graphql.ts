/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type Fair2AllFollowedArtists_fair = {
    readonly name: string | null;
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
      "name": "name",
      "storageKey": null
    }
  ],
  "type": "Fair",
  "abstractKey": null
};
(node as any).hash = '31bd26026acd830b1ed26d56e932d122';
export default node;
