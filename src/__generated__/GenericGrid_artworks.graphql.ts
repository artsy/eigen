/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type GenericGrid_artworks = ReadonlyArray<{
    readonly id: string;
    readonly image: {
        readonly aspectRatio: number;
    } | null;
    readonly " $fragmentRefs": FragmentRefs<"ArtworkGridItem_artwork">;
    readonly " $refType": "GenericGrid_artworks";
}>;
export type GenericGrid_artworks$data = GenericGrid_artworks;
export type GenericGrid_artworks$key = ReadonlyArray<{
    readonly " $data"?: GenericGrid_artworks$data | undefined;
    readonly " $fragmentRefs": FragmentRefs<"GenericGrid_artworks">;
}>;



const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": {
    "plural": true
  },
  "name": "GenericGrid_artworks",
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
          "alias": null,
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
      "name": "ArtworkGridItem_artwork"
    }
  ],
  "type": "Artwork",
  "abstractKey": null
};
(node as any).hash = 'f4c525ef8702ab1e7695f254ec2b8c91';
export default node;
