/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type InquiryModal_artwork = {
    readonly " $fragmentRefs": FragmentRefs<"CollapsibleArtworkDetails_artwork">;
    readonly " $refType": "InquiryModal_artwork";
};
export type InquiryModal_artwork$data = InquiryModal_artwork;
export type InquiryModal_artwork$key = {
    readonly " $data"?: InquiryModal_artwork$data;
    readonly " $fragmentRefs": FragmentRefs<"InquiryModal_artwork">;
};



const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "InquiryModal_artwork",
  "selections": [
    {
      "args": null,
      "kind": "FragmentSpread",
      "name": "CollapsibleArtworkDetails_artwork"
    }
  ],
  "type": "Artwork",
  "abstractKey": null
};
(node as any).hash = 'f3a097eb76bed326d3113836754160e0';
export default node;
