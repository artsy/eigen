/* tslint:disable */

import { ReaderFragment } from "relay-runtime";
declare const _MakeOfferButton_artwork$ref: unique symbol;
export type MakeOfferButton_artwork$ref = typeof _MakeOfferButton_artwork$ref;
export type MakeOfferButton_artwork = {
    readonly internalID: string;
    readonly " $refType": MakeOfferButton_artwork$ref;
};



const node: ReaderFragment = {
  "kind": "Fragment",
  "name": "MakeOfferButton_artwork",
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
(node as any).hash = 'c704ec89c83e93427db1eca75f364aef';
export default node;
