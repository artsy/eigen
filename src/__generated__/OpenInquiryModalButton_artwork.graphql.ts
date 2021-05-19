/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type OpenInquiryModalButton_artwork = {
    readonly isOfferableFromInquiry: boolean | null;
    readonly " $refType": "OpenInquiryModalButton_artwork";
};
export type OpenInquiryModalButton_artwork$data = OpenInquiryModalButton_artwork;
export type OpenInquiryModalButton_artwork$key = {
    readonly " $data"?: OpenInquiryModalButton_artwork$data;
    readonly " $fragmentRefs": FragmentRefs<"OpenInquiryModalButton_artwork">;
};



const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "OpenInquiryModalButton_artwork",
  "selections": [
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "isOfferableFromInquiry",
      "storageKey": null
    }
  ],
  "type": "Artwork",
  "abstractKey": null
};
(node as any).hash = '8172a374d06e5bbe5f3f61516143b611';
export default node;
