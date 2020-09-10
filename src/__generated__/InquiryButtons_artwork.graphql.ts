/* tslint:disable */
/* eslint-disable */

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type InquiryButtons_artwork = {
    readonly internalID: string;
    readonly isPriceHidden: boolean | null;
    readonly " $refType": "InquiryButtons_artwork";
};
export type InquiryButtons_artwork$data = InquiryButtons_artwork;
export type InquiryButtons_artwork$key = {
    readonly " $data"?: InquiryButtons_artwork$data;
    readonly " $fragmentRefs": FragmentRefs<"InquiryButtons_artwork">;
};



const node: ReaderFragment = {
  "kind": "Fragment",
  "name": "InquiryButtons_artwork",
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
    },
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "isPriceHidden",
      "args": null,
      "storageKey": null
    }
  ]
};
(node as any).hash = 'addf5b6223ddce78fd216c2774f4529b';
export default node;
