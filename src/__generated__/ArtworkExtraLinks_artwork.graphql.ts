/* tslint:disable */

import { ReaderFragment } from "relay-runtime";
declare const _ArtworkExtraLinks_artwork$ref: unique symbol;
export type ArtworkExtraLinks_artwork$ref = typeof _ArtworkExtraLinks_artwork$ref;
export type ArtworkExtraLinks_artwork = {
    readonly slug: string;
    readonly isAcquireable: boolean | null;
    readonly isInAuction: boolean | null;
    readonly sale: {
        readonly isClosed: boolean | null;
    } | null;
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
      "name": "isInAuction",
      "args": null,
      "storageKey": null
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
          "name": "isClosed",
          "args": null,
          "storageKey": null
        }
      ]
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
(node as any).hash = '605d1c8892ef73672eddbc298af1b6e8';
export default node;
