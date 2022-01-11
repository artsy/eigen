/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type SmallTileRail_artworks = ReadonlyArray<{
    readonly href: string | null;
    readonly slug: string;
    readonly " $fragmentRefs": FragmentRefs<"ArtworkTileRailCard2_artwork">;
    readonly " $refType": "SmallTileRail_artworks";
}>;
export type SmallTileRail_artworks$data = SmallTileRail_artworks;
export type SmallTileRail_artworks$key = ReadonlyArray<{
    readonly " $data"?: SmallTileRail_artworks$data | undefined;
    readonly " $fragmentRefs": FragmentRefs<"SmallTileRail_artworks">;
}>;



const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": {
    "plural": true
  },
  "name": "SmallTileRail_artworks",
  "selections": [
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "href",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "slug",
      "storageKey": null
    },
    {
      "args": null,
      "kind": "FragmentSpread",
      "name": "ArtworkTileRailCard2_artwork"
    }
  ],
  "type": "Artwork",
  "abstractKey": null
};
(node as any).hash = 'e3aed218128f1383b1e121e5e5e01c2d';
export default node;
