/* tslint:disable */

import { ReaderFragment } from "relay-runtime";
declare const _ArtworkActions_artwork$ref: unique symbol;
export type ArtworkActions_artwork$ref = typeof _ArtworkActions_artwork$ref;
export type ArtworkActions_artwork = {
    readonly id: string;
    readonly gravityID: string;
    readonly title: string | null;
    readonly href: string | null;
    readonly is_saved: boolean | null;
    readonly artists: ReadonlyArray<{
        readonly name: string | null;
    } | null> | null;
    readonly image: {
        readonly height: number | null;
        readonly width: number | null;
        readonly url: string | null;
    } | null;
    readonly " $refType": ArtworkActions_artwork$ref;
};



const node: ReaderFragment = {
  "kind": "Fragment",
  "name": "ArtworkActions_artwork",
  "type": "Artwork",
  "metadata": null,
  "argumentDefinitions": [],
  "selections": [
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "id",
      "args": null,
      "storageKey": null
    },
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "gravityID",
      "args": null,
      "storageKey": null
    },
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
      "name": "href",
      "args": null,
      "storageKey": null
    },
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "is_saved",
      "args": null,
      "storageKey": null
    },
    {
      "kind": "LinkedField",
      "alias": null,
      "name": "artists",
      "storageKey": null,
      "args": null,
      "concreteType": "Artist",
      "plural": true,
      "selections": [
        {
          "kind": "ScalarField",
          "alias": null,
          "name": "name",
          "args": null,
          "storageKey": null
        }
      ]
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
          "name": "height",
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
          "name": "url",
          "args": null,
          "storageKey": null
        }
      ]
    }
  ]
};
(node as any).hash = 'db9c9ce8848d1b7bb4ed8341748684c7';
export default node;
