/* tslint:disable */
/* eslint-disable */

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
  "kind": "Fragment",
  "name": "InquiryModal_artwork",
  "type": "Artwork",
  "metadata": null,
  "argumentDefinitions": [],
  "selections": [
    {
      "kind": "FragmentSpread",
      "name": "CollapsibleArtworkDetails_artwork",
      "args": null
    }
  ]
};
(node as any).hash = 'f3a097eb76bed326d3113836754160e0';
export default node;
