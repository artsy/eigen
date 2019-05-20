/* tslint:disable */

import { ConcreteFragment } from "relay-runtime";
declare const _ArtworkActions_artwork$ref: unique symbol;
export type ArtworkActions_artwork$ref = typeof _ArtworkActions_artwork$ref;
export type ArtworkActions_artwork = {
    readonly __id: string;
    readonly _id: string;
    readonly is_saved: boolean | null;
    readonly " $refType": ArtworkActions_artwork$ref;
};



const node: ConcreteFragment = {
  "kind": "Fragment",
  "name": "ArtworkActions_artwork",
  "type": "Artwork",
  "metadata": null,
  "argumentDefinitions": [],
  "selections": [
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "__id",
      "args": null,
      "storageKey": null
    },
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "_id",
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
(node as any).hash = 'b19ec88fc4985f5215108019b727bd02';
export default node;
