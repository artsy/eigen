/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type MyCollectionArtworkGrid_artworks = ReadonlyArray<{
    readonly id: string;
    readonly image: {
        readonly aspect_ratio: number;
    } | null;
    readonly " $fragmentRefs": FragmentRefs<"MyCollectionArtworkListItem_artwork">;
    readonly " $refType": "MyCollectionArtworkGrid_artworks";
}>;
export type MyCollectionArtworkGrid_artworks$data = MyCollectionArtworkGrid_artworks;
export type MyCollectionArtworkGrid_artworks$key = ReadonlyArray<{
    readonly " $data"?: MyCollectionArtworkGrid_artworks$data;
    readonly " $fragmentRefs": FragmentRefs<"MyCollectionArtworkGrid_artworks">;
}>;



const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": {
    "plural": true
  },
  "name": "MyCollectionArtworkGrid_artworks",
  "selections": [
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "id",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "concreteType": "Image",
      "kind": "LinkedField",
      "name": "image",
      "plural": false,
      "selections": [
        {
          "alias": "aspect_ratio",
          "args": null,
          "kind": "ScalarField",
          "name": "aspectRatio",
          "storageKey": null
        }
      ],
      "storageKey": null
    },
    {
      "args": null,
      "kind": "FragmentSpread",
      "name": "MyCollectionArtworkListItem_artwork"
    }
  ],
  "type": "Artwork",
  "abstractKey": null
};
(node as any).hash = '37cb5fe14bec8c2e2c9a88a06b57b51e';
export default node;
