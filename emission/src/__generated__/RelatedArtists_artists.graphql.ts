/* tslint:disable */

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type RelatedArtists_artists = ReadonlyArray<{
    readonly id: string;
    readonly " $fragmentRefs": FragmentRefs<"RelatedArtist_artist">;
    readonly " $refType": "RelatedArtists_artists";
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
      "name": "id",
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
(node as any).hash = '8aa209a584d7ea23ce840f434aa5dd51';
export default node;
