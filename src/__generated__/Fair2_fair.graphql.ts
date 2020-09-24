/* tslint:disable */
/* eslint-disable */

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type Fair2_fair = {
    readonly " $fragmentRefs": FragmentRefs<"Fair2Header_fair" | "Fair2Editorial_fair">;
    readonly " $refType": "Fair2_fair";
};
export type Fair2_fair$data = Fair2_fair;
export type Fair2_fair$key = {
    readonly " $data"?: Fair2_fair$data;
    readonly " $fragmentRefs": FragmentRefs<"Fair2_fair">;
};



const node: ReaderFragment = {
  "kind": "Fragment",
  "name": "Fair2_fair",
  "type": "Fair",
  "metadata": null,
  "argumentDefinitions": [],
  "selections": [
    {
      "kind": "FragmentSpread",
      "name": "Fair2Header_fair",
      "args": null
    },
    {
      "kind": "FragmentSpread",
      "name": "Fair2Editorial_fair",
      "args": null
    }
  ]
};
(node as any).hash = 'a02e0a13f1a4094676e1fcc52266c7a9';
export default node;
