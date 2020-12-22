/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type MyCollectionArtworkImages_artwork = {
    readonly images: ReadonlyArray<{
        readonly height: number | null;
        readonly isDefault: boolean | null;
        readonly imageURL: string | null;
        readonly width: number | null;
    } | null> | null;
    readonly " $refType": "MyCollectionArtworkImages_artwork";
};
export type MyCollectionArtworkImages_artwork$data = MyCollectionArtworkImages_artwork;
export type MyCollectionArtworkImages_artwork$key = {
    readonly " $data"?: MyCollectionArtworkImages_artwork$data;
    readonly " $fragmentRefs": FragmentRefs<"MyCollectionArtworkImages_artwork">;
};



const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "MyCollectionArtworkImages_artwork",
  "selections": [
    {
      "alias": null,
      "args": null,
      "concreteType": "Image",
      "kind": "LinkedField",
      "name": "images",
      "plural": true,
      "selections": [
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "height",
          "storageKey": null
        },
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "isDefault",
          "storageKey": null
        },
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "imageURL",
          "storageKey": null
        },
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "width",
          "storageKey": null
        }
      ],
      "storageKey": null
    }
  ],
  "type": "Artwork",
  "abstractKey": null
};
(node as any).hash = '7b416a19f52c8e14e0b0b2e05cba5b31';
export default node;
