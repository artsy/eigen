/* tslint:disable */

import { ReaderFragment } from "relay-runtime";
import { RelatedArtist_artist$ref } from "./RelatedArtist_artist.graphql";
declare const _RelatedArtists_artists$ref: unique symbol;
export type RelatedArtists_artists$ref = typeof _RelatedArtists_artists$ref;
export type RelatedArtists_artists = ReadonlyArray<{
    readonly __id: string;
    readonly " $fragmentRefs": RelatedArtist_artist$ref;
    readonly " $refType": RelatedArtists_artists$ref;
}>;



const node: ReaderFragment = {
  "kind": "Fragment",
  "name": "RelatedArtists_artists",
  "type": "Artist",
  "metadata": {
    "plural": true
  },
  "argumentDefinitions": [],
  "selections": [
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "__id",
      "args": null,
      "storageKey": null
    },
    {
      "kind": "FragmentSpread",
      "name": "RelatedArtist_artist",
      "args": null
    }
  ]
};
(node as any).hash = '8cdbd55b2f71bfb9d3007b47be09e3ce';
export default node;
