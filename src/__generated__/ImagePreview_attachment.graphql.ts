/* tslint:disable */

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type ImagePreview_attachment = {
    readonly download_url: string;
    readonly " $fragmentRefs": FragmentRefs<"AttachmentPreview_attachment">;
    readonly " $refType": "ImagePreview_attachment";
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
      "alias": "download_url",
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
(node as any).hash = '110bdc586576e57275188aca67e46613';
export default node;
