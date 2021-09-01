/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type NewImagesCarousel_images = ReadonlyArray<{
    readonly url: string | null;
    readonly width: number | null;
    readonly height: number | null;
    readonly aspectRatio: number;
    readonly imageVersions: ReadonlyArray<string | null> | null;
    readonly " $refType": "NewImagesCarousel_images";
}>;
export type NewImagesCarousel_images$data = NewImagesCarousel_images;
export type NewImagesCarousel_images$key = ReadonlyArray<{
    readonly " $data"?: NewImagesCarousel_images$data;
    readonly " $fragmentRefs": FragmentRefs<"NewImagesCarousel_images">;
}>;



const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": {
    "plural": true
  },
  "name": "NewImagesCarousel_images",
  "selections": [
    {
      "alias": "url",
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
    },
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
      "name": "aspectRatio",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "imageVersions",
      "storageKey": null
    }
  ],
  "type": "Image",
  "abstractKey": null
};
(node as any).hash = 'c036a7af57de63c699bba3c78bb7cfff';
export default node;
