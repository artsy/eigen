/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

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
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "MakeOfferButton_artwork",
  "selections": [
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "internalID",
      "storageKey": null
    }
  ],
  "type": "Artwork",
  "abstractKey": null
};
(node as any).hash = 'c704ec89c83e93427db1eca75f364aef';
export default node;
