/* tslint:disable */
/* eslint-disable */

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type ViewingRoomArtwork_selectedArtwork = {
    readonly title: string | null;
    readonly artistNames: string | null;
    readonly date: string | null;
    readonly description: string | null;
    readonly saleMessage: string | null;
    readonly href: string | null;
    readonly slug: string;
    readonly image: {
        readonly url: string | null;
        readonly aspectRatio: number;
    } | null;
    readonly isHangable: boolean | null;
    readonly widthCm: number | null;
    readonly heightCm: number | null;
    readonly id: string;
    readonly images: ReadonlyArray<{
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
    } | null> | null;
    readonly " $refType": "ViewingRoomArtwork_selectedArtwork";
};
export type ViewingRoomArtwork_selectedArtwork$data = ViewingRoomArtwork_selectedArtwork;
export type ViewingRoomArtwork_selectedArtwork$key = {
    readonly " $data"?: ViewingRoomArtwork_selectedArtwork$data;
    readonly " $fragmentRefs": FragmentRefs<"ViewingRoomArtwork_selectedArtwork">;
};



const node: ReaderFragment = {
  "kind": "Fragment",
  "name": "ViewingRoomArtwork_selectedArtwork",
  "type": "Artwork",
  "metadata": null,
  "argumentDefinitions": [],
  "selections": [
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "title",
      "args": null,
      "storageKey": null
    },
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "artistNames",
      "args": null,
      "storageKey": null
    },
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "date",
      "args": null,
      "storageKey": null
    },
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "description",
      "args": null,
      "storageKey": null
    },
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "saleMessage",
      "args": null,
      "storageKey": null
    },
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "href",
      "args": null,
      "storageKey": null
    },
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "slug",
      "args": null,
      "storageKey": null
    },
    {
      "kind": "LinkedField",
      "alias": null,
      "name": "image",
      "storageKey": null,
      "args": null,
      "concreteType": "Image",
      "plural": false,
      "selections": [
        {
          "kind": "ScalarField",
          "alias": null,
          "name": "url",
          "args": [
            {
              "kind": "Literal",
              "name": "version",
              "value": "larger"
            }
          ],
          "storageKey": "url(version:\"larger\")"
        },
        {
          "kind": "ScalarField",
          "alias": null,
          "name": "aspectRatio",
          "args": null,
          "storageKey": null
        }
      ]
    },
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "isHangable",
      "args": null,
      "storageKey": null
    },
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "widthCm",
      "args": null,
      "storageKey": null
    },
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "heightCm",
      "args": null,
      "storageKey": null
    },
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "id",
      "args": null,
      "storageKey": null
    },
    {
      "kind": "LinkedField",
      "alias": null,
      "name": "images",
      "storageKey": null,
      "args": null,
      "concreteType": "Image",
      "plural": true,
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
          "kind": "ScalarField",
          "alias": null,
          "name": "imageVersions",
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
    }
  ]
};
(node as any).hash = 'f01a199d8874c7e17bd5e86aede433fb';
export default node;
