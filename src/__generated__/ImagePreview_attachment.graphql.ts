/* tslint:disable */

import { ConcreteFragment } from "relay-runtime";
export type ImagePreview_attachment = {
    readonly download_url: string;
};



const node: ConcreteFragment = {
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
