/* tslint:disable */

import { ReaderFragment } from "relay-runtime";
declare const _ArtworkExtraLinks_artwork$ref: unique symbol;
export type ArtworkExtraLinks_artwork$ref = typeof _ArtworkExtraLinks_artwork$ref;
export type ArtworkExtraLinks_artwork = {
    readonly slug: string;
    readonly isAcquireable: boolean | null;
    readonly isInquireable: boolean | null;
    readonly artists: ReadonlyArray<{
        readonly isConsignable: boolean | null;
        readonly name: string | null;
    } | null> | null;
    readonly " $refType": ArtworkExtraLinks_artwork$ref;
};



const node: ReaderFragment = {
  "kind": "Fragment",
  "name": "ArtworkExtraLinks_artwork",
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
      "name": "isAcquireable",
      "args": null,
      "storageKey": null
    },
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "isInquireable",
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
          "name": "isConsignable",
          "args": null,
          "storageKey": null
        },
        {
          "kind": "ScalarField",
          "alias": null,
          "name": "name",
          "args": null,
          "storageKey": null
        }
      ]
    }
  ]
};
(node as any).hash = '3b1a745be87c74bb60fca6e29dc6499f';
export default node;
