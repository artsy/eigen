/* tslint:disable */
/* eslint-disable */

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type ConsignmentsHome_artists = ReadonlyArray<{
    readonly " $fragmentRefs": FragmentRefs<"RecentlySold_artists" | "ArtistList_artists">;
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
      "name": "RecentlySold_artists",
      "args": null
    },
    {
      "kind": "FragmentSpread",
      "name": "ArtistList_artists",
      "args": null
    }
  ]
};
(node as any).hash = 'ab7ae2845fce710f92d1c33c388602e1';
export default node;
