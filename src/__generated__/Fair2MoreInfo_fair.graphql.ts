/* tslint:disable */
/* eslint-disable */

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type Fair2MoreInfo_fair = {
    readonly name: string | null;
    readonly " $refType": "Fair2MoreInfo_fair";
};
export type Fair2MoreInfo_fair$data = Fair2MoreInfo_fair;
export type Fair2MoreInfo_fair$key = {
    readonly " $data"?: Fair2MoreInfo_fair$data;
    readonly " $fragmentRefs": FragmentRefs<"Fair2MoreInfo_fair">;
};



const node: ReaderFragment = {
  "kind": "Fragment",
  "name": "Fair2MoreInfo_fair",
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
(node as any).hash = 'a9d2269dd3b64cc657384b71307b72fc';
export default node;
