/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type InquiryModal_artwork = {
    readonly internalID: string;
    readonly inquiryQuestions: ReadonlyArray<{
        readonly internalID: string;
        readonly question: string;
    } | null> | null;
    readonly " $fragmentRefs": FragmentRefs<"CollapsibleArtworkDetails_artwork">;
    readonly " $refType": "InquiryModal_artwork";
};
export type InquiryModal_artwork$data = InquiryModal_artwork;
export type InquiryModal_artwork$key = {
    readonly " $data"?: InquiryModal_artwork$data;
    readonly " $fragmentRefs": FragmentRefs<"InquiryModal_artwork">;
};



const node: ReaderFragment = (function(){
var v0 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "internalID",
  "storageKey": null
};
return {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "InquiryModal_artwork",
  "selections": [
    (v0/*: any*/),
    {
      "alias": null,
      "args": null,
      "concreteType": "InquiryQuestion",
      "kind": "LinkedField",
      "name": "inquiryQuestions",
      "plural": true,
      "selections": [
        (v0/*: any*/),
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "question",
          "storageKey": null
        }
      ],
      "storageKey": null
    },
    {
      "args": null,
      "kind": "FragmentSpread",
      "name": "CollapsibleArtworkDetails_artwork"
    }
  ],
  "type": "Artwork",
  "abstractKey": null
};
})();
(node as any).hash = 'd119aba88ecfba5aa5945ec6009f4bd8';
export default node;
