/* tslint:disable */

import { ConcreteFragment } from "relay-runtime";
export type PDFPreview_attachment = {
    readonly file_name: string;
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
