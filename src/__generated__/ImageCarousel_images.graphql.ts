/* tslint:disable */

import { ReaderFragment } from "relay-runtime";
export type ImageCarousel_images = ReadonlyArray<{
    readonly url: string | null;
    readonly width: number | null;
    readonly height: number | null;
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
      "alias": "url",
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
    },
    {
      "kind": "LinkedField",
      "alias": null,
      "name": "deepZoom",
      "storageKey": null,
      "args": null,
      "concreteType": "DeepZoom",
      "plural": false,
      "selections": [
        {
          "kind": "LinkedField",
          "alias": "image",
          "name": "Image",
          "storageKey": null,
          "args": null,
          "concreteType": "DeepZoomImage",
          "plural": false,
          "selections": [
            {
              "kind": "ScalarField",
              "alias": "tileSize",
              "name": "TileSize",
              "args": null,
              "storageKey": null
            },
            {
              "kind": "ScalarField",
              "alias": "url",
              "name": "Url",
              "args": null,
              "storageKey": null
            },
            {
              "kind": "ScalarField",
              "alias": "format",
              "name": "Format",
              "args": null,
              "storageKey": null
            },
            {
              "kind": "LinkedField",
              "alias": "size",
              "name": "Size",
              "storageKey": null,
              "args": null,
              "concreteType": "DeepZoomImageSize",
              "plural": false,
              "selections": [
                {
                  "kind": "ScalarField",
                  "alias": "width",
                  "name": "Width",
                  "args": null,
                  "storageKey": null
                },
                {
                  "kind": "ScalarField",
                  "alias": "height",
                  "name": "Height",
                  "args": null,
                  "storageKey": null
                }
              ]
            }
          ]
        }
      ]
    }
  ]
};
(node as any).hash = '539c0a5412f83fe58b93630093817afd';
export default node;
