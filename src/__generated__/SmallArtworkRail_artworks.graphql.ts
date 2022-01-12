/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type SmallArtworkRail_artworks = ReadonlyArray<{
    readonly href: string | null;
    readonly slug: string;
    readonly " $fragmentRefs": FragmentRefs<"ArtworkRailCard_artwork">;
    readonly " $refType": "SmallArtworkRail_artworks";
}>;
export type SmallArtworkRail_artworks$data = SmallArtworkRail_artworks;
export type SmallArtworkRail_artworks$key = ReadonlyArray<{
    readonly " $data"?: SmallArtworkRail_artworks$data | undefined;
    readonly " $fragmentRefs": FragmentRefs<"SmallArtworkRail_artworks">;
}>;



const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": {
    "plural": true
  },
  "name": "SmallArtworkRail_artworks",
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
      "args": [
        {
          "kind": "Literal",
          "name": "width",
          "value": 155
        }
      ],
      "kind": "FragmentSpread",
      "name": "ArtworkRailCard_artwork"
    }
  ],
  "type": "Artwork",
  "abstractKey": null
};
(node as any).hash = '2239f3aab8efae99c5a7423cab3efa9f';
export default node;
