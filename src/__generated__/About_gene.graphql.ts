/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type About_gene = {
    readonly trending_artists: ReadonlyArray<{
        readonly " $fragmentRefs": FragmentRefs<"RelatedArtists_artists">;
    } | null> | null;
    readonly " $fragmentRefs": FragmentRefs<"Biography_gene">;
    readonly " $refType": "About_gene";
};
export type About_gene$data = About_gene;
export type About_gene$key = {
    readonly " $data"?: About_gene$data;
    readonly " $fragmentRefs": FragmentRefs<"About_gene">;
};



const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "About_gene",
  "selections": [
    {
      "alias": "trending_artists",
      "args": null,
      "concreteType": "Artist",
      "kind": "LinkedField",
      "name": "trendingArtists",
      "plural": true,
      "selections": [
        {
          "args": null,
          "kind": "FragmentSpread",
          "name": "RelatedArtists_artists"
        }
      ],
      "storageKey": null
    },
    {
      "args": null,
      "kind": "FragmentSpread",
      "name": "Biography_gene"
    }
  ],
  "type": "Gene",
  "abstractKey": null
};
(node as any).hash = '09c3e04568ab6b702258dcaf97a58477';
export default node;
