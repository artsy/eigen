/* tslint:disable */

import { ReaderFragment } from "relay-runtime";
declare const _ArtworkActions_artwork$ref: unique symbol;
export type ArtworkActions_artwork$ref = typeof _ArtworkActions_artwork$ref;
export type ArtworkActions_artwork = {
    readonly id: string;
    readonly internalID: string;
    readonly is_saved: boolean | null;
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
      "name": "internalID",
      "args": null,
      "storageKey": null
    },
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "is_saved",
      "args": null,
      "storageKey": null
    }
  ]
};
(node as any).hash = '1c43021931dda5d1a7ec1ff84703c9b7';
export default node;
