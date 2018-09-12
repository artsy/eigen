/* tslint:disable */

import { ConcreteFragment } from "relay-runtime";
export type RelatedArtists_artists = ReadonlyArray<{
        readonly __id: string;
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
