/* tslint:disable */

import { ConcreteFragment } from "relay-runtime";
import { AttachmentPreview_attachment$ref } from "./AttachmentPreview_attachment.graphql";
declare const _PDFPreview_attachment$ref: unique symbol;
export type PDFPreview_attachment$ref = typeof _PDFPreview_attachment$ref;
export type PDFPreview_attachment = {
    readonly file_name: string;
    readonly " $fragmentRefs": AttachmentPreview_attachment$ref;
    readonly " $refType": PDFPreview_attachment$ref;
};



const node: ConcreteFragment = {
  "kind": "Fragment",
  "name": "PDFPreview_attachment",
  "type": "Attachment",
  "metadata": null,
  "argumentDefinitions": [],
  "selections": [
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "file_name",
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
(node as any).hash = '812b3b97609acbb604557bdaefbac873';
export default node;
