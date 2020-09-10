/* tslint:disable */
/* eslint-disable */

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type PDFPreview_attachment = {
    readonly fileName: string;
    readonly " $fragmentRefs": FragmentRefs<"AttachmentPreview_attachment">;
    readonly " $refType": "PDFPreview_attachment";
};
export type PDFPreview_attachment$data = PDFPreview_attachment;
export type PDFPreview_attachment$key = {
    readonly " $data"?: PDFPreview_attachment$data;
    readonly " $fragmentRefs": FragmentRefs<"PDFPreview_attachment">;
};



const node: ReaderFragment = {
  "kind": "Fragment",
  "name": "PDFPreview_attachment",
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
      "kind": "FragmentSpread",
      "name": "AttachmentPreview_attachment",
      "args": null
    }
  ]
};
(node as any).hash = '807f52ff34b3d5fea81b65e141c22b0b';
export default node;
