/* tslint:disable */

import { ReaderFragment } from "relay-runtime";
declare const _ArtistCard_artist$ref: unique symbol;
export type ArtistCard_artist$ref = typeof _ArtistCard_artist$ref;
export type ArtistCard_artist = {
    readonly id: string;
    readonly slug: string;
    readonly internalID: string;
    readonly href: string | null;
    readonly name: string | null;
    readonly formattedArtworksCount: string | null;
    readonly formattedNationalityAndBirthday: string | null;
    readonly image: {
        readonly url: string | null;
    } | null;
    readonly " $refType": ArtistCard_artist$ref;
};



const node: ReaderFragment = {
  "kind": "Fragment",
  "name": "ArtistCard_artist",
  "type": "Artist",
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
      "kind": "ScalarField",
      "alias": null,
      "name": "formattedArtworksCount",
      "args": null,
      "storageKey": null
    },
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "formattedNationalityAndBirthday",
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
              "value": "large"
            }
          ],
          "storageKey": "url(version:\"large\")"
        }
      ]
    }
  ]
};
(node as any).hash = '326723821e3dd5f7f171d008638f672d';
export default node;
