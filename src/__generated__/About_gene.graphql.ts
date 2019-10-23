/* tslint:disable */

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type About_gene = {
    readonly trending_artists: ReadonlyArray<{
        readonly " $fragmentRefs": FragmentRefs<"RelatedArtists_artists">;
    } | null> | null;
    readonly " $fragmentRefs": FragmentRefs<"Biography_gene">;
    readonly " $refType": "About_gene";
};



const node: ReaderFragment = {
  "kind": "Fragment",
  "name": "About_gene",
  "type": "Gene",
  "metadata": null,
  "argumentDefinitions": [],
  "selections": [
    {
      "kind": "LinkedField",
      "alias": "trending_artists",
      "name": "trendingArtists",
      "storageKey": null,
      "args": null,
      "concreteType": "Artist",
      "plural": true,
      "selections": [
        {
          "kind": "FragmentSpread",
          "name": "RelatedArtists_artists",
          "args": null
        }
      ]
    },
    {
      "kind": "FragmentSpread",
      "name": "Biography_gene",
      "args": null
    }
  ]
};
(node as any).hash = '09c3e04568ab6b702258dcaf97a58477';
export default node;
