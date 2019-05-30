/* tslint:disable */

import { ReaderFragment } from "relay-runtime";
declare const _Artwork_artwork$ref: unique symbol;
export type Artwork_artwork$ref = typeof _Artwork_artwork$ref;
export type Artwork_artwork = {
    readonly " $fragmentRefs": ArtworkTombstone_artwork$ref & ArtworkActions_artwork$ref & ArtworkAvailability_artwork$ref & SellerInfo_artwork$ref;
    readonly " $refType": Artwork_artwork$ref;
};



const node: ReaderFragment = {
  "kind": "Fragment",
  "name": "Artwork_artwork",
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
    }
  ]
};
(node as any).hash = '1021f50bee1850a3eccc9efbb82548c2';
export default node;
