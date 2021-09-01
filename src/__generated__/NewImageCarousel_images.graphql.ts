/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type NewImageCarousel_images = ReadonlyArray<{
    readonly url: string | null;
    readonly width: number | null;
    readonly height: number | null;
    readonly aspectRatio: number;
    readonly imageVersions: ReadonlyArray<string | null> | null;
    readonly " $refType": "NewImageCarousel_images";
}>;
export type NewImageCarousel_images$data = NewImageCarousel_images;
export type NewImageCarousel_images$key = ReadonlyArray<{
    readonly " $data"?: NewImageCarousel_images$data;
    readonly " $fragmentRefs": FragmentRefs<"NewImageCarousel_images">;
}>;



const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": {
    "plural": true
  },
  "name": "NewImageCarousel_images",
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
(node as any).hash = '2981fb9045e5d69b5bcdb01fd49d4b06';
export default node;
