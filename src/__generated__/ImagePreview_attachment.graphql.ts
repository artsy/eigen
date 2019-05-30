/* tslint:disable */

import { ReaderFragment } from "relay-runtime";
import { AttachmentPreview_attachment$ref } from "./AttachmentPreview_attachment.graphql";
declare const _ImagePreview_attachment$ref: unique symbol;
export type ImagePreview_attachment$ref = typeof _ImagePreview_attachment$ref;
export type ImagePreview_attachment = {
    readonly download_url: string;
    readonly " $fragmentRefs": AttachmentPreview_attachment$ref;
    readonly " $refType": ImagePreview_attachment$ref;
};



const node: ReaderFragment = {
  "kind": "Fragment",
  "name": "ImagePreview_attachment",
  "type": "Attachment",
  "metadata": null,
  "argumentDefinitions": [],
  "selections": [
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "download_url",
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
(node as any).hash = '1c4f00856bbc0864503563b67da5d524';
export default node;
