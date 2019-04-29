/* tslint:disable */

import { ConcreteFragment } from "relay-runtime";
import { RelatedArtist_artist$ref } from "./RelatedArtist_artist.graphql";
declare const _RelatedArtists_artists$ref: unique symbol;
export type RelatedArtists_artists$ref = typeof _RelatedArtists_artists$ref;
export type RelatedArtists_artists = ReadonlyArray<{
    readonly id: string;
    readonly " $fragmentRefs": RelatedArtist_artist$ref;
    readonly " $refType": RelatedArtists_artists$ref;
}>;



const node: ConcreteFragment = {
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
      "name": "id",
      "args": null,
      "storageKey": null
    },
    {
      "kind": "FragmentSpread",
      "name": "RelatedArtist_artist",
      "args": null
    },
    {
      "kind": "ScalarField",
      "alias": "__id",
      "name": "id",
      "args": null,
      "storageKey": null
    }
  ]
};
(node as any).hash = '8aa209a584d7ea23ce840f434aa5dd51';
export default node;
