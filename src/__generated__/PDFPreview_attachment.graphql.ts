/* tslint:disable */

import { ReaderFragment } from "relay-runtime";
import { AttachmentPreview_attachment$ref } from "./AttachmentPreview_attachment.graphql";
declare const _PDFPreview_attachment$ref: unique symbol;
export type PDFPreview_attachment$ref = typeof _PDFPreview_attachment$ref;
export type PDFPreview_attachment = {
    readonly file_name: string;
    readonly " $fragmentRefs": AttachmentPreview_attachment$ref;
    readonly " $refType": PDFPreview_attachment$ref;
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
      "alias": "file_name",
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
(node as any).hash = '989ac15593b7291bc13ef16c11bce59f';
export default node;
