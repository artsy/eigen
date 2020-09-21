/* tslint:disable */
/* eslint-disable */

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type Fair2Header_fair = {
    readonly name: string | null;
    readonly " $refType": "Fair2Header_fair";
};
export type Fair2Header_fair$data = Fair2Header_fair;
export type Fair2Header_fair$key = {
    readonly " $data"?: Fair2Header_fair$data;
    readonly " $fragmentRefs": FragmentRefs<"Fair2Header_fair">;
};



const node: ReaderFragment = {
  "kind": "Fragment",
  "name": "Fair2Header_fair",
  "type": "Fair",
  "metadata": null,
  "argumentDefinitions": [],
  "selections": [
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "name",
      "args": null,
      "storageKey": null
    }
  ]
};
(node as any).hash = '76eba1e2c2209c73f1b32988bf04b064';
export default node;
