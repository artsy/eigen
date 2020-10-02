/* tslint:disable */
/* eslint-disable */

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type ImagePreview_attachment = {
    readonly downloadURL: string;
    readonly " $fragmentRefs": FragmentRefs<"AttachmentPreview_attachment">;
    readonly " $refType": "ImagePreview_attachment";
};
export type ImagePreview_attachment$data = ImagePreview_attachment;
export type ImagePreview_attachment$key = {
    readonly " $data"?: ImagePreview_attachment$data;
    readonly " $fragmentRefs": FragmentRefs<"ImagePreview_attachment">;
};



const node: ReaderFragment = {
  "kind": "Fragment",
  "name": "ImagePreview_attachment",
  "type": "Attachment",
  "metadata": null,
  "argumentDefinitions": [],
  "selections": [
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "downloadURL",
      "args": null,
      "storageKey": null
    },
    {
      "kind": "FragmentSpread",
      "name": "AttachmentPreview_attachment",
      "args": null
    }
  ]
};
(node as any).hash = '5c3df8a54035cb3f1ae5991df3ffacec';
export default node;
