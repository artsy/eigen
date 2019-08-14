/* tslint:disable */

import { ReaderFragment } from "relay-runtime";
declare const _BuyNowButton_artwork$ref: unique symbol;
export type BuyNowButton_artwork$ref = typeof _BuyNowButton_artwork$ref;
export type BuyNowButton_artwork = {
    readonly internalID: string;
    readonly " $refType": BuyNowButton_artwork$ref;
};



const node: ReaderFragment = {
  "kind": "Fragment",
  "name": "BuyNowButton_artwork",
  "type": "Artwork",
  "metadata": null,
  "argumentDefinitions": [],
  "selections": [
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "internalID",
      "args": null,
      "storageKey": null
    }
  ]
};
(node as any).hash = '2d1aae8ac7e7708f034b67990313c28a';
export default node;
