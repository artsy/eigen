/* tslint:disable */

import { ConcreteFragment } from "relay-runtime";
declare const _AttachmentPreview_attachment$ref: unique symbol;
export type AttachmentPreview_attachment$ref = typeof _AttachmentPreview_attachment$ref;
export type AttachmentPreview_attachment = {
    readonly id: string;
    readonly " $refType": AttachmentPreview_attachment$ref;
};



const node: ConcreteFragment = {
  "kind": "Fragment",
  "name": "AttachmentPreview_attachment",
  "type": "Attachment",
  "metadata": null,
  "argumentDefinitions": [],
  "selections": [
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "id",
      "args": null,
      "storageKey": null
    }
  ]
};
(node as any).hash = 'c55e4e996032f6359f162b9312ae80cb';
export default node;
