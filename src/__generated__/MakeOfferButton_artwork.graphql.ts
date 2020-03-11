/* tslint:disable */
/* eslint-disable */

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type MakeOfferButton_artwork = {
    readonly internalID: string;
    readonly " $refType": "MakeOfferButton_artwork";
};
export type MakeOfferButton_artwork$data = MakeOfferButton_artwork;
export type MakeOfferButton_artwork$key = {
    readonly " $data"?: MakeOfferButton_artwork$data;
    readonly " $fragmentRefs": FragmentRefs<"MakeOfferButton_artwork">;
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
