/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type TagHeader_tag = {
    readonly name: string | null;
    readonly " $refType": "TagHeader_tag";
};
export type TagHeader_tag$data = TagHeader_tag;
export type TagHeader_tag$key = {
    readonly " $data"?: TagHeader_tag$data | undefined;
    readonly " $fragmentRefs": FragmentRefs<"TagHeader_tag">;
};



const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "TagHeader_tag",
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
(node as any).hash = '4f16f2f0e520c921419cbed9d1352b28';
export default node;
