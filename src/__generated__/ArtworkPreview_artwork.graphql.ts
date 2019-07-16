/* tslint:disable */

import { ReaderFragment } from "relay-runtime";
declare const _ArtworkPreview_artwork$ref: unique symbol;
export type ArtworkPreview_artwork$ref = typeof _ArtworkPreview_artwork$ref;
export type ArtworkPreview_artwork = {
    readonly slug: string;
    readonly internalID: string;
    readonly title: string | null;
    readonly artist_names: string | null;
    readonly date: string | null;
    readonly image: {
        readonly url: string | null;
    } | null;
    readonly " $refType": ArtworkPreview_artwork$ref;
};



const node: ReaderFragment = {
  "kind": "Fragment",
  "name": "ArtworkPreview_artwork",
  "type": "Artwork",
  "metadata": null,
  "argumentDefinitions": [],
  "selections": [
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "slug",
      "args": null,
      "storageKey": null
    },
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "internalID",
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
      "name": "artist_names",
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
          "args": null,
          "storageKey": null
        }
      ]
    }
  ]
};
(node as any).hash = '6169160f6c19d379f500731f63adc613';
export default node;
