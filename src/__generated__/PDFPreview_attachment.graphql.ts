/* tslint:disable */

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type PDFPreview_attachment = {
    readonly file_name: string;
    readonly " $fragmentRefs": FragmentRefs<"AttachmentPreview_attachment">;
    readonly " $refType": "PDFPreview_attachment";
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
