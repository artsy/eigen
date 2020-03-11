/* tslint:disable */

import { ReaderFragment } from "relay-runtime";
export type ArtworkActions_artwork = {
    readonly id: string;
    readonly internalID: string;
    readonly slug: string;
    readonly title: string | null;
    readonly href: string | null;
    readonly is_saved: boolean | null;
    readonly is_hangable: boolean | null;
    readonly artists: ReadonlyArray<{
        readonly name: string | null;
    } | null> | null;
    readonly image: {
        readonly url: string | null;
    } | null;
    readonly sale: {
        readonly isAuction: boolean | null;
        readonly isClosed: boolean | null;
    } | null;
    readonly widthCm: number | null;
    readonly heightCm: number | null;
    readonly " $refType": "ArtworkActions_artwork";
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
      "name": "internalID",
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
      "alias": "is_saved",
      "name": "isSaved",
      "args": null,
      "storageKey": null
    },
    {
      "kind": "ScalarField",
      "alias": "is_hangable",
      "name": "isHangable",
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
          "name": "url",
          "args": null,
          "storageKey": null
        }
      ]
    },
    {
      "kind": "LinkedField",
      "alias": null,
      "name": "sale",
      "storageKey": null,
      "args": null,
      "concreteType": "Sale",
      "plural": false,
      "selections": [
        {
          "kind": "ScalarField",
          "alias": null,
          "name": "isAuction",
          "args": null,
          "storageKey": null
        },
        {
          "kind": "ScalarField",
          "alias": null,
          "name": "isClosed",
          "args": null,
          "storageKey": null
        }
      ]
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
    }
  ]
};
(node as any).hash = '7a2fe8699b1d63776558e40651380e28';
export default node;
