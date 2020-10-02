/* tslint:disable */
/* eslint-disable */

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type Fair2Timing_fair = {
    readonly exhibitionPeriod: string | null;
    readonly startAt: string | null;
    readonly endAt: string | null;
    readonly " $refType": "Fair2Timing_fair";
};
export type Fair2Timing_fair$data = Fair2Timing_fair;
export type Fair2Timing_fair$key = {
    readonly " $data"?: Fair2Timing_fair$data;
    readonly " $fragmentRefs": FragmentRefs<"Fair2Timing_fair">;
};



const node: ReaderFragment = {
  "kind": "Fragment",
  "name": "Fair2Timing_fair",
  "type": "Fair",
  "metadata": null,
  "argumentDefinitions": [],
  "selections": [
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "exhibitionPeriod",
      "args": null,
      "storageKey": null
    },
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "startAt",
      "args": null,
      "storageKey": null
    },
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "endAt",
      "args": null,
      "storageKey": null
    }
  ]
};
(node as any).hash = 'aa6e85b8aaec3370047ba4a0ffcc64c0';
export default node;
