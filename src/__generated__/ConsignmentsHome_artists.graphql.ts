/* tslint:disable */
/* eslint-disable */

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type ConsignmentsHome_artists = ReadonlyArray<{
    readonly " $fragmentRefs": FragmentRefs<"ArtistList_artists">;
    readonly " $refType": "ConsignmentsHome_artists";
}>;
export type ConsignmentsHome_artists$data = ConsignmentsHome_artists;
export type ConsignmentsHome_artists$key = ReadonlyArray<{
    readonly " $data"?: ConsignmentsHome_artists$data;
    readonly " $fragmentRefs": FragmentRefs<"ConsignmentsHome_artists">;
}>;



const node: ReaderFragment = {
  "kind": "Fragment",
  "name": "ConsignmentsHome_artists",
  "type": "Artist",
  "metadata": {
    "plural": true
  },
  "argumentDefinitions": [],
  "selections": [
    {
      "kind": "FragmentSpread",
      "name": "ArtistList_artists",
      "args": null
    }
  ]
};
(node as any).hash = '9521776cbbe97f9c3656082c6a907669';
export default node;
