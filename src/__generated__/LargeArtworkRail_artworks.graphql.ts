/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type LargeArtworkRail_artworks = ReadonlyArray<{
    readonly href: string | null;
    readonly slug: string;
    readonly " $fragmentRefs": FragmentRefs<"ArtworkRailCard_artwork">;
    readonly " $refType": "LargeArtworkRail_artworks";
}>;
export type LargeArtworkRail_artworks$data = LargeArtworkRail_artworks;
export type LargeArtworkRail_artworks$key = ReadonlyArray<{
    readonly " $data"?: LargeArtworkRail_artworks$data | undefined;
    readonly " $fragmentRefs": FragmentRefs<"LargeArtworkRail_artworks">;
}>;



const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": {
    "plural": true
  },
  "name": "LargeArtworkRail_artworks",
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
          "value": 295
        }
      ],
      "kind": "FragmentSpread",
      "name": "ArtworkRailCard_artwork"
    }
  ],
  "type": "Artwork",
  "abstractKey": null
};
(node as any).hash = 'f527391e2498649ed49923ca22784770';
export default node;
