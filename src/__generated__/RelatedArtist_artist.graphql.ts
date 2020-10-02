/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type RelatedArtist_artist = {
    readonly href: string | null;
    readonly name: string | null;
    readonly counts: {
        readonly forSaleArtworks: number | null;
        readonly artworks: number | null;
    } | null;
    readonly image: {
        readonly url: string | null;
    } | null;
    readonly " $refType": "RelatedArtist_artist";
};
export type RelatedArtist_artist$data = RelatedArtist_artist;
export type RelatedArtist_artist$key = {
    readonly " $data"?: RelatedArtist_artist$data;
    readonly " $fragmentRefs": FragmentRefs<"RelatedArtist_artist">;
};



const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "RelatedArtist_artist",
  "selections": [
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
      "kind": "ScalarField",
      "name": "name",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "concreteType": "ArtistCounts",
      "kind": "LinkedField",
      "name": "counts",
      "plural": false,
      "selections": [
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "forSaleArtworks",
          "storageKey": null
        },
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "artworks",
          "storageKey": null
        }
      ],
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "concreteType": "Image",
      "kind": "LinkedField",
      "name": "image",
      "plural": false,
      "selections": [
        {
          "alias": null,
          "args": [
            {
              "kind": "Literal",
              "name": "version",
              "value": "large"
            }
          ],
          "kind": "ScalarField",
          "name": "url",
          "storageKey": "url(version:\"large\")"
        }
      ],
      "storageKey": null
    }
  ],
  "type": "Artist",
  "abstractKey": null
};
(node as any).hash = 'a01ba9e049116bbbbb2881a012289fa8';
export default node;
