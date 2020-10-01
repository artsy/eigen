/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

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
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "ImagePreview_attachment",
  "selections": [
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "downloadURL",
      "storageKey": null
    },
    {
      "args": null,
      "kind": "FragmentSpread",
      "name": "AttachmentPreview_attachment"
    }
  ],
  "type": "Attachment",
  "abstractKey": null
};
(node as any).hash = '5c3df8a54035cb3f1ae5991df3ffacec';
export default node;
