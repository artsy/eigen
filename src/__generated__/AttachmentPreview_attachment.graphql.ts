/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type AttachmentPreview_attachment = {
    readonly internalID: string;
    readonly " $refType": "AttachmentPreview_attachment";
};
export type AttachmentPreview_attachment$data = AttachmentPreview_attachment;
export type AttachmentPreview_attachment$key = {
    readonly " $data"?: AttachmentPreview_attachment$data;
    readonly " $fragmentRefs": FragmentRefs<"AttachmentPreview_attachment">;
};



const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "AttachmentPreview_attachment",
  "selections": [
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "internalID",
      "storageKey": null
    }
  ],
  "type": "Attachment",
  "abstractKey": null
};
(node as any).hash = '2217887427ab884a634dd15c4f22d057';
export default node;
