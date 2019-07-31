/* tslint:disable */

import { ReaderFragment } from "relay-runtime";
import { Biography_gene$ref } from "./Biography_gene.graphql";
import { RelatedArtists_artists$ref } from "./RelatedArtists_artists.graphql";
declare const _About_gene$ref: unique symbol;
export type About_gene$ref = typeof _About_gene$ref;
export type About_gene = {
    readonly trending_artists: ReadonlyArray<{
        readonly " $fragmentRefs": RelatedArtists_artists$ref;
    } | null> | null;
    readonly " $fragmentRefs": Biography_gene$ref;
    readonly " $refType": About_gene$ref;
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
