/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type FileDownload_attachment = {
    readonly fileName: string;
    readonly downloadURL: string;
    readonly " $fragmentRefs": FragmentRefs<"AttachmentPreview_attachment">;
    readonly " $refType": "FileDownload_attachment";
};
export type FileDownload_attachment$data = FileDownload_attachment;
export type FileDownload_attachment$key = {
    readonly " $data"?: FileDownload_attachment$data;
    readonly " $fragmentRefs": FragmentRefs<"FileDownload_attachment">;
};



const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "FileDownload_attachment",
  "selections": [
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "fileName",
      "storageKey": null
    },
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
(node as any).hash = '3535ae92c946cf2e14fdc4cd5aabefe9';
export default node;
