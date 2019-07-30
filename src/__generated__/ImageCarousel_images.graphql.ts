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
      "alias": null,
      "name": "image_url",
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
(node as any).hash = '97b0268fe452f433cd9fcc517148d095';
export default node;
