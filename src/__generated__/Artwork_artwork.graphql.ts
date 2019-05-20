/* tslint:disable */

import { ConcreteFragment } from "relay-runtime";
import { ArtworkActions_artwork$ref } from "./ArtworkActions_artwork.graphql";
import { ArtworkAvailability_artwork$ref } from "./ArtworkAvailability_artwork.graphql";
declare const _Artwork_artwork$ref: unique symbol;
export type Artwork_artwork$ref = typeof _Artwork_artwork$ref;
export type Artwork_artwork = {
    readonly " $fragmentRefs": ArtworkActions_artwork$ref & ArtworkAvailability_artwork$ref;
    readonly " $refType": Artwork_artwork$ref;
};



const node: ConcreteFragment = {
  "kind": "Fragment",
  "name": "Artwork_artwork",
  "type": "Artwork",
  "metadata": null,
  "argumentDefinitions": [],
  "selections": [
    {
      "kind": "FragmentSpread",
      "name": "ArtworkActions_artwork",
      "args": null
    },
    {
      "kind": "FragmentSpread",
      "name": "ArtworkAvailability_artwork",
      "args": null
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
(node as any).hash = '1956bbb38aaf7cfafd6059f82057343f';
export default node;
