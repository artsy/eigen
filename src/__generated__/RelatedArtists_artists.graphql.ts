/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type RelatedArtists_artists = ReadonlyArray<{
    readonly id: string;
    readonly " $fragmentRefs": FragmentRefs<"RelatedArtist_artist">;
    readonly " $refType": "RelatedArtists_artists";
}>;
export type RelatedArtists_artists$data = RelatedArtists_artists;
export type RelatedArtists_artists$key = ReadonlyArray<{
    readonly " $data"?: RelatedArtists_artists$data;
    readonly " $fragmentRefs": FragmentRefs<"RelatedArtists_artists">;
}>;



const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": {
    "plural": true
  },
  "name": "RelatedArtists_artists",
  "selections": [
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "id",
      "storageKey": null
    },
    {
      "args": null,
      "kind": "FragmentSpread",
      "name": "RelatedArtist_artist"
    }
  ],
  "type": "Artist",
  "abstractKey": null
};
(node as any).hash = '8aa209a584d7ea23ce840f434aa5dd51';
export default node;
