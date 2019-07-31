/* tslint:disable */

import { ReaderFragment } from "relay-runtime";
declare const _ImageCarousel_images$ref: unique symbol;
export type ImageCarousel_images$ref = typeof _ImageCarousel_images$ref;
export type ImageCarousel_images = ReadonlyArray<{
    readonly image_url: string | null;
    readonly width: number | null;
    readonly height: number | null;
    readonly " $refType": ImageCarousel_images$ref;
}>;



const node: ReaderFragment = {
  "kind": "Fragment",
  "name": "ImageCarousel_images",
  "type": "Image",
  "metadata": {
    "plural": true
  },
  "argumentDefinitions": [],
  "selections": [
    {
      "kind": "ScalarField",
      "alias": "image_url",
      "name": "imageURL",
      "args": null,
      "storageKey": null
    },
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "width",
      "args": null,
      "storageKey": null
    },
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "height",
      "args": null,
      "storageKey": null
    }
  ]
};
(node as any).hash = '7c07ddbe8c6d680f73cb4d3ace40e892';
export default node;
