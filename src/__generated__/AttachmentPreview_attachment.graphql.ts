/* tslint:disable */

import { ReaderFragment } from "relay-runtime";
export type AttachmentPreview_attachment = {
    readonly internalID: string;
    readonly " $refType": "AttachmentPreview_attachment";
};



const node: ReaderFragment = {
  "kind": "Fragment",
  "name": "AttachmentPreview_attachment",
  "type": "Attachment",
  "metadata": null,
  "argumentDefinitions": [],
  "selections": [
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "internalID",
      "args": null,
      "storageKey": null
    }
  ]
};
(node as any).hash = '2217887427ab884a634dd15c4f22d057';
export default node;
