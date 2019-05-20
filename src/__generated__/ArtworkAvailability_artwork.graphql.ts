/* tslint:disable */

import { ConcreteFragment } from "relay-runtime";
declare const _ArtworkAvailability_artwork$ref: unique symbol;
export type ArtworkAvailability_artwork$ref = typeof _ArtworkAvailability_artwork$ref;
export type ArtworkAvailability_artwork = {
    readonly availability: string | null;
    readonly " $refType": ArtworkAvailability_artwork$ref;
};



const node: ConcreteFragment = {
  "kind": "Fragment",
  "name": "ArtworkAvailability_artwork",
  "type": "Artwork",
  "metadata": null,
  "argumentDefinitions": [],
  "selections": [
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "availability",
      "args": null,
      "storageKey": null
    },
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "__id",
      "args": null,
      "storageKey": null
    }
  ]
};
(node as any).hash = 'e89cb580e25a8704c5c6d682a2d5e281';
export default node;
