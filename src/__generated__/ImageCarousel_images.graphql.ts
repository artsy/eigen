/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type ImageCarousel_images = ReadonlyArray<{
    readonly url: string | null;
    readonly width: number | null;
    readonly height: number | null;
    readonly imageVersions: ReadonlyArray<string | null> | null;
    readonly deepZoom: {
        readonly image: {
            readonly tileSize: number | null;
            readonly url: string | null;
            readonly format: string | null;
            readonly size: {
                readonly width: number | null;
                readonly height: number | null;
            } | null;
        } | null;
    } | null;
    readonly " $refType": "ImageCarousel_images";
}>;
export type ImageCarousel_images$data = ImageCarousel_images;
export type ImageCarousel_images$key = ReadonlyArray<{
    readonly " $data"?: ImageCarousel_images$data;
    readonly " $fragmentRefs": FragmentRefs<"ImageCarousel_images">;
}>;



const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": {
    "plural": true
  },
  "name": "ImageCarousel_images",
  "selections": [
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "url",
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
      "name": "imageVersions",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "concreteType": "DeepZoom",
      "kind": "LinkedField",
      "name": "deepZoom",
      "plural": false,
      "selections": [
        {
          "alias": "image",
          "args": null,
          "concreteType": "DeepZoomImage",
          "kind": "LinkedField",
          "name": "Image",
          "plural": false,
          "selections": [
            {
              "alias": "tileSize",
              "args": null,
              "kind": "ScalarField",
              "name": "TileSize",
              "storageKey": null
            },
            {
              "alias": "url",
              "args": null,
              "kind": "ScalarField",
              "name": "Url",
              "storageKey": null
            },
            {
              "alias": "format",
              "args": null,
              "kind": "ScalarField",
              "name": "Format",
              "storageKey": null
            },
            {
              "alias": "size",
              "args": null,
              "concreteType": "DeepZoomImageSize",
              "kind": "LinkedField",
              "name": "Size",
              "plural": false,
              "selections": [
                {
                  "alias": "width",
                  "args": null,
                  "kind": "ScalarField",
                  "name": "Width",
                  "storageKey": null
                },
                {
                  "alias": "height",
                  "args": null,
                  "kind": "ScalarField",
                  "name": "Height",
                  "storageKey": null
                }
              ],
              "storageKey": null
            }
          ],
          "storageKey": null
        }
      ],
      "storageKey": null
    }
  ],
  "type": "Image",
  "abstractKey": null
};
(node as any).hash = '53c81125eda10bbc56cb5efcc61c265e';
export default node;
