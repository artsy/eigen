/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type Header_tag = {
    readonly name: string | null;
    readonly " $refType": "Header_tag";
};
export type Header_tag$data = Header_tag;
export type Header_tag$key = {
    readonly " $data"?: Header_tag$data;
    readonly " $fragmentRefs": FragmentRefs<"Header_tag">;
};



const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "Header_tag",
  "selections": [
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "name",
      "storageKey": null
    }
  ],
  "type": "Tag",
  "abstractKey": null
};
(node as any).hash = '2b7c068768642f29ad79b7504cc058fa';
export default node;
