/* tslint:disable */

import { ReaderFragment } from "relay-runtime";
declare const _RelatedArtist_artist$ref: unique symbol;
export type RelatedArtist_artist$ref = typeof _RelatedArtist_artist$ref;
export type RelatedArtist_artist = {
    readonly href: string | null;
    readonly name: string | null;
    readonly counts: {
        readonly forSaleArtworks: any | null;
        readonly artworks: any | null;
    } | null;
    readonly image: {
        readonly url: string | null;
    } | null;
    readonly " $refType": RelatedArtist_artist$ref;
};



const node: ReaderFragment = {
  "kind": "Fragment",
  "name": "RelatedArtist_artist",
  "type": "Artist",
  "metadata": null,
  "argumentDefinitions": [],
  "selections": [
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
      "name": "name",
      "args": null,
      "storageKey": null
    },
    {
      "kind": "LinkedField",
      "alias": null,
      "name": "counts",
      "storageKey": null,
      "args": null,
      "concreteType": "ArtistCounts",
      "plural": false,
      "selections": [
        {
          "kind": "ScalarField",
          "alias": null,
          "name": "forSaleArtworks",
          "args": null,
          "storageKey": null
        },
        {
          "kind": "ScalarField",
          "alias": null,
          "name": "artworks",
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
          "name": "url",
          "args": [
            {
              "kind": "Literal",
              "name": "version",
              "value": "large"
            }
          ],
          "storageKey": "url(version:\"large\")"
        }
      ]
    }
  ]
};
(node as any).hash = 'a01ba9e049116bbbbb2881a012289fa8';
export default node;
