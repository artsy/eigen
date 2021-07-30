/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type About_tag = {
    readonly description: string | null;
    readonly " $refType": "About_tag";
};
export type About_tag$data = About_tag;
export type About_tag$key = {
    readonly " $data"?: About_tag$data;
    readonly " $fragmentRefs": FragmentRefs<"About_tag">;
};



const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "About_tag",
  "selections": [
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "description",
      "storageKey": null
    }
  ],
  "type": "Tag",
  "abstractKey": null
};
(node as any).hash = 'f2ab5c190084f979851aa2f23e8808f5';
export default node;
