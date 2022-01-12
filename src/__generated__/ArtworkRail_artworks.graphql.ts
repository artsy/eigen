/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type ArtworkRail_artworks = ReadonlyArray<{
    readonly href: string | null;
    readonly slug: string;
    readonly " $fragmentRefs": FragmentRefs<"ArtworkRailCard_artwork">;
    readonly " $refType": "ArtworkRail_artworks";
}>;
export type ArtworkRail_artworks$data = ArtworkRail_artworks;
export type ArtworkRail_artworks$key = ReadonlyArray<{
    readonly " $data"?: ArtworkRail_artworks$data | undefined;
    readonly " $fragmentRefs": FragmentRefs<"ArtworkRail_artworks">;
}>;



const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": {
    "plural": true
  },
  "name": "ArtworkRail_artworks",
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
(node as any).hash = 'f1d306d1c948131eb04ca292d31d43e7';
export default node;
