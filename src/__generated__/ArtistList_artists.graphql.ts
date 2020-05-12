/* tslint:disable */
/* eslint-disable */

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type ArtistList_artists = ReadonlyArray<{
    readonly name: string | null;
    readonly href: string | null;
    readonly image: {
        readonly cropped: {
            readonly url: string | null;
            readonly width: number | null;
            readonly height: number | null;
        } | null;
    } | null;
    readonly " $refType": "ArtistList_artists";
}>;
export type ArtistList_artists$data = ArtistList_artists;
export type ArtistList_artists$key = ReadonlyArray<{
    readonly " $data"?: ArtistList_artists$data;
    readonly " $fragmentRefs": FragmentRefs<"ArtistList_artists">;
}>;



const node: ReaderFragment = {
  "kind": "Fragment",
  "name": "ArtistList_artists",
  "type": "Artist",
  "metadata": {
    "plural": true
  },
  "argumentDefinitions": [],
  "selections": [
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "name",
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
      "kind": "LinkedField",
      "alias": null,
      "name": "image",
      "storageKey": null,
      "args": null,
      "concreteType": "Image",
      "plural": false,
      "selections": [
        {
          "kind": "LinkedField",
          "alias": null,
          "name": "cropped",
          "storageKey": "cropped(height:70,width:76)",
          "args": [
            {
              "kind": "Literal",
              "name": "height",
              "value": 70
            },
            {
              "kind": "Literal",
              "name": "width",
              "value": 76
            }
          ],
          "concreteType": "CroppedImageUrl",
          "plural": false,
          "selections": [
            {
              "kind": "ScalarField",
              "alias": null,
              "name": "url",
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
        }
      ]
    }
  ]
};
(node as any).hash = '662bd532515a13684fde2bc45fab3e9a';
export default node;
