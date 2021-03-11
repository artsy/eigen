/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type InquiryMakeOfferButton_artwork = {
    readonly internalID: string;
    readonly " $refType": "InquiryMakeOfferButton_artwork";
};
export type InquiryMakeOfferButton_artwork$data = InquiryMakeOfferButton_artwork;
export type InquiryMakeOfferButton_artwork$key = {
    readonly " $data"?: InquiryMakeOfferButton_artwork$data;
    readonly " $fragmentRefs": FragmentRefs<"InquiryMakeOfferButton_artwork">;
};



const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "InquiryMakeOfferButton_artwork",
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
(node as any).hash = 'de8ff637fbf5198ccec4eeb6aefcb734';
export default node;
