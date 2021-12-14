/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type Home_showsByFollowedArtists = {
    readonly " $fragmentRefs": FragmentRefs<"ShowsRail_showsConnection">;
    readonly " $refType": "Home_showsByFollowedArtists";
};
export type Home_showsByFollowedArtists$data = Home_showsByFollowedArtists;
export type Home_showsByFollowedArtists$key = {
    readonly " $data"?: Home_showsByFollowedArtists$data | undefined;
    readonly " $fragmentRefs": FragmentRefs<"Home_showsByFollowedArtists">;
};



const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "Home_showsByFollowedArtists",
  "selections": [
    {
      "args": null,
      "kind": "FragmentSpread",
      "name": "ShowsRail_showsConnection"
    }
  ],
  "type": "ShowConnection",
  "abstractKey": null
};
(node as any).hash = 'e901d84ccabc3cf865cdb6195e73bb12';
export default node;
