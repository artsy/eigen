/* tslint:disable */

import { ConcreteFragment } from "relay-runtime";
declare const _ArtworkTombstone_artwork$ref: unique symbol;
export type ArtworkTombstone_artwork$ref = typeof _ArtworkTombstone_artwork$ref;
export type ArtworkTombstone_artwork = {
    readonly title: string | null;
    readonly " $refType": ArtworkTombstone_artwork$ref;
};



const node: ConcreteFragment = {
  "kind": "Fragment",
  "name": "ArtworkTombstone_artwork",
  "type": "Artwork",
  "metadata": null,
  "argumentDefinitions": [],
  "selections": [
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
      "name": "__id",
      "args": null,
      "storageKey": null
    }
  ]
};
(node as any).hash = 'c113287a76a1e89f740cc6e5fd22b4ed';
export default node;
