/* tslint:disable */
/* eslint-disable */

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
  "kind": "Fragment",
  "name": "FileDownload_attachment",
  "type": "Attachment",
  "metadata": null,
  "argumentDefinitions": [],
  "selections": [
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "fileName",
      "args": null,
      "storageKey": null
    },
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
(node as any).hash = '3535ae92c946cf2e14fdc4cd5aabefe9';
export default node;
