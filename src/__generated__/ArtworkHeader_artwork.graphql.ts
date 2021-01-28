/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type ArtworkHeader_artwork = {
    readonly images: ReadonlyArray<{
        readonly url: string | null;
        readonly imageVersions: ReadonlyArray<string | null> | null;
        readonly aspectRatio: number;
        readonly " $fragmentRefs": FragmentRefs<"ImageCarousel_images">;
    } | null> | null;
    readonly title: string | null;
    readonly href: string | null;
    readonly artists: ReadonlyArray<{
        readonly name: string | null;
    } | null> | null;
    readonly " $fragmentRefs": FragmentRefs<"ArtworkActions_artwork" | "ArtworkTombstone_artwork">;
    readonly " $refType": "ArtworkHeader_artwork";
};
export type ArtworkHeader_artwork$data = ArtworkHeader_artwork;
export type ArtworkHeader_artwork$key = {
    readonly " $data"?: ArtworkHeader_artwork$data;
    readonly " $fragmentRefs": FragmentRefs<"ArtworkHeader_artwork">;
};



const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "ArtworkHeader_artwork",
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
          "name": "imageVersions",
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
          "args": null,
          "kind": "FragmentSpread",
          "name": "ImageCarousel_images"
        }
      ],
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "title",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "href",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "concreteType": "Artist",
      "kind": "LinkedField",
      "name": "artists",
      "plural": true,
      "selections": [
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "name",
          "storageKey": null
        }
      ],
      "storageKey": null
    },
    {
      "args": null,
      "kind": "FragmentSpread",
      "name": "ArtworkActions_artwork"
    },
    {
      "args": null,
      "kind": "FragmentSpread",
      "name": "ArtworkTombstone_artwork"
    }
  ],
  "type": "Artwork",
  "abstractKey": null
};
(node as any).hash = '35bb791b5cf71f93f28f26c0e6db8daa';
export default node;
